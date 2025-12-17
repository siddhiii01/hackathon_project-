// We're creating a simple, working internal Step for AI classification (Step 3.1). 
// This is not for unit assigning (remove that name/logic). 
// It's a callable function-like Step that takes a description, 
// calls Gemini to classify, parses JSON, and returns structured output with safe fallbacks.

import { GoogleGenerativeAI } from "@google/generative-ai";

// Config - when it runs
export const config = {
  name: 'ai-classifier',
  type: 'event',
  subscribes: ['ai-classifier'],
  emits:['emergency.updated']
}


// Prompt builder helper – strict for JSON output
const buildPrompt = ( description: string, guessedType?: string, guessedSeverity?: number): string => {
  const guessInfo = guessedType || guessedSeverity
    ? `User guesses: type="${guessedType ?? "unknown"}", severity=${guessedSeverity ?? "unknown"} (you can override if needed).`
    : "";

  return `
    You are an expert emergency dispatcher AI. Analyze the description and classify accurately.

    Description: "${description}"

    ${guessInfo}

    Respond with ONLY valid JSON (no extra text, no markdown):

    {
      "classifiedType": "medical" | "fire" | "police" | "hazmat",
      "severity": number (1-10),
      "requiredUnits": number,
      "specialEquipment": string[],
      "estimatedResponseTimeCritical": number (minutes),
      "reasoning": string,
      "confidence": number (0.0 to 1.0)
    }

    Be decisive and accurate – lives depend on it.
    `.trim();
};

//Main handler – receives input, calls Gemini, parses, fallbacks
export const handler= async (input: { description: string;
    userProvidedType?: string;
    userProvidedSeverity?: number,
    emergencyId: string
   },{ logger, emit }: any) => {
  try{
    const { description, userProvidedType, userProvidedSeverity, emergencyId } = input
    console.log('ai-classifier: ', input);
    
    
    if (!description) {
      throw new Error("Description is required");
    }

    // Build strict prompt
    const prompt = buildPrompt(description, userProvidedType, userProvidedSeverity);

    // Initialize Gemini client (key from env)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Call Gemini
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract and parse JSON (Gemini sometimes adds markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const classification = JSON.parse(jsonMatch[0]);

    await emit({
      topic: 'emergency.updated',
      data: { 
        classification, 
        emergencyId
      }
    })

    logger.info("AI classification successful", { classification });

    return classification;
  } catch(error:any){
    logger.error("AI classification failed", { error: error.message });

    // Safe fallback – never block emergency creation
    return {
      classifiedType: input.userProvidedType || "unknown",
      severity: input.userProvidedSeverity || 5,
      requiredUnits: 1,
      specialEquipment: [],
      estimatedResponseTimeCritical: 10,
      reasoning: "AI failed – using fallback values",
      confidence: 0.0,
    };

  }

}