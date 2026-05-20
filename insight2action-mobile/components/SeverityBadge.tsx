import { View, Text } from 'react-native';

interface SeverityBadgeProps {
  severity: string;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const s = severity.toLowerCase();
  
  let bg = '#F1F5F9';
  let border = '#E2E8F0';
  let textColor = '#64748B';
  let dotColor = '#94A3B8';

  if (s === 'critical') {
    bg = '#FEF2F2'; border = '#FECACA'; textColor = '#DC2626'; dotColor = '#DC2626';
  } else if (s === 'high') {
    bg = '#FFF7ED'; border = '#FED7AA'; textColor = '#EA580C'; dotColor = '#EA580C';
  } else if (s === 'medium') {
    bg = '#FEFCE8'; border = '#FEF08A'; textColor = '#CA8A04'; dotColor = '#CA8A04';
  } else if (s === 'low') {
    bg = '#F0FDF4'; border = '#BBF7D0'; textColor = '#16A34A'; dotColor = '#16A34A';
  }

  return (
    <View style={{ 
      flexDirection: 'row', alignItems: 'center', 
      paddingHorizontal: 12, paddingVertical: 6, 
      borderRadius: 20, backgroundColor: bg,
      borderWidth: 1, borderColor: border,
    }}>
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: dotColor, marginRight: 8 }} />
      <Text style={{ fontSize: 11, fontWeight: '700', color: textColor, textTransform: 'uppercase', letterSpacing: 0.8 }}>
        {severity}
      </Text>
    </View>
  );
}
