import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function classifyFeedback(content: string, existingThemes: string[] = []) {
  try {
    const prompt = `
You are an AI feedback classification engine. Analyze the following user feedback and extract structured attributes.

Feedback Content: "${content}"
Existing Workspace Themes: ${JSON.stringify(existingThemes)}

Return a valid JSON object ONLY, with no markdown formatting or extra text, matching this exact structure:
{
  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
  "sentimentScore": number (between -1.0 and 1.0),
  "themes": string[] (choose from existing themes if relevant, or suggest 1-2 concise new ones),
  "featureArea": string (e.g., "Dashboard", "Billing", "Settings", "Export", "General"),
  "rationale": string (a short 1-2 sentence explanation for the classification)
}
    `.trim();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("Empty response received from Groq API.");
    }

    const parsed = JSON.parse(responseText);
    return {
      sentiment: parsed.sentiment || "NEUTRAL",
      sentimentScore: typeof parsed.sentimentScore === "number" ? parsed.sentimentScore : 0.0,
      themes: Array.isArray(parsed.themes) ? parsed.themes : [],
      featureArea: parsed.featureArea || "General",
      rationale: parsed.rationale || "No rationale provided.",
    };
  } catch (error) {
    console.error("Groq classification failed:", error);
    throw new Error("Failed to parse Groq classification response.");
  }
}