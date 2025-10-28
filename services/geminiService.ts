import { GoogleGenAI, Type } from "@google/genai";
import type { RoundData } from '../types.ts';
import { roundDataDB } from '../data/roundDataDB.ts';

// Initialize the GoogleGenAI client safely.
let ai: GoogleGenAI | null = null;
try {
  // This will throw a ReferenceError in the browser because `process` is not defined.
  // We catch it so the app can run using local data without crashing.
  // Vite는 import.meta.env에서 환경 변수를 로드함
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.API_KEY || (process as any).env?.GEMINI_API_KEY || (process as any).env?.VITE_GEMINI_API_KEY;
  console.log("🔑 API Key Status:", apiKey ? "✅ Found" : "❌ Missing");
  console.log("🔑 API Key Preview:", apiKey ? `${apiKey.substring(0, 10)}...` : "None");
  
  if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY_HERE") {
    ai = new GoogleGenAI({ apiKey });
    console.log("🤖 Gemini AI Client: ✅ Initialized successfully");
  } else {
    console.warn("🤖 Gemini AI Client: ❌ No valid API key found (using placeholder or empty)");
  }
} catch (error) {
  console.error("🤖 Gemini AI Client: ❌ Initialization failed", error);
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
 * Tests the Gemini API connection by making a simple request.
 * @returns {Promise<boolean>} True if API is working, false otherwise.
 */
export const testGeminiConnection = async (): Promise<boolean> => {
  if (!ai) {
    console.error("🤖 API Test: ❌ AI client not initialized");
    return false;
  }

  try {
    console.log("🤖 API Test: 🔄 Testing Gemini API connection...");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say 'API connection successful' in one word.",
      config: {
        responseMimeType: "text/plain",
      },
    });

    const result = response.text.trim().toLowerCase();
    console.log("🤖 API Test: ✅ Response received:", result);
    
    if (result.includes("successful") || result.includes("success")) {
      console.log("🤖 API Test: ✅ Connection successful!");
      return true;
    } else {
      console.log("🤖 API Test: ⚠️ Unexpected response:", result);
      return false;
    }
  } catch (error) {
    console.error("🤖 API Test: ❌ Connection failed:", error);
    return false;
  }
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
 * Analyzes a handwritten image of a word using Gemini and returns whether it's correct or incorrect.
 * @param {string} word The word the user was supposed to write.
 * @param {string} imageBase64 The base64 encoded PNG image of the handwriting.
 * @returns {Promise<boolean>} A promise that resolves to true if correct, false if incorrect.
 */
