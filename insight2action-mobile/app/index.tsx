import { View, Text, Image, StyleSheet } from 'react-native';
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
      <View style={styles.container}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoWrapper}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          
          <Text style={styles.title}>
            Catalyst
          </Text>
          <Text style={styles.subtitle}>
            Intelligence to Action
          </Text>
          <Text style={styles.description}>
            Transform unstructured data into actionable insights, recommendations, and simulated outcomes seamlessly.
          </Text>
        </View>

        {/* Feature Grid */}
        <View style={styles.featureGrid}>
          {features.map((f, i) => (
            <AppCard key={i} elevated style={styles.card}>
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: f.color + '15', borderColor: f.color + '30' }]}>
                  <Text style={styles.icon}>{f.icon}</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{f.title}</Text>
                  <Text style={styles.cardDesc}>{f.desc}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </AppCard>
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={styles.actionContainer}>
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
            className="mt-3"
          />
        </View>

        {/* Footer Brand */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            POWERED BY AI AGENTS
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 88,
    height: 88,
    borderRadius: 22,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  featureGrid: {
    marginBottom: 40,
  },
  card: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  chevron: {
    color: '#CBD5E1',
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 8,
  },
  actionContainer: {
    gap: 0,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
