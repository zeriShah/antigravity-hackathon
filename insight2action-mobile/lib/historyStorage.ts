import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyzeResponse, AnalysisHistoryItem } from './types';

const HISTORY_STORAGE_KEY = '@insight2action_history';
const MAX_HISTORY_ITEMS = 20;

/**
 * Saves a new analysis to local device storage.
 * @param originalContent The full text provided by the user.
 * @param result The analysis response from the API.
 */
export async function saveAnalysisToHistory(originalContent: string, result: AnalyzeResponse): Promise<void> {
  try {
    const existingHistory = await getAnalysisHistory();
    
    // Create a new history item
    const newItem: AnalysisHistoryItem = {
      // Safely generate ID using current timestamp and random alphanumeric string
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      contentPreview: originalContent.substring(0, 100) + (originalContent.length > 100 ? '...' : ''),
      originalContent,
      result,
      createdAt: new Date().toISOString()
    };
    
    // Insert at the beginning of the array so newest appears first
    const updatedHistory = [newItem, ...existingHistory];
    
    // Limit saved history to the latest 20 items to save space
    if (updatedHistory.length > MAX_HISTORY_ITEMS) {
      updatedHistory.length = MAX_HISTORY_ITEMS;
    }
    
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save analysis to history:', error);
    throw error;
  }
}

/**
 * Retrieves the saved analysis history.
 * @returns Array of saved analysis items, newest first.
 */
export async function getAnalysisHistory(): Promise<AnalysisHistoryItem[]> {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (!historyJson) return [];
    
    return JSON.parse(historyJson) as AnalysisHistoryItem[];
  } catch (error) {
    console.error('Failed to get analysis history:', error);
    return []; // Return empty array on parse failure to prevent app crash
  }
}

/**
 * Retrieves a specific analysis item by its ID.
 * @param id The ID of the saved analysis item.
 */
export async function getAnalysisById(id: string): Promise<AnalysisHistoryItem | null> {
  try {
    const history = await getAnalysisHistory();
    const item = history.find(h => h.id === id);
    return item || null;
  } catch (error) {
    console.error(`Failed to get analysis by id ${id}:`, error);
    return null;
  }
}

/**
 * Clears all analysis history from storage.
 */
export async function clearAnalysisHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear analysis history:', error);
    throw error;
  }
}

/**
 * Deletes a single analysis item by its ID.
 * @param id The ID of the item to delete.
 */
export async function deleteAnalysisById(id: string): Promise<void> {
  try {
    const history = await getAnalysisHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error(`Failed to delete analysis ${id}:`, error);
    throw error;
  }
}
