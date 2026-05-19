import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export function AppHeader({ title, subtitle, showBack = false }: AppHeaderProps) {
  const router = useRouter();

  return (
    <View className="py-4 flex-row items-center justify-between mb-4 mt-2">
      <View className="flex-1 flex-row items-center">
        {showBack && (
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3"
          >
            <Text className="text-slate-600 font-medium text-lg">←</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text className="text-2xl font-bold text-slate-900">{title}</Text>
          {subtitle && <Text className="text-sm text-slate-500 font-medium">{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
}
