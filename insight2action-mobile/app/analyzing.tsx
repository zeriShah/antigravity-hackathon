import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { analyzeContent } from '../lib/api';
import { saveAnalysisToHistory } from '../lib/historyStorage';

export default function AnalyzingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const steps = [
    "Reading unstructured content...",
    "Detecting industry domain...",
    "Extracting key insights...",
    "Analyzing severity and impact...",
    "Planning recommended action...",
    "Simulating action outcome..."
  ];

  useEffect(() => {
    // Animate the steps purely for premium UX
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const processData = async () => {
      try {
        // Read the content from local storage instead of URL params to avoid length limits
        const content = await AsyncStorage.getItem('@temp_analysis_content');
        if (!content) throw new Error("No content provided");
        
        // Clean up temporary storage
        await AsyncStorage.removeItem('@temp_analysis_content');
        
        // Let the UX animation run for at least a few seconds 
        // to show the agentic process to the user
        const result = await analyzeContent(content);
        await saveAnalysisToHistory(content, result);
        
        // Wait briefly if it finishes too fast so it doesn't flicker
        setTimeout(() => {
          router.replace({
            pathname: '/result',
            params: { resultData: JSON.stringify(result) }
          });
        }, 1000);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        setErrorMsg(message);
      }
    };

    processData();
  }, [params.content, router]);

  if (errorMsg) {
    return (
      <ScreenContainer className="justify-center items-center px-4">
        <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-6 border border-red-100">
          <Text className="text-2xl">⚠️</Text>
        </View>
        <Text className="text-2xl font-extrabold text-slate-800 mb-3 text-center">Analysis Failed</Text>
        <Text className="text-slate-500 text-center mb-10 leading-relaxed">{errorMsg}</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-slate-900 px-8 py-4 rounded-2xl w-full items-center"
        >
          <Text className="text-white font-bold text-base">Go Back</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="justify-center">
      <View className="items-center w-full px-2">
        <ActivityIndicator size="large" color="#4f46e5" className="mb-8" />
        <Text className="text-2xl font-extrabold text-slate-800 mb-10 text-center">
          Agentic AI is working
        </Text>

        <View className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          {steps.map((step, index) => (
            <View key={index} className="flex-row items-center mb-5 last:mb-0">
              {index < currentStep ? (
                <View className="w-6 h-6 rounded-full bg-indigo-100 items-center justify-center mr-4 border border-indigo-200">
                  <Text className="text-[10px]">✅</Text>
                </View>
              ) : index === currentStep ? (
                <View className="w-6 h-6 rounded-full bg-indigo-600 items-center justify-center mr-4 shadow-sm shadow-indigo-300">
                  <ActivityIndicator size="small" color="#ffffff" />
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full bg-slate-100 mr-4 border border-slate-200" />
              )}
              <Text className={`text-sm font-medium flex-1 ${index <= currentStep ? 'text-slate-800' : 'text-slate-400'}`}>
                {step}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

