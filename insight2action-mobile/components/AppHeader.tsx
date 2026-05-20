import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function AppHeader({ title, subtitle, showBack = false, rightAction }: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={{ 
      paddingTop: 16, paddingBottom: 12, 
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 8, marginTop: 4,
    }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ 
              width: 40, height: 40, borderRadius: 12,
              backgroundColor: '#FFFFFF', 
              borderWidth: 1, borderColor: '#E2E8F0',
              alignItems: 'center', justifyContent: 'center', marginRight: 14,
              shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
            }}
          >
            <Text style={{ color: '#475569', fontSize: 18, fontWeight: '500' }}>←</Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#0F172A', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>{title}</Text>
          {subtitle && <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 3, fontWeight: '500' }}>{subtitle}</Text>}
        </View>
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  );
}
