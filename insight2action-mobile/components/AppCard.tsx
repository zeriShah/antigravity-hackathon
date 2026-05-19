import { View } from 'react-native';

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function AppCard({ children, className = '', noPadding = false }: AppCardProps) {
  return (
    <View 
      className={`bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 ${noPadding ? '' : 'p-5'} mb-4 ${className}`}
    >
      {children}
    </View>
  );
}
