import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { AppButton } from '../components/AppButton';

export default function InputScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleInputs = [
    { label: 'Cybersecurity', text: 'The firewall is logging suspicious packets from unknown IP addresses trying to guess admin passwords.' },
    { label: 'Logistics', text: 'Our primary warehouse is experiencing severe shipping delays for incoming orders.' },
    { label: 'Education', text: 'Student attendance has dropped significantly before the upcoming final exam.' },
  ];

  const handleAnalyze = async () => {
    if (text.trim().length === 0) {
      setErrorMsg('Please enter some content to analyze.');
      return;
    }
    
    Keyboard.dismiss();
    try {
      // Store the potentially large text file in local storage instead of URL params
      // Browser URLs have character limits and will crash on 100KB files.
      await AsyncStorage.setItem('@temp_analysis_content', text);
      router.push('/analyzing');
    } catch (e) {
      setErrorMsg('Failed to process the input text.');
    }
  };

  const handleFileUpload = async () => {
    try {
      // 1. Open system file picker for .txt files
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain'], // Only allow .txt files
        copyToCacheDirectory: true,
      });

      // User cancelled picker
      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      
      // 2. Validate file size (100 KB limit = 100 * 1024 bytes)
      if (file.size && file.size > 102400) {
        setErrorMsg('This file is too large for the MVP. Please upload a smaller TXT file under 100 KB.');
        return;
      }

      // 3. Read the file content carefully based on the platform
      let fileContent = '';
      
      if (Platform.OS === 'web') {
        // On web, DocumentPicker provides the native Web File object
        if (file.file) {
          fileContent = await (file.file as any).text();
        } else if (file.uri) {
          // Fallback if we only have the blob URI
          const response = await fetch(file.uri);
          fileContent = await response.text();
        } else {
          setErrorMsg('Failed to access the selected file on web.');
          return;
        }
      } else {
        // On iOS/Android, use expo-file-system
        if (!file.uri) {
          setErrorMsg('Failed to access the selected file.');
          return;
        }
        fileContent = await FileSystem.readAsStringAsync(file.uri, {
          encoding: 'utf8',
        });
      }

      // 4. Validate content is not empty
      if (!fileContent.trim()) {
        setErrorMsg('The selected file is empty.');
        return;
      }

      // 5. Success: update text and filename state
      setText(fileContent);
      setFileName(file.name);
      setErrorMsg('');

    } catch (error) {
      console.error('File upload error:', error);
      setErrorMsg('Failed to read the file. Ensure it is a valid .txt file.');
    }
  };

  const clearFile = () => {
    setFileName(null);
    setText('');
    setErrorMsg('');
  };

  return (
    <ScreenContainer keyboardAvoid>
      <AppHeader title="New Analysis" showBack subtitle="Paste content or upload a .txt file" />
      
      <View className="flex-1 mt-2">
        <View className="flex-row flex-wrap mb-4">
          {sampleInputs.map((sample, idx) => (
            <TouchableOpacity 
              key={idx}
              onPress={() => {
                setText(sample.text);
                setFileName(null);
                setErrorMsg('');
              }}
              className="bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1.5 mr-2 mb-2"
            >
              <Text className="text-xs font-semibold text-indigo-700">{sample.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upload File Section */}
        <View className="flex-row items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm shadow-slate-200/50">
          <View className="flex-1 mr-4">
            <Text className="text-sm font-bold text-slate-800 mb-1">
              Upload TXT File
            </Text>
            {fileName ? (
              <Text className="text-xs text-emerald-600 font-medium" numberOfLines={1}>
                Loaded: {fileName}
              </Text>
            ) : (
              <Text className="text-xs text-slate-500">
                Upload a .txt report, log, complaint, or policy note.
              </Text>
            )}
          </View>
          
          <View className="flex-row items-center">
            {fileName && (
              <TouchableOpacity onPress={clearFile} className="mr-3">
                <Text className="text-xs font-bold text-red-500 uppercase tracking-wider">Remove</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={handleFileUpload}
              className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200"
            >
              <Text className="text-sm font-bold text-slate-700">{fileName ? 'Replace' : 'Upload'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Manual Text Input Area */}
        <View className="flex-1 mb-4 relative">
          <TextInput
            className={`flex-1 bg-white border ${errorMsg ? 'border-red-300' : 'border-slate-200'} rounded-3xl p-5 text-base text-slate-800 text-top shadow-sm shadow-slate-200/50`}
            style={{ textAlignVertical: 'top' }}
            multiline
            placeholder="Paste text directly or use the upload button above..."
            placeholderTextColor="#94a3b8"
            value={text}
            onChangeText={(val) => {
              setText(val);
              // If user manually edits, we clear the filename to indicate it's no longer purely the original file
              if (fileName) setFileName(null);
              if (errorMsg) setErrorMsg('');
            }}
          />
          <View className="absolute bottom-4 right-5 bg-white/80 px-2 rounded">
            <Text className="text-xs font-medium text-slate-400">{text.length} chars</Text>
          </View>
        </View>
        
        {errorMsg ? (
          <Text className="text-red-500 text-sm mb-4 font-medium px-2">{errorMsg}</Text>
        ) : null}

        <AppButton 
          title="Analyze Content" 
          onPress={handleAnalyze} 
          disabled={text.trim().length === 0}
        />
      </View>
    </ScreenContainer>
  );
}
