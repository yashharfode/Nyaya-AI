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
      "implications": ["String (Bullet point 1)", "String (Bullet point 2)"]
    }`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nyaya-ai.org",
        "X-Title": "NyayaAI"
      },
      body: JSON.stringify({
        model: modelChoice || "inclusionai/ling-3.0-flash:free",
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
    const reasoningText = data.choices[0]?.message?.reasoning || data.choices[0]?.message?.reasoning_content || null;
    const reasoningDetails = data.choices[0]?.message?.reasoning_details || null;
    
    if (!content) {
      throw new Error("No content returned from AI");
    }

    // Clean up potential markdown formatting if the model still returns it
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const parsedData = JSON.parse(content);
    return { 
      success: true, 
      data: parsedData,
      reasoning: reasoningText,
      reasoning_details: reasoningDetails,
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
