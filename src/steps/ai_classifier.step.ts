import { GoogleGenerativeAI } from "@google/generative-ai";
import { Severity } from '../../types/models';

export const config = {
  name: 'ai-classifier',
  type: 'event',

  subscribes: ['pending_classification'], 
  emits:['unit.assigning.requested'] 
}


// Prompt builder helper – strict for JSON output
const buildPrompt = ( description: string, guessedType?: string): string => {
  return `
    You are an expert emergency dispatcher AI. Analyze the description and classify accurately.
    NO natural language. NO explanation outside JSON.

    Use ONLY these literal allowed values:
    - classifiedType: "medical" | "fire" | "police"
    - requiredUnitType: "ambulance" | "fire_truck" | "police_car"
    - severity: integer between 1 and 10 inclusive
    - requiredUnits: integer >= 1

    Rules:
    - Do NOT invent new emergency types.
    - Do NOT include comments or trailing text.
    - If unsure, default to userProvidedType or infer conservatively.

    Description: "${description}"

    Output format EXACTLY:
    {
      "classifiedType": "medical" | "fire" | "police" | "hazmat",
      "severity": number (1-10),
      "requiredUnits": number,
      "specialEquipment": string[],
      "reasoning": string,
      "requiredUnitType" "ambulance" | "fire_truck" | "police_car",
      "confidence": number (0.0 to 1.0)
    }

   ONLY return JSON.`;
};

//Main handler – receives input, calls Gemini, parses, fallbacks

export const handler= async (
  input: { description: string; userProvidedType?: string; emergencyId: string},
  { logger, emit,state }: any) => {


  const { description, userProvidedType, emergencyId } = input

  if (!description || !emergencyId) {
    logger.error("Invalid payload for classifier", input);
    return;
  }

  // read from store
  const emergency = await state.get("emergencies", emergencyId);
  if (!emergency) {
    logger.error("Emergency not found for classification", { emergencyId });
    return;
  }

  let classification;

  try{
    // Prompting The Gemini Model
    const prompt = buildPrompt(description, userProvidedType);

    // Initialize Gemini client (key from env)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Calling  Gemini Model 
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract and parse JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    classification = JSON.parse(jsonMatch[0]);

    logger.info("AI classification successful", { classification });
    } catch(error:any){
      logger.error("AI classification failed using fallback value", { error: error.message });
      // Safe fallback – never block emergency creation
      classification = {
        classifiedType: userProvidedType || emergency.type,
        severity: 5,
        requiredUnits: 1,
        specialEquipment: [],
        estimatedResponseTimeCritical: 10,
        reasoning: "AI failed: using fallback values",
        confidence: 0.0,
      };
  }

  // persist classification to state
  const updatedEmergency  = {
    ...emergency,
    severity: classification.severity,
    requiredUnits: classification.requiredUnits,
    aireasoning: classification.reasoning,
    requiredUnitType: classification.requiredUnitType,
    status: "classified"
  }

  await state.set("emergencies", emergencyId, updatedEmergency);

  logger.info("Emergency updated with classification", { emergencyId });
  
  await emit({
      topic: 'unit.assigning.requested',
      data: { 
        emergencyId, classification
      }
    });
  return classification;

  
}