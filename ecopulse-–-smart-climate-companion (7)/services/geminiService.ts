
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from "../types";

let ai: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
    if (!ai) {
        // FIX: The API key MUST be obtained from the environment variable `process.env.API_KEY` as per the coding guidelines.
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            // Throw a specific error that can be caught and handled gracefully in the UI.
            throw new Error("API_KEY_MISSING");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
}

const systemInstruction = `You are 'EcoPulse', an AI assistant dedicated to educating and helping users with climate change, heat waves, and environmental sustainability.
- Be helpful, positive, and provide actionable advice.
- Keep responses concise and easy to understand.
- When asked about heatwave tips, provide practical safety measures.
- When asked about recycling, explain its importance and give clear instructions.
- When asked about sustainable living, offer simple, everyday tips.
- Your goal is to empower users to make a positive environmental impact.`;


export const getChatbotResponse = async (prompt: string): Promise<string> => {
    try {
        const genAI = getAI();
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error && error.message.startsWith("API_KEY_MISSING")) {
            // FIX: Updated error message to refer to `API_KEY` instead of `VITE_API_KEY`.
            return "Configuration Error: The Gemini API key is missing. Please ask the site administrator to set the `API_KEY` environment variable in the deployment settings.";
        }
        return "I'm sorry, but I'm having trouble connecting to my brain right now. Please try again in a moment.";
    }
};

export const getWeatherFromGemini = async (location: string): Promise<WeatherData> => {
    try {
        const genAI = getAI();
        const prompt = `Get the current weather for ${location}. Provide the city name, temperature in Celsius, humidity in percentage, and the calculated heat index in Celsius. If the location is generic (e.g., based on lat/lon), determine the most likely city or region name and use that in the response.`;
        
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        city: { type: Type.STRING, description: "The name of the city for the weather data." },
                        temperature: { type: Type.NUMBER, description: "Temperature in Celsius." },
                        humidity: { type: Type.NUMBER, description: "Humidity in percentage." },
                        heatIndex: { type: Type.NUMBER, description: "Calculated heat index in Celsius." },
                    },
                    required: ['city', 'temperature', 'humidity', 'heatIndex'],
                }
            },
        });

        let jsonStr = response.text.trim();
        const weatherData = JSON.parse(jsonStr);

        // A quick validation
        if (typeof weatherData.city !== 'string' || typeof weatherData.temperature !== 'number' || typeof weatherData.humidity !== 'number' || typeof weatherData.heatIndex !== 'number') {
            throw new Error('Invalid data format received from AI.');
        }

        return weatherData;

    } catch (error) {
        console.error("Gemini API call for weather failed:", error);
        if (error instanceof Error && error.message.startsWith("API_KEY_MISSING")) {
            // FIX: Updated error message to refer to `API_KEY` instead of `VITE_API_KEY`.
            throw new Error("Configuration Error: The Gemini API key is missing. Please ask the site administrator to set the `API_KEY` environment variable in the deployment settings.");
        }
        throw new Error("I'm sorry, I couldn't fetch the real-time weather data. Please try again.");
    }
};