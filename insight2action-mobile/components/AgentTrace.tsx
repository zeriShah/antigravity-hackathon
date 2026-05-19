import { View, Text } from 'react-native';
import { AnalyzeResponse } from '../lib/types';
import { AppCard } from './AppCard';

interface AgentTraceProps {
  result: AnalyzeResponse;
}

export function AgentTrace({ result }: AgentTraceProps) {
  const steps = [
    {
      title: 'Content Understood',
      description: 'Successfully parsed and classified unstructured content.',
    },
    {
      title: 'Domain Detected',
      description: `Mapped to ${result.domain} domain.`,
    },
    {
      title: 'Insight Extracted',
      description: result.key_insight,
    },
    {
      title: 'Impact Analyzed',
      description: result.impact,
    },
    {
      title: 'Action Recommended',
      description: result.recommended_action,
    },
    {
      title: 'Action Simulated',
      description: `[${result.simulation.type}] ${result.simulation.title}`,
    },
  ];

  return (
    <View className="mt-2 mb-6">
      <Text className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 px-2">Agent Workflow Trace</Text>
      <AppCard noPadding className="p-0 overflow-hidden bg-slate-50/50">
        <View className="px-5 py-6">
          {steps.map((step, index) => (
            <View key={index} className="flex-row">
              <View className="items-center mr-5">
                <View className="w-6 h-6 rounded-full bg-indigo-100 items-center justify-center z-10 border border-indigo-200">
                  <View className="w-2 h-2 rounded-full bg-indigo-600" />
                </View>
                {index !== steps.length - 1 && (
                  <View className="w-0.5 flex-1 bg-indigo-100 my-1" />
                )}
              </View>
              
              <View className={`flex-1 pt-0 ${index !== steps.length - 1 ? 'pb-6' : 'pb-0'}`}>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-sm font-bold text-slate-800">{step.title}</Text>
                  <Text className="text-[9px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-100 tracking-wider">Done</Text>
                </View>
                <Text className="text-sm text-slate-500 leading-relaxed" numberOfLines={2}>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </AppCard>
    </View>
  );
}
