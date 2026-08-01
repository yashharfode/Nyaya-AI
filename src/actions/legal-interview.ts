"use server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const PRIMARY_MODEL = "inclusionai/ling-3.0-flash:free";
const FALLBACK_MODEL = "google/gemini-2.5-flash:free";

export type LegalCategory =
  | "cyber_fraud"
  | "landlord_tenant"
  | "consumer_complaint"
  | "employment"
  | "property_dispute"
  | "domestic_violence"
  | "motor_accident"
  | "cheque_bounce"
  | "other";

export interface InterviewAnswer {
  question: string;
  answer: string;
}

export interface LegalInterviewPlan {
  summary: string;
  rights: string[];
  immediateSteps: string[];
  complaintDraft: string;
  evidenceChecklist: string[];
  authorityToContact: string;
  timeline: Array<{ day: string; action: string }>;
  readinessScore: {
    complaint: number;
    evidence: number;
    witnesses: number;
    documents: number;
    overall: number;
  };
  severity: "low" | "medium" | "high" | "emergency";
}

const CATEGORY_QUESTIONS: Record<LegalCategory, string[]> = {
  cyber_fraud: [
    "What type of cyber fraud happened? (e.g. UPI scam, phishing, fake job offer, blackmail)",
    "When did this happen? (approximate date)",
    "How much money was lost, if any? (₹ amount)",
    "Do you have any transaction IDs, screenshots, or chat records?",
    "From which platform or app did the fraud happen? (e.g. WhatsApp, email, UPI app)",
    "Did you share your OTP, password, or bank details with anyone?",
    "Have you already reported to your bank or the cybercrime portal (cybercrime.gov.in)?",
    "What is your city and state?"
  ],
  landlord_tenant: [
    "What is the issue — deposit not returned, illegal eviction, poor maintenance, or something else?",
    "How much deposit did you pay and when did you vacate the property?",
    "Do you have a registered rent agreement?",
    "Did the landlord give any reason for not returning the deposit? Was it in writing?",
    "Do you have any WhatsApp chats, emails, or written communications with the landlord?",
    "Are there any witnesses (neighbors, brokers, etc.)?",
    "Was the deposit paid by bank transfer or cash?",
    "What is your city? (This determines the applicable Rent Control Act)"
  ],
  consumer_complaint: [
    "What product or service are you complaining about?",
    "When did you purchase it and what was the price?",
    "What is the exact problem — defective product, service not delivered, false advertising, or other?",
    "Have you already contacted the company's customer service? What was their response?",
    "Do you have the purchase receipt, invoice, or order confirmation?",
    "Did you pay by cash, card, or UPI?",
    "Have you tried returning or getting a refund through the platform?",
    "What state are you in? (Determines which Consumer Forum has jurisdiction)"
  ],
  employment: [
    "What is the issue — unpaid salary, wrongful termination, harassment, or something else?",
    "How long have you been working there and what is your designation?",
    "Do you have an employment contract or offer letter?",
    "How much salary is pending, if applicable?",
    "Have you received any written warning letters or termination notice?",
    "Did you report the issue to HR internally? What was the outcome?",
    "Are there any witnesses among your colleagues?",
    "What city is your workplace in?"
  ],
  property_dispute: [
    "What is the nature of the property dispute? (sale, inheritance, encroachment, illegal construction, etc.)",
    "Is the property registered in your name? Do you have the sale deed?",
    "Who is the opposite party — builder, family member, neighbor, or government?",
    "When did the dispute start?",
    "Do you have any documents — registry, mutation, tax receipts?",
    "Has any court notice or police complaint already been filed?",
    "Are there witnesses or other co-owners?",
    "What state is the property in?"
  ],
  domestic_violence: [
    "What type of abuse is happening — physical, emotional, financial, or all?",
    "Who is the abuser? (spouse, in-laws, partner, etc.)",
    "How long has this been going on?",
    "Have you reported this to anyone — police, family, NGO?",
    "Are there any children involved?",
    "Do you have medical records, photos, or any evidence of the abuse?",
    "Do you have a safe place to stay?",
    "What city are you in? (For locating the nearest Protection Officer)"
  ],
  motor_accident: [
    "When and where did the accident happen?",
    "What type of vehicles were involved?",
    "Were you the driver, passenger, or pedestrian?",
    "Was an FIR filed at the police station?",
    "Do you have injuries? Were you hospitalized?",
    "Do you have insurance papers for the vehicle?",
    "Were there any eyewitnesses at the scene?",
    "Is the other party cooperating or denying responsibility?"
  ],
  cheque_bounce: [
    "When was the cheque issued and for what amount?",
    "Why did the cheque bounce? (insufficient funds, signature mismatch, account closed, etc.)",
    "Do you have the original bounced cheque and the bank memo?",
    "What was the purpose of the cheque — loan repayment, business payment, or other?",
    "Have you already sent a legal demand notice to the issuer?",
    "Did the issuer respond to any demand for payment?",
    "What is your relationship with the issuer?",
    "What city are you in?"
  ],
  other: [
    "Please describe your legal issue in detail.",
    "Who is the opposite party? (individual, company, government, etc.)",
    "When did this incident happen?",
    "Do you have any documents or evidence?",
    "Have you approached any authority or filed any complaint so far?",
    "Are there any witnesses?",
    "Has there been any financial loss?",
    "What city and state are you in?"
  ]
};

