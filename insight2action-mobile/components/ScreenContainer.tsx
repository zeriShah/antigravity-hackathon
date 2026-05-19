import { View, ScrollView, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  className?: string;
  keyboardAvoid?: boolean;
}

export function ScreenContainer({ children, scroll = false, className = '', keyboardAvoid = false }: ScreenContainerProps) {
  const content = scroll ? (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 32 }} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1 px-5 pb-8">{children}</View>
  );

  return (
    <SafeAreaView className={`flex-1 bg-slate-50 ${className}`}>
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
