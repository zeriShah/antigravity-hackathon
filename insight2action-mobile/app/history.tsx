import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
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

  const getDomainIcon = (domain: string) => {
    const d = domain.toLowerCase();
    if (d.includes('cyber') || d.includes('security')) return '🔒';
    if (d.includes('health') || d.includes('medical')) return '🏥';
    if (d.includes('finance') || d.includes('money')) return '💰';
    if (d.includes('education') || d.includes('academic')) return '🎓';
    if (d.includes('logistics') || d.includes('supply')) return '📦';
    if (d.includes('public')) return '🏛️';
    if (d.includes('business')) return '💼';
    return '📄';
  };

  const renderItem = ({ item }: { item: AnalysisHistoryItem }) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => openResult(item)}>
      <AppCard elevated>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 32, height: 32, borderRadius: 8,
              backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE',
              alignItems: 'center', justifyContent: 'center', marginRight: 10,
            }}>
              <Text style={{ fontSize: 14 }}>{getDomainIcon(item.result.domain)}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }}>{item.result.domain}</Text>
              <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
          <SeverityBadge severity={item.result.severity} />
        </View>
        
        {/* Preview */}
        <Text style={{ fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 14 }} numberOfLines={2}>
          {item.contentPreview}
        </Text>
        
        {/* Key Insight Preview */}
        <View style={{ 
          backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, 
          borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 14,
        }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 }}>Key Insight</Text>
          <Text style={{ fontSize: 12, color: '#475569', lineHeight: 17 }} numberOfLines={2}>{item.result.key_insight}</Text>
        </View>
        
        {/* Footer */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#4F46E5' }}>View Report →</Text>
          </View>
          <TouchableOpacity 
            onPress={(e) => { e.stopPropagation?.(); handleDeleteItem(item.id); }}
            style={{
              paddingHorizontal: 12, paddingVertical: 6,
              backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA',
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 11, color: '#DC2626', fontWeight: '700' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </AppCard>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <AppHeader 
        title="History" 
        showBack 
        subtitle={history.length > 0 ? `${history.length} saved analyses` : undefined}
        rightAction={
          history.length > 0 ? (
            <TouchableOpacity 
              onPress={handleClearHistory}
              style={{
                backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA',
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#DC2626' }}>Clear All</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 }}>
              <View style={{
                width: 80, height: 80, borderRadius: 24,
                backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0',
                alignItems: 'center', justifyContent: 'center', marginBottom: 24,
              }}>
                <Text style={{ fontSize: 36 }}>📭</Text>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 8 }}>No History Yet</Text>
              <Text style={{ 
                fontSize: 14, color: '#94A3B8', textAlign: 'center', 
                marginBottom: 32, paddingHorizontal: 32, lineHeight: 22 
              }}>
                Run your first analysis and results will appear here for future reference.
              </Text>
              <AppButton title="Start Analysis" icon="⚡" onPress={() => router.replace('/input')} />
            </View>
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 }}>
              <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: '500' }}>Loading history...</Text>
            </View>
          )
        }
      />
    </ScreenContainer>
  );
}
