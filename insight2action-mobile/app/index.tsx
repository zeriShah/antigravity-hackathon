import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';

export default function HomeScreen() {
  const router = useRouter();

  const features = [
    { title: 'Extract Insight', desc: 'Identify core issues from messy text.', icon: '🧠' },
    { title: 'Analyze Impact', desc: 'Determine severity and business risk.', icon: '⚡' },
    { title: 'Simulate Action', desc: 'Generate a mock operational response.', icon: '🚀' },
  ];

  return (
    <ScreenContainer scroll>
      <View className="flex-1 justify-center py-10">
        <View className="items-center mb-10 mt-6">
          <View className="w-20 h-20 bg-indigo-100 rounded-3xl items-center justify-center mb-6 shadow-sm border border-indigo-200">
            <Text className="text-4xl">✨</Text>
          </View>
          <Text className="text-3xl font-extrabold text-slate-900 text-center mb-3">
            Insight2Action <Text className="text-indigo-600">AI</Text>
          </Text>
          <Text className="text-base text-slate-500 text-center leading-relaxed px-4">
            Turn unstructured content into clear decisions and simulated actions instantly.
          </Text>
        </View>

        <View className="mb-10">
          {features.map((f, i) => (
            <AppCard key={i} className="flex-row items-center p-4 mb-3 border-slate-100 bg-white shadow-sm">
              <View className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center mr-4 border border-slate-100">
                <Text className="text-xl">{f.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-slate-800 mb-1">{f.title}</Text>
                <Text className="text-sm text-slate-500">{f.desc}</Text>
              </View>
            </AppCard>
          ))}
        </View>

        <View className="mt-auto">
          <AppButton 
            title="Start Analysis" 
            onPress={() => router.push('/input')} 
            className="mb-3"
          />
          <AppButton 
            title="View History" 
            variant="secondary"
            onPress={() => router.push('/history')} 
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
