import { View, Text } from 'react-native';

interface ConfidenceBarProps {
  confidence: number;
}

export function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  const percentage = Math.max(0, Math.min(100, Math.round(confidence * 100)));
  
  let barColor = '#16A34A';
  let barBg = '#F0FDF4';
  let label = 'Excellent';
  if (percentage < 50) { barColor = '#DC2626'; barBg = '#FEF2F2'; label = 'Low'; }
  else if (percentage < 70) { barColor = '#CA8A04'; barBg = '#FEFCE8'; label = 'Fair'; }
  else if (percentage < 85) { barColor = '#4F46E5'; barBg = '#EEF2FF'; label = 'Good'; }

  return (
    <View style={{ width: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          AI Confidence
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A', marginRight: 6 }}>{percentage}%</Text>
          <View style={{ 
            backgroundColor: barBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 
          }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: barColor, textTransform: 'uppercase' }}>{label}</Text>
          </View>
        </View>
      </View>
      <View style={{ height: 8, width: '100%', backgroundColor: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
        <View style={{ height: '100%', borderRadius: 10, backgroundColor: barColor, width: `${percentage}%` }} />
      </View>
    </View>
  );
}
