import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { analyzeContent, analyzeFile } from '../lib/api';
import { saveAnalysisToHistory } from '../lib/historyStorage';
import { getTempFile, clearTempFile } from '../lib/tempStore';

export default function AnalyzingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const steps = [
    { label: "Reading content...", icon: "📄" },
    { label: "Detecting domain...", icon: "🔍" },
    { label: "Extracting insights...", icon: "💡" },
    { label: "Analyzing impact...", icon: "📊" },
    { label: "Planning recommendations...", icon: "🎯" },
    { label: "Running simulation...", icon: "🚀" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const processData = async () => {
      try {
        const content = await AsyncStorage.getItem('@temp_analysis_content');
        if (!content) throw new Error("No content provided");
        
        // Get file ref from in-memory store (File objects can't be JSON serialized)
        const fileRef = getTempFile();
        await AsyncStorage.removeItem('@temp_analysis_content');
        clearTempFile();
        
        let result;
        if (fileRef) {
          // Binary file — use file upload endpoint
          result = await analyzeFile(fileRef);
        } else {
          // Text content — use standard endpoint
          result = await analyzeContent(content);
        }
        
        await saveAnalysisToHistory(content, result);
        
        setTimeout(() => {
          router.replace({
            pathname: '/result',
            params: { resultData: JSON.stringify(result) }
          });
        }, 800);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error occurred';
        setErrorMsg(message);
      }
    };

    processData();
  }, [router]);

  if (errorMsg) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ 
            width: 72, height: 72, borderRadius: 20, 
            backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA',
            alignItems: 'center', justifyContent: 'center', marginBottom: 24,
          }}>
            <Text style={{ fontSize: 32 }}>⚠️</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 8, textAlign: 'center' }}>
            Analysis Failed
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 32, lineHeight: 22, paddingHorizontal: 16 }}>
            {errorMsg}
          </Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ 
              backgroundColor: '#4F46E5', paddingHorizontal: 32, paddingVertical: 16, 
              borderRadius: 14, width: '100%', alignItems: 'center',
              shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2, shadowRadius: 10,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>Go Back & Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 }}>
        {/* Spinner */}
        <View style={{ 
          width: 80, height: 80, borderRadius: 24, 
          backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE',
          alignItems: 'center', justifyContent: 'center', marginBottom: 32,
        }}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
        
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 6, textAlign: 'center' }}>
          AI Agents at Work
        </Text>
        <Text style={{ fontSize: 14, color: '#94A3B8', marginBottom: 36, textAlign: 'center' }}>
          Processing through our multi-agent pipeline
        </Text>

        {/* Steps */}
        <View style={{ 
          width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20, 
          padding: 24, borderWidth: 1, borderColor: '#F1F5F9',
          shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05, shadowRadius: 20, elevation: 3,
        }}>
          {steps.map((step, index) => (
            <View key={index} style={{ 
              flexDirection: 'row', alignItems: 'center', 
              marginBottom: index < steps.length - 1 ? 20 : 0,
              opacity: index <= currentStep ? 1 : 0.35,
            }}>
              {/* Status indicator */}
              <View style={{ marginRight: 14 }}>
                {index < currentStep ? (
                  <View style={{ 
                    width: 32, height: 32, borderRadius: 10, 
                    backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 14 }}>✅</Text>
                  </View>
                ) : index === currentStep ? (
                  <View style={{ 
                    width: 32, height: 32, borderRadius: 10, 
                    backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ActivityIndicator size="small" color="#4F46E5" />
                  </View>
                ) : (
                  <View style={{ 
                    width: 32, height: 32, borderRadius: 10, 
                    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 14 }}>{step.icon}</Text>
                  </View>
                )}
              </View>

              <Text style={{ 
                fontSize: 14, fontWeight: index <= currentStep ? '600' : '500',
                color: index <= currentStep ? '#0F172A' : '#CBD5E1', flex: 1,
              }}>
                {step.label}
              </Text>

              {index < currentStep && (
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#16A34A', textTransform: 'uppercase' }}>Done</Text>
              )}
              {index === currentStep && (
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase' }}>Active</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
