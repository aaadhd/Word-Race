import { GoogleGenAI, Type } from "@google/genai";
import type { RoundData } from '../types.ts';
import { roundDataDB } from '../data/roundDataDB.ts';

// Initialize the GoogleGenAI client safely.
let ai: GoogleGenAI | null = null;
try {
  // This will throw a ReferenceError in the browser because `process` is not defined.
  // We catch it so the app can run using local data without crashing.
  ai = new GoogleGenAI({ apiKey: (process as any).env.API_KEY });
} catch (error) {
    console.warn("GoogleGenAI could not be initialized. This is expected in a browser environment without an API key. The app will rely on local data. AI features will be disabled.");
}

// Keep track of used words to avoid repetition within a single game session.
let usedWords: string[] = [];

/**
 * Resets the list of used words. Called at the start of a new game.
 */
export const resetUsedWords = () => {
  usedWords = [];
};

/**
 * Tries to get the next round's data from the local database file.
 * @returns {RoundData | null} A round data object if an unused one is found, otherwise null.
 */
const getNextLocalRoundData = (): RoundData | null => {
  if (roundDataDB.length === 0) {
    return null; // No local data to use.
  }

  // Find words that haven't been used yet in this session
  const availableRounds = roundDataDB.filter(data => !usedWords.includes(data.word));

  // If all local words have been used, return null to trigger AI fallback
  if (availableRounds.length === 0) {
    return null;
  }

  // Select a random round from the available ones
  const randomIndex = Math.floor(Math.random() * availableRounds.length);
  const selectedRound = availableRounds[randomIndex];

  // Add the word to the used list for this session
  usedWords.push(selectedRound.word);

  return selectedRound;
};

/**
 * Generates a new round of data (word, quiz, image) using the Gemini API.
 * @returns {Promise<RoundData | null>} A promise that resolves to the newly generated round data.
 */
const generateRoundDataWithAI = async (): Promise<RoundData | null> => {
  if (!ai) {
    console.error("Gemini AI client is not initialized. Cannot generate data. Ensure an API key is provided in a valid environment.");
    return null;
  }
  
  try {
    // 1. Generate Word and Quiz
    const prompt = `Generate a single, simple English word appropriate for a 5-7 year old child. The word should be in lowercase. Also create a simple multiple-choice quiz question about the word. Provide 4 options and the correct answer. Do NOT use any of the following words: ${usedWords.join(', ')}.`;

    const textResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING, description: 'A single simple English word for a 5-7 year old, in lowercase.' },
                    quiz: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING, description: 'A simple question about the word.' },
                            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Four multiple choice options.' },
                            correctAnswer: { type: Type.STRING, description: 'The correct answer from the options.' }
                        },
                        required: ['question', 'options', 'correctAnswer']
                    }
                },
                required: ['word', 'quiz']
            },
        },
    });

    const generatedData = JSON.parse(textResponse.text);
    const { word, quiz } = generatedData;

    if (!word || !quiz) {
      throw new Error("AI did not generate valid word/quiz data.");
    }

    // 2. Generate Image for the Word
    const imagePrompt = `A simple, cute, cartoon illustration of a "${word}", on a plain white background, clipart style for a child's game.`;

    const imageResponse = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: imagePrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
        },
    });

    const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;

    return {
        word: word.toLowerCase(),
        quiz: quiz,
        wordImage: imageUrl
    };

  } catch(error) {
    console.error("Error generating data with AI:", error);
    return null;
  }
};


/**
 * Fetches data for the next round, prioritizing local data and falling back to AI.
 * @returns {Promise<RoundData | null>} A promise that resolves to the round data.
 */
export const fetchRoundData = async (): Promise<RoundData | null> => {
  const localData = getNextLocalRoundData();
  
  if (localData) {
    console.log("Using local data for round:", localData.word);
    // Simulate a short delay to allow the loading spinner to be visible
    await new Promise(resolve => setTimeout(resolve, 250));
    return Promise.resolve(localData);
  }

  console.log("Local data exhausted or empty. Generating new round with AI.");
  const aiData = await generateRoundDataWithAI();

  if (aiData) {
    // Add the AI-generated word to the used list to avoid immediate repetition
    usedWords.push(aiData.word);
  }

  return aiData;
};

/**
 * Analyzes a handwritten image of a word using Gemini and returns an accuracy score.
 * @param {string} word The word the user was supposed to write.
 * @param {string} imageBase64 The base64 encoded PNG image of the handwriting.
 * @returns {Promise<number>} A promise that resolves to an accuracy score from 0 to 100.
 */
export const recognizeHandwriting = async (word: string, imageBase64: string): Promise<number> => {
  if (!ai) {
    console.error("Gemini AI client is not initialized. Cannot recognize handwriting.");
    // Return a random score for local testing without an API key
    return Math.floor(Math.random() * 31) + 60; // 60-90
  }

  // Remove the data URL prefix e.g., "data:image/png;base64,"
  const pureBase64 = imageBase64.split(',')[1];
  if (!pureBase64) {
    console.error("Invalid base64 string provided.");
    return 0;
  }

  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/png',
        data: pureBase64,
      },
    };

    const prompt = `This is an image of a 5-7 year old child's attempt to write the word "${word.toUpperCase()}".

Please evaluate it based on two criteria, with spelling being the most important:
1.  **Spelling:** Does the writing correctly spell out the word "${word.toUpperCase()}"? The spelling check should be **case-insensitive**. For example, if the word is "APPLE", then "Apple", "apple", and "aPpLe" are all considered correctly spelled.
2.  **Handwriting Quality:** How legible and well-formed are the letters for this age group?

Calculate a final accuracy score from 0 to 100 based on this:
- If the word is spelled **incorrectly** (e.g., it says "TOMATO" instead of "${word.toUpperCase()}"), the accuracy score must be **10 or less**, regardless of how neat the writing is.
- If the word is spelled **correctly** (case-insensitive), score the handwriting quality from 50 (messy but recognizable) to 100 (very neat).

Respond in JSON format with a single key "accuracy" which is a number from 0 to 100.`;
    
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            accuracy: { 
              type: Type.NUMBER, 
              description: 'A score from 0 to 100 representing handwriting accuracy, prioritizing spelling.'
            },
          },
          required: ['accuracy']
        },
      },
    });

    const resultJson = JSON.parse(response.text);
    const accuracy = resultJson.accuracy;

    if (typeof accuracy === 'number' && accuracy >= 0 && accuracy <= 100) {
      return Math.round(accuracy);
    } else {
      console.error("AI returned invalid accuracy score:", accuracy);
      return 0;
    }

  } catch (error) {
    console.error("Error recognizing handwriting with AI:", error);
    return 0; // Return 0 on error
  }
};