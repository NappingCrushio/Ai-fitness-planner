import { GoogleGenAI, Type } from "@google/genai";
import { Exercise, AISuggestions } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallFeedback: {
            type: Type.STRING,
            description: "General feedback on the workout structure, balance, and intensity. Be encouraging and motivational."
        },
        exerciseSuggestions: {
            type: Type.ARRAY,
            description: "Specific suggestions for each exercise in the user's workout.",
            items: {
                type: Type.OBJECT,
                properties: {
                    exerciseName: {
                        type: Type.STRING,
                        description: "The name of the exercise being commented on."
                    },
                    suggestion: {
                        type: Type.STRING,
                        description: "A specific, actionable tip for this exercise. For example, suggest weight progression, form correction, or alternative exercises."
                    }
                },
                required: ["exerciseName", "suggestion"]
            }
        }
    },
    required: ["overallFeedback", "exerciseSuggestions"]
};

export const getWorkoutSuggestions = async (planName: string, workout: Exercise[]): Promise<AISuggestions> => {
    const workoutDetails = workout.map(ex => `${ex.name}: ${ex.sets} sets of ${ex.reps} reps at ${ex.weight}kg`).join('\n');
    
    const prompt = `
Analyze the following workout plan named "${planName}" for a user whose goal is muscle gain.
Provide overall feedback and specific, actionable suggestions for each exercise.
Be encouraging and act as an expert personal trainer.

Workout Plan Contents:
${workoutDetails}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7,
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        // Basic validation to ensure the parsed object matches the expected structure
        if (parsedJson && typeof parsedJson.overallFeedback === 'string' && Array.isArray(parsedJson.exerciseSuggestions)) {
            return parsedJson as AISuggestions;
        } else {
            throw new Error("AI response is not in the expected format.");
        }

    } catch (error) {
        console.error("Error fetching AI suggestions:", error);
        throw new Error("Failed to get suggestions from AI. The model may be unavailable or the request failed. Please check your connection and API key.");
    }
};
