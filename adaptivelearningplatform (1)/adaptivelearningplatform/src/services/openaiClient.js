import OpenAI from 'openai';

/**
 * OpenAI client configuration for adaptive learning platform
 * Initializes the OpenAI client with API key from environment variables
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in React
});

export default openai;