export async function getInterviewQuestion(
  category: LegalCategory,
  questionIndex: number
): Promise<{ question: string; totalQuestions: number; isLast: boolean }> {
  const questions = CATEGORY_QUESTIONS[category];
  return {
    question: questions[questionIndex] || questions[questions.length - 1],
    totalQuestions: questions.length,
    isLast: questionIndex >= questions.length - 1,
  };
}

export async function generateLegalActionPlan(
  category: LegalCategory,
  answers: InterviewAnswer[],
  initialDescription: string
): Promise<{ success: boolean; plan?: LegalInterviewPlan; error?: string }> {
  if (!OPENROUTER_API_KEY) {
    return { success: false, error: "AI service not configured." };
  }

  const answersText = answers
    .map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`)
    .join("\n\n");

  const prompt = `You are an expert Indian legal assistant. A user has completed a structured legal interview. Based on their answers, generate a comprehensive legal action plan.

USER'S INITIAL DESCRIPTION: ${initialDescription}

CATEGORY: ${category.replace(/_/g, " ").toUpperCase()}

INTERVIEW ANSWERS:
${answersText}

Generate a complete legal action plan in this EXACT JSON format (no markdown, just raw JSON):
{
  "summary": "2-3 sentence summary of the legal situation",
  "rights": ["Right 1 with applicable law section", "Right 2", "Right 3", "Right 4"],
  "immediateSteps": ["Step 1 to take today", "Step 2", "Step 3", "Step 4", "Step 5"],
  "complaintDraft": "A full formal complaint letter draft addressed to the appropriate authority. Include all relevant facts from the interview. Make it professional and legally worded. Minimum 200 words.",
  "evidenceChecklist": ["Evidence item 1", "Evidence item 2", "Evidence item 3", "Evidence item 4", "Evidence item 5"],
  "authorityToContact": "Name of the specific authority, court, or forum to contact (e.g. District Consumer Forum, Cyber Crime Police Station, Labour Commissioner, etc.)",
  "timeline": [
    {"day": "Today", "action": "Specific action to take today"},
    {"day": "Within 2 Days", "action": "Action"},
    {"day": "Within 7 Days", "action": "Action"},
    {"day": "Within 30 Days", "action": "Action"},
    {"day": "Within 60 Days", "action": "Action"}
  ],
  "readinessScore": {
    "complaint": 85,
    "evidence": 60,
    "witnesses": 40,
    "documents": 75,
    "overall": 70
  },
  "severity": "medium"
}

For readinessScore: estimate percentages (0-100) based on what evidence/documents/witnesses the user mentioned having. For severity: use "low", "medium", "high", or "emergency" based on urgency. Return ONLY valid JSON.`;

  const tryModel = async (model: string) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nyayaai.com",
        "X-Title": "NyayaAI Legal Interview",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) throw new Error(`Model ${model} failed: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content;
  };

  try {
    let rawText: string | undefined;
    try {
      rawText = await tryModel(PRIMARY_MODEL);
    } catch {
      rawText = await tryModel(FALLBACK_MODEL);
    }

    if (!rawText) throw new Error("Empty response from AI");

    // Extract JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const plan: LegalInterviewPlan = JSON.parse(jsonMatch[0]);
    return { success: true, plan };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to generate legal plan" };
  }
}
