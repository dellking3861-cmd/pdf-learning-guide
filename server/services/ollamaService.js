import axios from 'axios';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

/**
 * Generate quiz questions from PDF content using Ollama
 */
export const generateQuizFromContent = async (pdfContent) => {
  try {
    const prompt = `Based on the following PDF content, generate 5 multiple-choice quiz questions. 
    
PDF Content:
${pdfContent.substring(0, 2000)}

Return the response in JSON format like this:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct"
    }
  ]
}

Only return valid JSON, no other text.`;

    const response = await axios.post(
      `${OLLAMA_API_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.7,
      },
      { timeout: 60000 }
    );

    // Parse the response
    const responseText = response.data.response;
    
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse Ollama response');
  } catch (error) {
    console.error('Ollama API Error:', error.message);
    throw new Error(`Quiz generation failed: ${error.message}`);
  }
};

/**
 * Generate quiz feedback based on user answers
 */
export const generateFeedback = async (question, userAnswer, correctAnswer) => {
  try {
    const prompt = `User answered a quiz question:
    
Question: ${question}
User's Answer: ${userAnswer}
Correct Answer: ${correctAnswer}

Provide brief feedback explaining why the answer is correct/incorrect. Keep it under 100 words.`;

    const response = await axios.post(
      `${OLLAMA_API_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.5,
      },
      { timeout: 30000 }
    );

    return response.data.response;
  } catch (error) {
    console.error('Ollama Feedback Error:', error.message);
    throw new Error('Feedback generation failed');
  }
};

export default {
  generateQuizFromContent,
  generateFeedback,
};
