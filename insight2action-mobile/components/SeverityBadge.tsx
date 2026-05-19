import { View, Text } from 'react-native';

interface SeverityBadgeProps {
  severity: string;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const s = severity.toLowerCase();
  let bg = 'bg-slate-100 border-slate-200';
  let text = 'text-slate-600';
  let icon = '•';

  if (s === 'critical') {
    bg = 'bg-red-50 border-red-200';
    text = 'text-red-700';
    icon = '🚨';
  } else if (s === 'high') {
    bg = 'bg-orange-50 border-orange-200';
    text = 'text-orange-700';
    icon = '⚠️';
  } else if (s === 'medium') {
    bg = 'bg-yellow-50 border-yellow-200';
    text = 'text-yellow-700';
    icon = '⚡';
  } else if (s === 'low') {
    bg = 'bg-emerald-50 border-emerald-200';
    text = 'text-emerald-700';
    icon = '✅';
  }

  return (
    <View className={`flex-row items-center px-3 py-1.5 rounded-full border ${bg}`}>
      <Text className={`text-[10px] mr-1.5 leading-none`}>{icon}</Text>
      <Text className={`text-xs font-bold uppercase tracking-wider ${text}`}>{severity}</Text>
    </View>
  );
}
