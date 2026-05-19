import { View, Text } from 'react-native';

interface ConfidenceBarProps {
  confidence: number;
}

export function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  const percentage = Math.max(0, Math.min(100, Math.round(confidence * 100)));
  
  let colorClass = 'bg-emerald-500';
  if (percentage < 50) colorClass = 'bg-red-500';
  else if (percentage < 75) colorClass = 'bg-yellow-500';
  else if (percentage < 85) colorClass = 'bg-indigo-500';

  return (
    <View className="w-full">
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-xs font-medium text-slate-500 uppercase tracking-wider">AI Confidence</Text>
        <Text className="text-sm font-bold text-slate-700">{percentage}%</Text>
      </View>
      <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <View 
          className={`h-full rounded-full ${colorClass}`} 
          style={{ width: `${percentage}%` }} 
        />
      </View>
    </View>
  );
}
