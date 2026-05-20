import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';

export default function HomeScreen() {
  const router = useRouter();

  const features = [
    { title: 'Smart Analysis', desc: 'AI-powered insights from any document or text.', icon: '🧠', color: '#4F46E5' },
    { title: 'Impact Assessment', desc: 'Severity scoring and business risk evaluation.', icon: '📊', color: '#EA580C' },
    { title: 'Action Planning', desc: 'Step-by-step improvement recommendations.', icon: '🎯', color: '#16A34A' },
    { title: 'Live Simulation', desc: 'Mock ticket, alert, or dashboard generation.', icon: '🚀', color: '#7C3AED' },
  ];

  return (
    <ScreenContainer scroll>
      <View style={{ flex: 1, justifyContent: 'center', paddingTop: 48, paddingBottom: 24 }}>
        
        {/* Hero Section */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ 
            width: 72, height: 72, borderRadius: 20, 
            backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE',
            alignItems: 'center', justifyContent: 'center', marginBottom: 24,
            shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12, shadowRadius: 16, elevation: 4,
          }}>
            <Text style={{ fontSize: 32 }}>✨</Text>
          </View>
          
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 4, letterSpacing: -0.8 }}>
            Insight2Action
          </Text>
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#4F46E5', textAlign: 'center', marginBottom: 12, letterSpacing: -0.8 }}>
            AI Platform
          </Text>
          <Text style={{ fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 23, paddingHorizontal: 16, fontWeight: '500' }}>
            Transform unstructured data into actionable insights, recommendations, and simulated outcomes.
          </Text>
        </View>

        {/* Feature Grid */}
        <View style={{ marginBottom: 32 }}>
          {features.map((f, i) => (
            <AppCard key={i} elevated>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ 
                  width: 48, height: 48, borderRadius: 14, 
                  backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9',
                  alignItems: 'center', justifyContent: 'center', marginRight: 16,
                }}>
                  <Text style={{ fontSize: 22 }}>{f.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 3 }}>{f.title}</Text>
                  <Text style={{ fontSize: 13, color: '#64748B', lineHeight: 18 }}>{f.desc}</Text>
                </View>
                <Text style={{ color: '#CBD5E1', fontSize: 18 }}>›</Text>
              </View>
            </AppCard>
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={{ gap: 10 }}>
          <AppButton 
            title="Start Analysis" 
            icon="⚡"
            size="lg"
            onPress={() => router.push('/input')} 
          />
          <AppButton 
            title="View History" 
            icon="📋"
            variant="secondary"
            onPress={() => router.push('/history')} 
          />
        </View>

        {/* Footer Brand */}
        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <Text style={{ fontSize: 11, color: '#CBD5E1', fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Powered by AI Agents
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
