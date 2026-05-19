import { Platform } from 'react-native';
import { AnalyzeRequest, AnalyzeResponse } from './types';

/**
 * Configure the Backend URL based on the environment.
 * 
 * - Web development (npm run web): http://localhost:8000
 * - Android Emulator: http://10.0.2.2:8000
 * - Physical Device (Expo Go): Replace '192.168.x.x' with your computer's local IP address.
 */
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Android emulator maps 10.0.2.2 to the host machine's localhost
      return 'http://10.0.2.2:8000';
    } else if (Platform.OS === 'web') {
      // Web browser can directly hit localhost
      return 'http://localhost:8000';
    }
    
    // IMPORTANT: If you are running on a physical phone using Expo Go,
    // you must change this URL to your computer's actual local IP address!
    // Example: return 'http://192.168.1.100:8000';
    return 'http://localhost:8000'; 
  }
  
  // Production URL would go here
  return 'https://api.insight2action.example.com';
};

export const API_BASE_URL = getBaseUrl();

export async function analyzeContent(content: string): Promise<AnalyzeResponse> {
  try {
    const payload: AnalyzeRequest = { content };
    
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Try to parse error message from backend if available
      const errorText = await response.text();
      let errorMessage = `API Error (${response.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.detail) {
          errorMessage = typeof errorJson.detail === 'string' 
            ? errorJson.detail 
            : JSON.stringify(errorJson.detail);
        }
      } catch (e) {
        // Not a JSON error response, use the text
        if (errorText) errorMessage += `: ${errorText}`;
      }
      throw new Error(errorMessage);
    }

    const data: AnalyzeResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to analyze content:', error);
    // Rethrow to let the UI handle the error state
    throw error;
  }
}
