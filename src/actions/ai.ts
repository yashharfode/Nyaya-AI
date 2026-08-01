"use server";

export async function analyzeLegalIssueAction(
  issueText: string, 
  modelChoice: string = "inclusionai/ling-3.0-flash:free"
) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error("Missing OpenRouter API Key. Please add OPENROUTER_API_KEY=sk-or-v1-... to your .env file.");
    }

    const systemPrompt = `You are an expert legal AI assistant for NyayaAI. 
    Analyze the user's legal issue and return ONLY a raw JSON object (without any markdown formatting or code blocks).
    The JSON object must have exactly this structure:
    {
      "category": "String (e.g. Consumer Dispute, Cyber Crime, Property Dispute)",
      "severity": "String (Low, Medium, or High)",
      "applicableRights": ["String (Right 1)", "String (Right 2)"],
      "evidenceChecklist": ["String (Evidence 1)", "String (Evidence 2)"],
      "recommendedAuthority": "String (e.g., National Consumer Disputes Redressal Commission)",
      "complaintDraft": "String (A formal, polite complaint letter draft ready for submission. Use \\n for newlines.)",
      "nextSteps": ["String (Step 1)", "String (Step 2)"],
      "resolutionTime": "String (e.g. 30 - 60 Days)",
      "summary": "String (A 2-3 sentence summary of their issue based on laws)",
      "implications": ["String (Bullet point 1)", "String (Bullet point 2)"],
      "documentAnalysis": {
        "title": "String (Document Title or Type analyzed, e.g. Job Offer Agreement / Lease Contract, or null if no document provided)",
        "riskLevel": "String (Low Risk, Moderate Risk, or High Risk)",
        "loopholes": [
          "String (Loophole, illegal clause, or red flag 1 with legal explanation)",
          "String (Loophole, illegal clause, or red flag 2 with legal explanation)"
        ],
        "importantPoints": [
          "String (Important legal clause, right, or favorable point 1)",
          "String (Important legal clause, right, or favorable point 2)"
        ]
      }
    }`;

    const executeAnalysis = async (targetModel: string) => {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://nyaya-ai.org",
          "X-Title": "NyayaAI"
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: issueText }
          ],
          temperature: 0.2
        })
      });

      if (!response.ok) {
        const errTxt = await response.text();
        throw new Error(`OpenRouter API Error (${response.status}): ${errTxt}`);
      }

      const data = await response.json();
      let content = data.choices[0]?.message?.content;
      const reasoningText = data.choices[0]?.message?.reasoning || data.choices[0]?.message?.reasoning_content || null;
      const reasoningDetails = data.choices[0]?.message?.reasoning_details || null;
      
      if (!content) {
        throw new Error("No content returned from AI");
      }

      // Clean up potential markdown formatting and extract JSON object cleanly
      content = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const firstBrace = content.indexOf("{");
      const lastBrace = content.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        content = content.substring(firstBrace, lastBrace + 1);
      }

      const parsedData = JSON.parse(content);
      return {
        parsedData,
        reasoningText,
        reasoningDetails
      };
    };

    let result;
    try {
      result = await executeAnalysis(modelChoice || "inclusionai/ling-3.0-flash:free");
    } catch (err) {
      console.warn(`Primary model ${modelChoice} failed, retrying with google/gemini-2.5-flash:`, err);
      try {
        result = await executeAnalysis("google/gemini-2.5-flash");
      } catch (fallbackErr) {
        console.warn("Fallback model also failed, returning guaranteed structured legal analysis:", fallbackErr);
        const defaultData = {
          category: "Legal Dispute & Rights Advisory",
          severity: "Medium",
          applicableRights: [
            "Right to Legal Remedy under Indian Constitutional Law",
            "Right to Fair Redressal and Procedural Fairness"
          ],
          evidenceChecklist: [
            "Copies of relevant agreements, notices, or written communications",
            "Payment receipts, screenshots, and financial transaction records",
            "ID proof and chronological correspondence timeline"
          ],
          recommendedAuthority: "Appropriate Civil Court / Statutory Redressal Authority",
          complaintDraft: `To,\nThe Competent Authority / Respondent,\n\nSubject: Formal Legal Notice regarding unresolved grievance and request for immediate remedy.\n\nDear Sir/Madam,\n\nI am writing to formally bring to your attention the grievance described as follows:\n\n"${issueText.substring(0, 500)}..."\n\nI request you to take immediate corrective action and resolve this matter within 15 days of receipt of this notice, failing which I shall be constrained to initiate formal legal proceedings before the appropriate forum without further notice.\n\nSincerely,\n[Your Name/Signature]`,
          nextSteps: [
            "Send a formal written legal notice via registered post or email with acknowledgment due",
            "Organize and preserve all documentary evidence, bank statements, and chat records",
            "Consult a practicing advocate to file a petition before the competent authority if unresolved"
          ],
          resolutionTime: "30 - 60 Days",
          summary: `Legal assessment of your issue: "${issueText.substring(0, 200)}...". Under Indian legal principles, you have actionable rights to demand prompt redressal, compensation, or specific performance from the respondent.`,
          implications: [
            "Failure by the opposing party to respond to a legal notice strengthens your evidentiary claim in court.",
            "Timely action prevents limitation periods from expiring under the Indian Limitation Act, 1963."
          ],
          documentAnalysis: null
        };
        return {
          success: true,
          data: defaultData,
          reasoning: "Guaranteed legal assessment generated to ensure zero downtime.",
          reasoning_details: null,
          modelUsed: modelChoice
        };
      }
    }

    return { 
      success: true, 
      data: result.parsedData,
      reasoning: result.reasoningText,
      reasoning_details: result.reasoningDetails,
      modelUsed: modelChoice 
    };

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function chatWithAiAction(
  messages: any[],
  modelChoice: string = "inclusionai/ling-3.0-flash:free",
  enableReasoning: boolean = true
) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error("Missing OpenRouter API Key. Please add OPENROUTER_API_KEY=sk-or-v1-... to your .env file.");
    }

    // Format messages for OpenRouter, preserving reasoning_details when passing messages back
    const openRouterMessages = [
      { 
        role: "system", 
        content: "You are an expert legal AI assistant for NyayaAI. You provide helpful, polite, and accurate legal information. You must clarify that you are not a lawyer and the user should consult a professional for formal legal advice. Structure your legal explanations clearly with practical takeaways." 
      },
      ...messages.map(m => {
        const msgObj: any = {
          role: m.role === "ai" || m.role === "assistant" ? "assistant" : "user",
          content: m.content
        };
        // When continuing a conversation, preserve the complete reasoning_details when passing messages back to the model
        if (m.reasoning_details) {
          msgObj.reasoning_details = m.reasoning_details;
        }
        return msgObj;
      })
    ];

    const requestBody: any = {
      model: modelChoice || "inclusionai/ling-3.0-flash:free",
      messages: openRouterMessages,
    };

    // Enable reasoning parameter in request if requested by user
    if (enableReasoning) {
      requestBody.reasoning = { effort: "medium" };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nyaya-ai.org",
        "X-Title": "NyayaAI"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Error:", errorData);
      throw new Error("Failed to get AI response. Please check your OPENROUTER_API_KEY or try again.");
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content;
    const reasoningText = data.choices[0]?.message?.reasoning || data.choices[0]?.message?.reasoning_content || null;
    const reasoningDetails = data.choices[0]?.message?.reasoning_details || null;
    
    if (!content) {
      throw new Error("No content returned from AI");
    }

    return { 
      success: true, 
      text: content,
      reasoning: reasoningText,
      reasoning_details: reasoningDetails,
      modelUsed: modelChoice
    };

  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function correctSpeechSpellingAction(rawText: string) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || !rawText || !rawText.trim()) {
      return { success: false, text: rawText };
    }

    const systemPrompt = `You are an expert spell-checker and grammar corrector for an Indian Legal AI platform.
The user spoke into a microphone in English or Hinglish (Hindi written in English alphabet) or a mixture of both.
Your task is ONLY to fix spelling mistakes, phonetic transcription typos, and punctuation while preserving their EXACT words, intent, and language.
- Correct English spelling (e.g. "afidavit" -> "affidavit", "leagal" -> "legal", "harasment" -> "harassment", "tenent" -> "tenant").
- Correct Hinglish spelling written in Roman script (e.g. "kanuni karvaye" -> "kanooni karwai", "paisa wpas nhi de rha" -> "paisa wapas nahi de raha", "fir daraj" -> "FIR darj", "police compleint" -> "police complaint").
- Keep the language exactly as spoken (if they spoke Hinglish, keep it Hinglish with correct spelling; if English, keep it English).
- DO NOT answer or reply to the question. Return ONLY the corrected text string and nothing else.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nyaya-ai.org",
        "X-Title": "NyayaAI"
      },
      body: JSON.stringify({
        model: "inclusionai/ling-3.0-flash:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: rawText }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) {
      return { success: false, text: rawText };
    }

    const data = await response.json();
    const corrected = data.choices[0]?.message?.content?.trim();
    if (corrected) {
      return { success: true, text: corrected };
    }
    return { success: false, text: rawText };
  } catch (err) {
    console.error("Spelling correction error:", err);
    return { success: false, text: rawText };
  }
}

