import { View, ScrollView, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  className?: string;
  keyboardAvoid?: boolean;
  noPadding?: boolean;
}

export function ScreenContainer({ children, scroll = false, className = '', keyboardAvoid = false, noPadding = false }: ScreenContainerProps) {
  const horizontalPadding = noPadding ? 0 : 24;
  
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
    <SafeAreaView className={className} style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
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
    </SafeAreaView>
  );
}
