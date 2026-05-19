import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function AppButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  className = '' 
}: AppButtonProps) {
  
  let bgClass = '';
  let textClass = '';

  switch (variant) {
    case 'primary':
      bgClass = 'bg-indigo-600 border border-indigo-600';
      textClass = 'text-white';
      break;
    case 'secondary':
      bgClass = 'bg-indigo-100 border border-indigo-100';
      textClass = 'text-indigo-700';
      break;
    case 'outline':
      bgClass = 'bg-transparent border border-slate-300';
      textClass = 'text-slate-700';
      break;
    case 'danger':
      bgClass = 'bg-red-50 border border-red-200';
      textClass = 'text-red-600';
      break;
  }

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row justify-center items-center py-4 px-6 rounded-2xl ${bgClass} ${isDisabled ? 'opacity-60' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#4f46e5'} size="small" />
      ) : (
        <Text className={`font-semibold text-base ${textClass}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
