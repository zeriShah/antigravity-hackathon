import { View, ViewStyle, StyleProp } from 'react-native';

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  accent?: boolean;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppCard({ children, className = '', noPadding = false, accent = false, elevated = false, style }: AppCardProps) {
  return (
    <View 
      className={className}
      style={[
        { 
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: accent ? '#C7D2FE' : '#E2E8F0',
          marginBottom: 12,
        },
        !noPadding && { padding: 20 },
        elevated && {
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 3,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}