export const recognizeHandwriting = async (word: string, imageBase64: string): Promise<boolean> => {
  if (!ai) {
    console.warn("Gemini AI client is not initialized. Returning false for safety.");
    // API 키가 없을 때는 안전을 위해 틀림으로 처리
    return false;
  }

  // Remove the data URL prefix e.g., "data:image/png;base64,"
  const pureBase64 = imageBase64.split(',')[1];
  if (!pureBase64) {
    console.error("Invalid base64 string provided.");
    return false;
  }

  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/png',
        data: pureBase64,
      },
    };

    const prompt = `You are an extremely strict handwriting evaluator for a children's spelling game. 

**TARGET WORD: "${word.toLowerCase()}" (${word.length} letters)**

**YOUR TASK:**
1. Look at the handwritten image
2. Try to read what word is written
3. Compare it EXACTLY with "${word.toLowerCase()}"
4. Be EXTREMELY STRICT - default to INCORRECT unless you are 100% certain

**STEP-BY-STEP ANALYSIS:**
1. What do you see written? (be specific)
2. Can you identify each individual letter?
3. Does it spell "${word.toLowerCase()}" exactly?
4. Is it complete (all ${word.length} letters present)?

**ONLY mark as CORRECT if:**
- You can clearly read a complete word
- It is exactly "${word.toLowerCase()}" (case-insensitive)
- All ${word.length} letters are present and recognizable
- The spelling is 100% correct

**Mark as INCORRECT if:**
- You see random lines, scribbles, or shapes
- The word is incomplete or missing letters
- The word is different from "${word.toLowerCase()}"
- You cannot clearly identify what is written
- Only partial letters are visible
- It's unreadable or illegible
- You have ANY doubt about what is written

**CRITICAL: When in doubt, mark as INCORRECT. This is a spelling game - only perfect matches count.**

Analyze the image and respond with:
{
  "written_word": "the exact word you see written (or 'unreadable')",
  "letter_count": exact number of letters you can identify,
  "word_match": true only if it exactly matches "${word.toLowerCase()}",
  "correct": true only if written_word exactly matches "${word.toLowerCase()}"
}`;
    
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            written_word: {
              type: Type.STRING,
              description: 'The exact word written in the image, or "unreadable" if illegible.'
            },
            letter_count: {
              type: Type.NUMBER,
              description: 'Exact number of letters that can be identified.'
            },
            word_match: {
              type: Type.BOOLEAN,
              description: 'True only if written_word exactly matches the target word.'
            },
            correct: { 
              type: Type.BOOLEAN, 
              description: 'True only if written_word exactly matches the target word.'
            },
          },
          required: ['written_word', 'letter_count', 'word_match', 'correct']
        },
      },
    });

    const resultJson = JSON.parse(response.text);
    const writtenWord = resultJson.written_word;
    const letterCount = resultJson.letter_count;
    const wordMatch = resultJson.word_match;
    const correct = resultJson.correct;

    console.log(`AI 분석 결과:`);
    console.log(`- 목표 단어: "${word.toLowerCase()}" (${word.length}글자)`);
    console.log(`- 인식된 단어: "${writtenWord}" (${letterCount}글자)`);
    console.log(`- 단어 일치: ${wordMatch}`);
    console.log(`- AI 판정: ${correct}`);

    // 다중 검증 로직 (개선된 버전)
    if (typeof correct === 'boolean' && typeof letterCount === 'number' && typeof wordMatch === 'boolean') {
      // 1. 인식된 단어가 unreadable이면 틀림
      if (writtenWord.toLowerCase() === 'unreadable' || writtenWord.toLowerCase() === 'illegible') {
        console.log(`결과: 틀림 (읽을 수 없음)`);
        return false;
      }

      // 2. 글자 수가 너무 부족하면 틀림 (50% 미만)
      if (letterCount < Math.floor(word.length * 0.5)) {
        console.log(`결과: 틀림 (글자 수 너무 부족: ${letterCount} < ${Math.floor(word.length * 0.5)})`);
        return false;
      }

      // 3. 인식된 단어와 목표 단어 직접 비교 (대소문자 무시)
      const recognizedWordLower = writtenWord.toLowerCase().trim();
      const targetWordLower = word.toLowerCase().trim();
      
      if (recognizedWordLower === targetWordLower) {
        console.log(`결과: 맞음 (직접 비교 일치: "${recognizedWordLower}" === "${targetWordLower}")`);
        return true;
      }

      // 4. AI의 판정을 참고하되, 직접 비교가 더 우선
      if (correct) {
        console.log(`결과: 맞음 (AI 판정 + 직접 비교 통과)`);
        return true;
      }

      // 5. 모든 검증을 통과하지 못한 경우
      console.log(`결과: 틀림 (검증 실패 - 인식: "${recognizedWordLower}", 목표: "${targetWordLower}")`);
      return false;
    } else {
      console.error("AI returned invalid result:", { writtenWord, letterCount, wordMatch, correct });
      return false;
    }

  } catch (error) {
    console.error("❌ Error recognizing handwriting with AI:", error);
    
    // 쿼터 초과 오류 감지
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = (error as any).message;
      if (errorMessage.includes('429') || errorMessage.includes('Quota exceeded')) {
        console.error("⚠️ Gemini API 쿼터가 초과되었습니다. 손글씨 인식 실패 - 틀림으로 처리합니다.");
        return false;
      }
    }
    
    // 기타 오류 시 안전을 위해 틀림으로 처리
    console.error("⚠️ 손글씨 인식 API 오류 발생 - 안전을 위해 틀림으로 처리합니다.");
    return false;
  }
};