import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { API_BASE_URL } from '../lib/api';

interface LogMessage {
  level: string;
  message: string;
  progress: number;
}

interface AgentExecutionConsoleProps {
  domain: string;
  actionTitle: string;
  responsibleTeam: string;
  onComplete: () => void;
  onClose: () => void;
}

export function AgentExecutionConsole({ domain, actionTitle, responsibleTeam, onComplete, onClose }: AgentExecutionConsoleProps) {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isExecuting, setIsExecuting] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let active = true;
    
    const startExecution = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, action_title: actionTitle, responsible_team: responsibleTeam })
        });

        
        if (!response.body) throw new Error('ReadableStream not supported');
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (active) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6);
              try {
                const data = JSON.parse(dataStr);
                setLogs(prev => [...prev, data]);
                setProgress(data.progress);
                if (data.level === 'SUCCESS') {
                  setIsExecuting(false);
                  setTimeout(() => {
                    if (active) onComplete();
                  }, 2000);
                }
              } catch (e) {
                console.error("Failed to parse log", e);
              }
            }
          }
        }
      } catch (error) {
        console.error("Execution failed:", error);
        setLogs(prev => [...prev, { level: 'ERROR', message: String(error), progress: progress }]);
        setIsExecuting(false);
      }
    };
    
    startExecution();
    return () => { active = false; };
  }, [domain, actionTitle, responsibleTeam, onComplete]);

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.95)' }}>
      <View style={{ flex: 1, margin: 20, marginTop: 60, marginBottom: 40, backgroundColor: '#0F172A', borderRadius: 16, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' }}>
        
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B', backgroundColor: '#1E293B' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#EF4444', marginRight: 8 }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#F59E0B', marginRight: 8 }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', marginRight: 16 }} />
            <Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '600', fontFamily: 'monospace' }}>Agent Execution Console</Text>
          </View>
          <TouchableOpacity onPress={onClose} disabled={isExecuting} style={{ opacity: isExecuting ? 0.5 : 1 }}>
            <Text style={{ color: '#94A3B8', fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View style={{ height: 4, backgroundColor: '#1E293B', width: '100%' }}>
          <View style={{ height: '100%', backgroundColor: '#10B981', width: `${progress}%` }} />
        </View>

        {/* Console Logs */}
        <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ paddingBottom: 20 }}>
          {logs.map((log, index) => (
            <View key={index} style={{ flexDirection: 'row', marginBottom: 12 }}>
              <Text style={{ 
                color: log.level === 'SUCCESS' ? '#10B981' : log.level === 'ERROR' ? '#EF4444' : log.level === 'SYSTEM' ? '#3B82F6' : '#94A3B8', 
                fontSize: 12, fontWeight: '700', marginRight: 8, fontFamily: 'monospace', width: 60 
              }}>
                [{log.level}]
              </Text>
              <Text style={{ color: '#E2E8F0', fontSize: 13, fontFamily: 'monospace', flex: 1, lineHeight: 18 }}>
                {log.message}
              </Text>
            </View>
          ))}
          {isExecuting && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <ActivityIndicator size="small" color="#10B981" style={{ marginRight: 10 }} />
              <Text style={{ color: '#10B981', fontSize: 13, fontFamily: 'monospace', opacity: 0.8 }}>Executing next instruction...</Text>
            </View>
          )}
        </ScrollView>
        
      </View>
    </View>
  );
}
