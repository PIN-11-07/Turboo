import axios from 'axios';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;


export class CarAnalysisService {
  /**
   * Sends the car image to Gemini for analysis and extracts structured data.
   * @param {string} imageBase64 - The pure Base64 encoded image string.
   * @param {string} mimeType - The MIME type of the image (e.g., 'image/jpeg', 'image/png').
   */
  static async analyzeCarImage(imageBase64, mimeType = 'image/jpeg') {
    if (!GEMINI_API_KEY) {
      throw new Error('The Gemini API Key (EXPO_PUBLIC_GEMINI_API_KEY) is missing.');
    }

    try {
      const prompt = `
      You are an automotive expert. Analyze this car image.
      Extract the following technical data in strict JSON format (RFC 8259).
      
      Required fields:
      - make (brand)
      - model (precise model)
      - year (estimated year, string format "YYYY")
      - color (dominant body color)
      - body_type (type: SUV, Sedan, Coupe, Convertible, Wagon, etc.)
      - condition (general state: Excellent, Good, Average, Needs restoration)
      - features (array of strings: sunroof, alloy wheels, LED headlights, leather interior, etc.)

      If a value is uncertain or undetectable, use null or an empty string.
      `;

      // Request configuration
      const requestBody = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        // Force the model to output pure JSON
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.1, // Low temperature for factual precision
        },
      };

      const response = await axios.post(GEMINI_URL, requestBody, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000, // 30 seconds timeout
      });

      // Response extraction
      const candidate = response.data?.candidates?.[0];

      if (!candidate || !candidate.content || !candidate.content.parts) {
        console.error("Unexpected Gemini response structure:", JSON.stringify(response.data));
        throw new Error('Empty response from AI.');
      }

      const rawText = candidate.content.parts[0].text;

      // Since response_mime_type is set to JSON, we parse the raw text
      const parsedData = JSON.parse(rawText);

      return this.normalizeData(parsedData);

    } catch (error) {
      // Enhanced error handling for console logging and user feedback
      if (error.response) {
        console.error('Gemini API Error (Status):', error.response.status);
        console.error('Gemini API Error (Data):', JSON.stringify(error.response.data, null, 2));

        let message = error.response.data?.error?.message || 'Unknown error';
        if (error.response.status === 404) {
          message = "AI model not found or invalid API key.";
        }
        throw new Error(`API Error: ${message}`);
      } else if (error.request) {
        console.error('Network Error (No response):', error.message);
        throw new Error('Network error. Check your connection.');
      } else {
        console.error('Client Error:', error.message);
        throw error;
      }
    }
  }

  /**
   * Generates a commercial description based on extracted car data.
   */
  static async generateCarDescription(carData) {
    if (!GEMINI_API_KEY) return "Description unavailable (API Key missing)";

    // If analysis indicates no car detected (no meaningful fields), skip calling Gemini
    const isEmpty = (v) => v === null || v === undefined || (typeof v === 'string' && v.trim() === '');
    const noDetection =
      !carData ||
      (isEmpty(carData.make) && isEmpty(carData.model));

    if (noDetection) {
      return "";
    }

    try {
      const prompt = `
      Write a short, engaging, and professional sales ad (max 80 words) for this car in English:
      ${JSON.stringify(carData)}
      Use a sales-oriented yet honest tone. Respond in English. No title, just the paragraph.
      If you don't recognize a car on the photo or data is insufficient, respond with an empty description "".`;

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const response = await axios.post(GEMINI_URL, requestBody, {
        headers: { 'Content-Type': 'application/json' }
      });

      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    } catch (error) {
      console.error('Description generation error:', error);
      return "";
    }
  }

  // Sanitizes and normalizes the parsed data structure
  static normalizeData(data) {
    return {
      make: data.make || '',
      model: data.model || '',
      year: data.year ? String(data.year) : '',
      color: data.color || '',
      body_type: data.body_type || '',
      condition: data.condition || 'Good',
      features: Array.isArray(data.features) ? data.features : [],
    };
  }
}