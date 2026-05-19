import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { SeverityBadge } from '../components/SeverityBadge';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { AgentTrace } from '../components/AgentTrace';
import { AnalyzeResponse } from '../lib/types';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  let result: AnalyzeResponse | null = null;
  try {
    if (params.resultData && typeof params.resultData === 'string') {
      result = JSON.parse(params.resultData);
    }
  } catch (e) {
    console.error("Failed to parse result data", e);
  }

  if (!result) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-lg text-slate-500 mb-6 font-medium">No result data found.</Text>
        <AppButton title="Go Back" onPress={() => router.back()} className="w-full" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <AppHeader title="Analysis Result" showBack />
      
      <View className="flex-1 mt-2">
        {/* Top Summary Card */}
        <AppCard className="mb-6 border-indigo-100 bg-indigo-50/30">
          <View className="flex-row justify-between items-center mb-5">
            <View>
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Domain</Text>
              <Text className="text-base font-extrabold text-slate-800">{result.domain}</Text>
            </View>
            <SeverityBadge severity={result.severity} />
          </View>
          <ConfidenceBar confidence={result.confidence} />
        </AppCard>

        {/* Insight & Impact */}
        <Text className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 px-2">Core Findings</Text>
        <AppCard>
          <Text className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Key Insight</Text>
          <Text className="text-base text-slate-800 leading-relaxed font-medium mb-5">{result.key_insight}</Text>
          
          <View className="h-px w-full bg-slate-100 mb-5" />
          
          <Text className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Impact</Text>
          <Text className="text-base text-slate-600 leading-relaxed">{result.impact}</Text>
        </AppCard>

        {/* Recommended Action */}
        <Text className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 mt-4 px-2">Next Steps</Text>
        <AppCard className="bg-indigo-600 border-indigo-700">
          <Text className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">Recommended Action</Text>
          <Text className="text-lg text-white leading-relaxed font-semibold">{result.recommended_action}</Text>
        </AppCard>

        {/* Simulation */}
        <AppCard>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">Simulated Execution</Text>
            <View className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
              <Text className="text-[10px] font-bold text-slate-600 uppercase">{result.simulation.type}</Text>
            </View>
          </View>
          <Text className="text-base font-bold text-slate-800 mb-2">{result.simulation.title}</Text>
          <Text className="text-sm text-slate-500 leading-relaxed mb-4">{result.simulation.description}</Text>
          
          <View className="flex-row items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
            <View className="flex-1 border-r border-slate-200">
              <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</Text>
              <Text className="text-xs font-bold text-slate-700">{result.simulation.status}</Text>
            </View>
            <View className="flex-1 pl-3 border-r border-slate-200">
              <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1">Priority</Text>
              <Text className="text-xs font-bold text-slate-700">{result.simulation.priority}</Text>
            </View>
            <View className="flex-1 pl-3">
              <Text className="text-[10px] font-bold text-slate-400 uppercase mb-1">Team</Text>
              <Text className="text-xs font-bold text-slate-700" numberOfLines={1}>{result.simulation.assigned_team}</Text>
            </View>
          </View>
        </AppCard>

        {/* Agent Trace */}
        <AgentTrace result={result} />

        <View className="mt-4 mb-8">
          <AppButton 
            title="Start New Analysis" 
            onPress={() => router.replace('/input')} 
            className="mb-3"
          />
          <AppButton 
            title="View History" 
            variant="secondary"
            onPress={() => router.push('/history')} 
            className="mb-3"
          />
          <AppButton 
            title="Back to Home" 
            variant="outline"
            onPress={() => router.replace('/')} 
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
