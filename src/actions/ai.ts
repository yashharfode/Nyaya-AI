"use server";

export async function analyzeLegalIssueAction(issueText: string) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error("Missing OpenRouter API Key");
    }

    const systemPrompt = `You are an expert legal AI assistant for NyayaAI, an AI-powered Legal Operating System specializing in Indian law.
    Analyze the user's legal issue and return ONLY a raw JSON object (without any markdown formatting or code blocks).
    Never generate simple paragraphs. Always return structured actionable information.
    The JSON object must have exactly this structure:
    {
      "caseOverview": {
        "title": "String (e.g. Cyber Fraud, Property Dispute)",
        "category": "String",
        "subcategory": "String",
        "severity": "String (Low, Medium, High)",
        "urgency": "String (e.g. Urgent Action Required)",
        "estimatedComplexity": "String (e.g. Low, Medium, High)",
        "confidenceScore": "Number (0-100)"
      },
      "incidentSummary": "String (Rewrite the user's issue professionally and concisely. Explain what happened.)",
      "applicableRights": [
        { "name": "String (e.g. Right to Safety)", "type": "String (Fundamental, Legal, Citizen)", "explanation": "String (Simple explanation)" }
      ],
      "applicableLaws": [
        { "name": "String (Law Name)", "purpose": "String", "whyApplies": "String", "maxPunishment": "String (if applicable, else null)", "explanation": "String (Simple explanation)" }
      ],
      "riskAnalysis": {
        "riskLevel": "String (Low, Medium, High)",
        "immediateThreat": "Boolean",
        "financialRisk": "String (Low, Medium, High)",
        "legalComplexity": "String (Low, Medium, High)",
        "evidenceRisk": "String (Low, Medium, High)",
        "needLawyer": "Boolean",
        "needImmediateAction": "Boolean"
      },
      "evidenceManager": {
        "required": ["String"],
        "optional": ["String"],
        "digital": ["String"],
        "physical": ["String"],
        "witnesses": ["String"],
        "missing": ["String"]
      },
      "actionRoadmap": [
        { "step": "String", "duration": "String", "status": "String (done, active, or pending)" }
      ],
      "governmentPortals": [
        { "name": "String", "url": "String (real URL)", "purpose": "String" }
      ],
      "complaintDraft": "String (Formal complaint letter. Use \\n for newlines)",
      "documentChecklist": ["String (e.g. Marriage Certificate, Bank Statements, Screenshots)"],
      "nextBestActions": {
        "today": ["String"],
        "tomorrow": ["String"],
        "thisWeek": ["String"],
        "emergency": ["String"]
      },
      "faqs": [
        { "question": "String", "answer": "String" }
      ],
      "legalEducation": {
        "articles": ["String"],
        "rights": ["String"],
        "terms": [{ "term": "String", "definition": "String" }],
        "examples": ["String"]
      },
      "similarScenarios": [
        { "scenario": "String", "actionToTake": "String" }
      ]
    }
    The actionRoadmap status should be "done" for the first step, "active" for the second, and "pending" for the rest.
    For governmentPortals, use real URLs like cybercrime.gov.in, eCourts.gov.in, etc.
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-4-26b-a4b-it:free",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: issueText }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Error:", errorData);
      throw new Error("Failed to analyze issue. Please try again.");
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content returned from AI");
    }

    // Clean up potential markdown formatting if the model still returns it
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const parsedData = JSON.parse(content);
    return { success: true, data: parsedData };

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function chatWithAiAction(messages: { role: string, content: string }[]) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error("Missing OpenRouter API Key");
    }

    // Format messages for OpenRouter
    const openRouterMessages = [
      { 
        role: "system", 
        content: "You are an expert legal AI assistant for NyayaAI. You provide helpful, polite, and accurate legal information. You must clarify that you are not a lawyer and the user should consult a professional for formal legal advice." 
      },
      ...messages.map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content
      }))
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-4-26b-a4b-it:free",
        messages: openRouterMessages
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Error:", errorData);
      throw new Error("Failed to get AI response. Please try again.");
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content returned from AI");
    }

    return { success: true, text: content };

  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}
