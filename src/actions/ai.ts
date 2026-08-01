"use server";

export async function analyzeLegalIssueAction(issueText: string) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error("Missing OpenRouter API Key");
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
      "complaintDraft": "String (A formal, polite complaint letter draft ready for submission. Use \n for newlines.)",
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
