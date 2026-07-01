import * as FileSystem from "expo-file-system/legacy";

/**
 * Convert image URI → Base64
 */
export async function imageToBase64(uri) {
  const encoding = FileSystem.EncodingType?.Base64 ?? "base64";

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding,
  });

  return base64;
}

/**
 * Requested prompt styles for different analysis types
 */
export const PROMPTS = {
  academic: `Act as a university professor reviewing this image. Identify the visible objects, describe the educational or contextual setting, and give one piece of constructive feedback. Respond ONLY with valid JSON using the keys objects, context, activities, and recommendations.`,
  safety: `Act as a workplace safety inspector reviewing this image. Identify any visible hazards or clearly state that no hazards are present. Respond ONLY with valid JSON using the keys objects, context, activities, and recommendations.`,
  inventory: `Act as an asset management clerk documenting this image. Provide a clean list of visible assets with no extra commentary. Respond ONLY with valid JSON using the keys objects, context, activities, and recommendations.`,
};

export const JSON_SCHEMA = `Respond ONLY with valid JSON:

{
  "objects": ["..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}`;

/**
 * Send image + prompt to Gemini API
 */
const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY; // ✅ FIXED

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/` +
  `gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`; // ✅ FIXED

export async function analyzeImage(base64Image, promptText) {
  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${promptText}\n\n${JSON_SCHEMA}` },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    });

    const json = await response.json();

    console.log("🔥 Gemini response:", json);

    return json;
  } catch (error) {
    console.log("❌ Gemini API error:", error);
    throw error;
  }
}
