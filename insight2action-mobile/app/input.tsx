import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { setTempFile } from '../lib/tempStore';

// All supported file types
const SUPPORTED_TYPES = [
  'text/plain', 'text/csv', 'text/markdown', 'text/html', 'text/xml',
  'application/json', 'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/xml', 'text/tab-separated-values',
  'application/x-yaml', 'text/yaml',
  '*/*', // Fallback
];

const FILE_CATEGORIES = [
  { label: 'Documents', exts: '.txt, .pdf, .docx, .doc, .md', icon: '📄' },
  { label: 'Spreadsheets', exts: '.csv, .xlsx, .xls, .tsv', icon: '📊' },
  { label: 'Data', exts: '.json, .xml, .yaml, .yml', icon: '🗂️' },
  { label: 'Code & Logs', exts: '.log, .py, .js, .sql', icon: '💻' },
];

export default function InputScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileRef, setFileRef] = useState<any>(null);
  const [uploadMode, setUploadMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleInputs = [
    { label: '🔒 Cybersecurity', text: 'The firewall is logging suspicious packets from unknown IP addresses trying to guess admin passwords. Multiple brute-force attempts detected in the last 24 hours targeting the admin portal. Response time from security team has been delayed.' },
    { label: '📦 Logistics', text: 'Our primary warehouse is experiencing severe shipping delays. Order fulfillment rate dropped from 98% to 72% this week. Three delivery trucks are out of service and the backup fleet is at capacity. Customer complaints have increased by 45%.' },
    { label: '🏥 Healthcare', text: 'Patient wait times in the ER have increased by 40% over the past month. Staff shortages are contributing to longer treatment cycles. Two departments reported equipment maintenance backlogs affecting routine procedures.' },
  ];

  const handleAnalyze = async () => {
    if (text.trim().length === 0) {
      setErrorMsg('Please enter some content to analyze.');
      return;
    }
    Keyboard.dismiss();
    try {
      await AsyncStorage.setItem('@temp_analysis_content', text);
      // Store file ref in memory (File objects can't be serialized to JSON)
      setTempFile(fileRef);
      router.push('/analyzing');
    } catch (e) {
      setErrorMsg('Failed to process the input text.');
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: SUPPORTED_TYPES,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      
      // 70MB limit
      if (file.size && file.size > 70 * 1024 * 1024) {
        setErrorMsg('File too large. Maximum size is 70MB.');
        return;
      }

      // Determine if it's a text-readable file or binary
      const ext = (file.name || '').split('.').pop()?.toLowerCase() || '';
      const textExts = ['txt', 'csv', 'json', 'md', 'log', 'xml', 'html', 'htm', 'tsv', 'yaml', 'yml', 'ini', 'cfg', 'conf', 'py', 'js', 'ts', 'sql', 'r'];
      const binaryExts = ['xlsx', 'xls', 'docx', 'doc', 'pdf', 'pptx', 'ppt'];
      
      if (binaryExts.includes(ext)) {
        // For binary files, we'll send directly to the file upload endpoint
        setFileName(file.name);
        setFileRef({ uri: file.uri, name: file.name, type: file.mimeType || 'application/octet-stream', file: (file as any).file || null });
        setText(`[File uploaded: ${file.name}]\n\nThis file will be processed by our AI backend for text extraction and analysis.`);
        setUploadMode(true);
        setErrorMsg('');
        return;
      }

      // Text-based files: read content
      let fileContent = '';
      if (Platform.OS === 'web') {
        if ((file as any).file) {
          fileContent = await ((file as any).file as File).text();
        } else if (file.uri) {
          const response = await fetch(file.uri);
          fileContent = await response.text();
        } else {
          setErrorMsg('Failed to access the selected file on web.');
          return;
        }
      } else {
        if (!file.uri) {
          setErrorMsg('Failed to access the selected file.');
          return;
        }
        fileContent = await FileSystem.readAsStringAsync(file.uri, { encoding: 'utf8' });
      }

      if (!fileContent.trim()) {
        setErrorMsg('The selected file is empty.');
        return;
      }

      setText(fileContent);
      setFileName(file.name);
      setFileRef(null);
      setUploadMode(false);
      setErrorMsg('');
    } catch (error) {
      console.error('File upload error:', error);
      setErrorMsg('Failed to read the file. Please try another file.');
    }
  };

  const clearFile = () => {
    setFileName(null);
    setFileRef(null);
    setText('');
    setUploadMode(false);
    setErrorMsg('');
  };

  return (
    <ScreenContainer keyboardAvoid scroll>
      <AppHeader title="New Analysis" showBack subtitle="Paste content or upload any file" />
      
      <View style={{ flex: 1, marginTop: 4 }}>
        {/* Sample Quick Inputs */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
          {sampleInputs.map((sample, idx) => (
            <TouchableOpacity 
              key={idx}
              onPress={() => {
                setText(sample.text);
                setFileName(null);
                setFileRef(null);
                setUploadMode(false);
                setErrorMsg('');
              }}
              style={{ 
                backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE',
                borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#4F46E5' }}>{sample.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* File Upload Card */}
        <AppCard elevated>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>📎</Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A' }}>Upload File</Text>
              </View>
              {fileName ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#16A34A', marginRight: 8 }} />
                  <Text style={{ fontSize: 12, color: '#16A34A', fontWeight: '600' }} numberOfLines={1}>
                    {fileName}
                  </Text>
                </View>
              ) : (
                <Text style={{ fontSize: 12, color: '#94A3B8' }}>
                  Supports all major formats
                </Text>
              )}
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {fileName && (
                <TouchableOpacity onPress={clearFile} style={{ marginRight: 12 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#DC2626' }}>Remove</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                onPress={handleFileUpload}
                style={{ 
                  backgroundColor: '#4F46E5', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10,
                  shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2, shadowRadius: 6, elevation: 2,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>
                  {fileName ? 'Replace' : 'Browse'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Supported formats */}
          {!fileName && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
              {FILE_CATEGORIES.map((cat, i) => (
                <View key={i} style={{ 
                  flexDirection: 'row', alignItems: 'center', 
                  marginRight: 16, marginBottom: 6,
                }}>
                  <Text style={{ fontSize: 12, marginRight: 4 }}>{cat.icon}</Text>
                  <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '500' }}>{cat.exts}</Text>
                </View>
              ))}
            </View>
          )}
        </AppCard>

        {/* Text Input Area */}
        <View style={{ flex: 1, marginTop: 4, marginBottom: 12, minHeight: 200 }}>
          <TextInput
            style={{
              flex: 1, backgroundColor: '#FFFFFF', 
              borderWidth: 1, borderColor: errorMsg ? '#FECACA' : '#E2E8F0',
              borderRadius: 16, padding: 20, fontSize: 15, color: '#0F172A',
              textAlignVertical: 'top', lineHeight: 22, minHeight: 200,
              shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.03, shadowRadius: 6,
            }}
            multiline
            placeholder="Paste your text, report, or data here..."
            placeholderTextColor="#CBD5E1"
            value={text}
            onChangeText={(val) => {
              setText(val);
              if (fileName) { setFileName(null); setFileRef(null); setUploadMode(false); }
              if (errorMsg) setErrorMsg('');
            }}
            editable={!uploadMode}
          />
          <View style={{ position: 'absolute', bottom: 12, right: 16, backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#CBD5E1' }}>{text.length} chars</Text>
          </View>
        </View>
        
        {errorMsg ? (
          <View style={{ 
            backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', 
            borderRadius: 10, padding: 12, marginBottom: 12,
          }}>
            <Text style={{ color: '#DC2626', fontSize: 13, fontWeight: '600' }}>⚠️  {errorMsg}</Text>
          </View>
        ) : null}

        <AppButton 
          title={uploadMode ? "Analyze File" : "Analyze Content"}
          icon="🔍"
          size="lg"
          onPress={handleAnalyze} 
          disabled={text.trim().length === 0}
        />
      </View>
    </ScreenContainer>
  );
}
