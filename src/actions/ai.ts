"use server";

export async function analyzeLegalIssueAction(issueText: string) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error("Missing OpenRouter API Key");
    }

    const systemPrompt = `You are an expert legal AI assistant for NyayaAI, specializing in Indian law.
    Analyze the user's legal issue and return ONLY a raw JSON object (without any markdown formatting or code blocks).
    The JSON object must have exactly this structure:
    {
      "category": "String (e.g. Consumer Dispute, Cyber Crime, Property Dispute)",
      "severity": "String (Low, Medium, or High)",
      "caseStrengthScore": 75,
      "applicableRights": ["String with specific Indian law/section e.g. Section 66C IT Act 2000"],
      "evidenceChecklist": ["String (Evidence item)"],
      "recommendedAuthority": "String",
      "complaintDraft": "String (formal complaint letter. Use \\n for newlines)",
      "nextSteps": ["String (Step 1)", "String (Step 2)", "String (Step 3)"],
      "resolutionTime": "String (e.g. 30 - 60 Days)",
      "summary": "String (2-3 sentence summary)",
      "implications": ["String"],
      "timeline": [
        { "step": "String", "duration": "String", "status": "done" },
        { "step": "String", "duration": "String", "status": "active" },
        { "step": "String", "duration": "String", "status": "pending" },
        { "step": "String", "duration": "String", "status": "pending" },
        { "step": "String", "duration": "String", "status": "pending" }
      ],
      "quickActions": [
        { "label": "String", "url": "String (real URL)", "icon": "shield" },
        { "label": "String", "url": "String (real URL)", "icon": "globe" }
      ],
      "landmarkCases": [
        { "case": "String", "court": "String", "year": "String", "relevance": "String" }
      ],
      "riskFactors": ["String (risk 1)", "String (risk 2)"]
    }
    The caseStrengthScore must be a number from 0-100. Set timeline[0].status to "done", timeline[1].status to "active", the rest to "pending".
    For quickActions, use real government portal URLs like cybercrime.gov.in, consumerhelpline.gov.in, etc.
    For landmarkCases, cite 1-2 real relevant Indian Supreme Court or High Court judgments.
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

