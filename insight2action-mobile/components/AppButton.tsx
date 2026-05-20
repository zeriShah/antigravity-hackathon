import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AppButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  className = '',
  icon,
  size = 'md',
}: AppButtonProps) {
  
  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 13, borderRadius: 10 },
    md: { paddingVertical: 15, paddingHorizontal: 24, fontSize: 15, borderRadius: 14 },
    lg: { paddingVertical: 18, paddingHorizontal: 28, fontSize: 16, borderRadius: 16 },
  };

  const variantStyles: Record<string, any> = {
    primary: {
      bg: '#4F46E5',
      text: '#FFFFFF',
      borderWidth: 0,
      shadowColor: '#4F46E5',
      shadowOpacity: 0.25,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    secondary: {
      bg: '#EEF2FF',
      text: '#4F46E5',
      borderWidth: 1,
      borderColor: '#C7D2FE',
    },
    outline: {
      bg: '#FFFFFF',
      text: '#475569',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    danger: {
      bg: '#FEF2F2',
      text: '#DC2626',
      borderWidth: 1,
      borderColor: '#FECACA',
    },
    ghost: {
      bg: 'transparent',
      text: '#4F46E5',
      borderWidth: 0,
    },
  };

  const vs = variantStyles[variant] || variantStyles.primary;
  const ss = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      className={className}
      style={[
        { 
          flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
          paddingVertical: ss.paddingVertical, paddingHorizontal: ss.paddingHorizontal,
          borderRadius: ss.borderRadius,
          backgroundColor: vs.bg,
          borderWidth: vs.borderWidth || 0,
          borderColor: vs.borderColor || 'transparent',
          opacity: isDisabled ? 0.5 : 1,
          shadowColor: vs.shadowColor,
          shadowOpacity: vs.shadowOpacity,
          shadowRadius: vs.shadowRadius,
          shadowOffset: vs.shadowOffset,
          elevation: vs.elevation,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#4F46E5'} size="small" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && <Text style={{ marginRight: 8, fontSize: ss.fontSize }}>{icon}</Text>}
          <Text style={{ color: vs.text, fontWeight: '700', fontSize: ss.fontSize }}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
