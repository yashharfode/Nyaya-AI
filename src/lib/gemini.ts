import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Google Gemini AI Integration for NyayaAI
 * Provides cutting-edge legal reasoning, document loophole analysis, and multilingual legal advisory
 * powered by Google DeepMind's Gemini models.
 */

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

let genAIInstance: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI | null {
  if (!genAIInstance && geminiApiKey) {
    genAIInstance = new GoogleGenerativeAI(geminiApiKey);
  }
  return genAIInstance;
}

export function isGeminiConfigured(): boolean {
  return Boolean(geminiApiKey && geminiApiKey.length > 5);
}

export interface GeminiLegalAnalysisResult {
  category: string;
  severity: "Low" | "Medium" | "High";
  applicableRights: string[];
  evidenceChecklist: string[];
  recommendedAuthority: string;
  complaintDraft: string;
  nextSteps: string[];
  resolutionTime: string;
  summary: string;
  implications: string[];
}

/**
 * Analyzes citizen legal issues using Google Gemini 1.5 Flash / 2.0 Flash
 */
export async function analyzeLegalIssueWithGemini(
  issueDescription: string,
  modelName: string = "gemini-1.5-flash"
): Promise<GeminiLegalAnalysisResult | null> {
  const client = getGeminiClient();
  if (!client) {
    return null;
  }

  const model = client.getGenerativeModel({
    model: modelName,
    systemInstruction: `You are an expert Indian Legal AI Assistant for NyayaAI.
Analyze the user's issue according to the Bharatiya Nyaya Sanhita (BNS 2023), IT Act 2000, Consumer Protection Act 2019, and the Indian Contract Act.
Return ONLY valid JSON matching this schema:
{
  "category": "String",
  "severity": "Low" | "Medium" | "High",
  "applicableRights": ["String"],
  "evidenceChecklist": ["String"],
  "recommendedAuthority": "String",
  "complaintDraft": "String",
  "nextSteps": ["String"],
  "resolutionTime": "String",
  "summary": "String",
  "implications": ["String"]
}`,
  });

  const response = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: issueDescription }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const text = response.response.text();
  try {
    return JSON.parse(text) as GeminiLegalAnalysisResult;
  } catch (err) {
    console.warn("Failed to parse Gemini JSON output:", err);
    return null;
  }
}

/**
 * Analyzes legal contract documents or agreements for hidden clauses and loopholes
 */
export async function auditContractWithGemini(
  documentText: string,
  docTitle: string = "Legal Document"
) {
  const client = getGeminiClient();
  if (!client) {
    return null;
  }

  const model = client.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are an elite legal contract auditor specializing in Indian statutory law.
Inspect this contract (${docTitle}) and identify unfair terms, statutory violations, or hidden loopholes.
Return ONLY valid JSON:
{
  "title": "${docTitle}",
  "riskLevel": "Low Risk" | "Moderate Risk" | "High Risk",
  "loopholes": ["Clause 1 critique", "Clause 2 critique"],
  "importantPoints": ["Key protection 1", "Key protection 2"]
}`,
  });

  const response = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: documentText }] }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });

  try {
    return JSON.parse(response.response.text());
  } catch {
    return null;
  }
}
