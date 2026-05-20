import { View } from 'react-native';

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  accent?: boolean;
  elevated?: boolean;
}

export function AppCard({ children, className = '', noPadding = false, accent = false, elevated = false }: AppCardProps) {
  return (
    <View 
      className={className}
      style={[
        { 
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: accent ? '#C7D2FE' : '#F1F5F9',
          marginBottom: 12,
        },
        !noPadding && { padding: 20 },
        elevated && {
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 3,
        },
      ]}
    >
      {children}
    </View>
  );
}
