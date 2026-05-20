import { View, Text } from 'react-native';
import { AnalyzeResponse } from '../lib/types';
import { AppCard } from './AppCard';

interface AgentTraceProps {
  result: AnalyzeResponse;
}

export function AgentTrace({ result }: AgentTraceProps) {
  const steps = [
    { title: 'Content Parsed', description: 'Parsed and classified unstructured content.', icon: '📄', color: '#4F46E5' },
    { title: 'Domain Detected', description: `Mapped to ${result.domain} domain.`, icon: '🔍', color: '#0284C7' },
    { title: 'Insight Extracted', description: result.key_insight, icon: '💡', color: '#CA8A04' },
    { title: 'Impact Analyzed', description: result.impact, icon: '📊', color: '#EA580C' },
    { title: 'Action Recommended', description: result.recommended_action, icon: '🎯', color: '#16A34A' },
    { title: 'Simulation Complete', description: `[${result.simulation.type}] ${result.simulation.title}`, icon: '🚀', color: '#7C3AED' },
  ];

  return (
    <View style={{ marginTop: 8, marginBottom: 16 }}>
      <Text style={{ 
        fontSize: 13, fontWeight: '700', color: '#0F172A', 
        letterSpacing: 0.5, marginBottom: 14, paddingHorizontal: 4 
      }}>
        Agent Workflow Trace
      </Text>
      <AppCard noPadding elevated>
        <View style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
          {steps.map((step, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
              <View style={{ alignItems: 'center', marginRight: 16 }}>
                <View style={{ 
                  width: 36, height: 36, borderRadius: 10, 
                  backgroundColor: '#F8FAFC',
                  borderWidth: 1, borderColor: '#E2E8F0',
                  alignItems: 'center', justifyContent: 'center', zIndex: 10,
                }}>
                  <Text style={{ fontSize: 16 }}>{step.icon}</Text>
                </View>
                {index !== steps.length - 1 && (
                  <View style={{ width: 2, flex: 1, backgroundColor: '#F1F5F9', marginVertical: 4, borderRadius: 1 }} />
                )}
              </View>
              
              <View style={{ flex: 1, paddingBottom: index !== steps.length - 1 ? 20 : 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }}>{step.title}</Text>
                  <View style={{ 
                    backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0',
                    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
                  }}>
                    <Text style={{ fontSize: 9, fontWeight: '700', color: '#16A34A', textTransform: 'uppercase', letterSpacing: 0.5 }}>Done</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: '#64748B', lineHeight: 19 }} numberOfLines={2}>
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
