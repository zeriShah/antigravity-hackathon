import { View, ScrollView, Platform, KeyboardAvoidingView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  className?: string;
  keyboardAvoid?: boolean;
  noPadding?: boolean;
}

export function ScreenContainer({ children, scroll = false, className = '', keyboardAvoid = false, noPadding = false }: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const horizontalPadding = noPadding ? 0 : 24;
  
  // Calculate top padding: use insets.top, but on Android add StatusBar height if insets.top is 0 or very small
  const paddingTop = Platform.OS === 'android' 
    ? Math.max(insets.top, StatusBar.currentHeight || 24) + 16 
    : Math.max(insets.top, 20) + 8;
  
  const content = scroll ? (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: horizontalPadding, paddingBottom: 40 }} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, paddingHorizontal: horizontalPadding, paddingBottom: 32 }}>{children}</View>
  );

  return (
    <View className={className} style={{ flex: 1, backgroundColor: '#F8FAFC', paddingTop }}>
      {keyboardAvoid ? (
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </View>
  );
}

