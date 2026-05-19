import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { SeverityBadge } from '../components/SeverityBadge';
import { AnalysisHistoryItem } from '../lib/types';
import { getAnalysisHistory, clearAnalysisHistory, deleteAnalysisById } from '../lib/historyStorage';

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getAnalysisHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const handleClearHistory = async () => {
    try {
      await clearAnalysisHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteAnalysisById(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const openResult = (item: AnalysisHistoryItem) => {
    router.push({
      pathname: '/result',
      params: { resultData: JSON.stringify(item.result) }
    });
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoString;
    }
  };

  const renderItem = ({ item }: { item: AnalysisHistoryItem }) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => openResult(item)}>
      <AppCard className="mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <View className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
            <Text className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{item.result.domain}</Text>
          </View>
          <Text className="text-xs font-medium text-slate-400">{formatDate(item.createdAt)}</Text>
        </View>
        
        <Text className="text-sm font-medium text-slate-800 mb-4 leading-relaxed" numberOfLines={2}>
          "{item.contentPreview}"
        </Text>
        
        <View className="flex-row items-center justify-between pt-4 border-t border-slate-100">
          <SeverityBadge severity={item.result.severity} />
          <TouchableOpacity 
            onPress={() => handleDeleteItem(item.id)}
            className="px-3 py-1.5 bg-red-50 rounded-lg border border-red-100"
          >
            <Text className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Delete</Text>
          </TouchableOpacity>
        </View>
      </AppCard>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <AppHeader title="Analysis History" showBack />
      
      {history.length > 0 && (
        <View className="flex-row justify-between items-center mb-4 px-2 mt-2">
          <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider">{history.length} Saved Analyses</Text>
          <TouchableOpacity onPress={handleClearHistory} className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
            <Text className="text-xs font-bold text-red-600 uppercase tracking-wider">Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 items-center justify-center mt-20">
              <View className="w-20 h-20 bg-slate-100 rounded-3xl items-center justify-center mb-6 border border-slate-200">
                <Text className="text-3xl">📭</Text>
              </View>
              <Text className="text-xl font-extrabold text-slate-800 mb-3">No History</Text>
              <Text className="text-slate-500 text-sm mb-8 text-center px-6 leading-relaxed">
                You haven't run any analyses yet. Your saved results will elegantly appear here.
              </Text>
              <AppButton title="Start New Analysis" onPress={() => router.replace('/input')} className="w-full" />
            </View>
          ) : (
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-slate-500 text-sm font-medium">Loading history...</Text>
            </View>
          )
        }
      />
    </ScreenContainer>
  );
}
