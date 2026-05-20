import { View, Text, TouchableOpacity, Alert, Platform, Share, Modal, TextInput, ActivityIndicator } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { SeverityBadge } from '../components/SeverityBadge';
import { ConfidenceBar } from '../components/ConfidenceBar';
import { AgentTrace } from '../components/AgentTrace';
import { ExecutiveSummaryCard } from '../components/ExecutiveSummaryCard';
import { AnalyzeResponse } from '../lib/types';
import { simulateCustomAction, regenerateAction } from '../lib/api';
import { useState } from 'react';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'actions' | 'simulation'>('overview');
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  
  const [currentResult, setCurrentResult] = useState<AnalyzeResponse | null>(() => {
    try {
      if (params.resultData && typeof params.resultData === 'string') {
        return JSON.parse(params.resultData);
      }
    } catch (e) {
      console.error("Failed to parse result data", e);
    }
    return null;
  });
  
  const result = currentResult;

  const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
  const [modifiedActionText, setModifiedActionText] = useState("");
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [decisionSource, setDecisionSource] = useState<"AI Recommendation" | "User Modified Action" | "Alternative Action">("AI Recommendation");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleApproveAction = () => {
    setActiveTab('simulation');
    setDecisionSource('AI Recommendation');
  };

  const handleModifyAction = () => {
    setModifiedActionText(result?.recommended_action || "");
    setIsModifyModalVisible(true);
  };

  const handleSaveAndSimulate = async () => {
    if (!result || !modifiedActionText.trim()) return;
    setIsSimulating(true);
    try {
      const newSim = await simulateCustomAction(params.id as string || "mock-id", modifiedActionText);
      setCurrentResult({
        ...result,
        simulation: newSim
      });
      setDecisionSource('User Modified Action');
      setIsModifyModalVisible(false);
      setActiveTab('simulation');
    } catch (e) {
      Alert.alert("Simulation Failed", String(e));
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateAlternative = async (altAction: string) => {
    if (!result) return;
    setIsSimulating(true);
    try {
      const newSim = await simulateCustomAction(params.id as string || "mock-id", altAction);
      setCurrentResult({
        ...result,
        simulation: newSim
      });
      setDecisionSource('Alternative Action');
      setActiveTab('simulation');
    } catch (e) {
      Alert.alert("Simulation Failed", String(e));
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRegenerateAction = async () => {
    if (!result || !feedbackText.trim()) return;
    setIsRegenerating(true);
    try {
      const res = await regenerateAction(params.id as string || "mock-id", feedbackText);
      setCurrentResult({
        ...result,
        recommended_action: res.recommended_action,
        why_this_action: res.why_this_action,
        alternative_actions: res.alternative_actions
      });
      setFeedbackText("");
      setShowAlternatives(false); 
    } catch (e) {
      Alert.alert("Regeneration Failed", String(e));
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!result) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            width: 72, height: 72, borderRadius: 20,
            backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA',
            alignItems: 'center', justifyContent: 'center', marginBottom: 24,
          }}>
            <Text style={{ fontSize: 32 }}>📭</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#64748B', marginBottom: 24 }}>No result data found.</Text>
          <AppButton title="Go Back" onPress={() => router.back()} />
        </View>
      </ScreenContainer>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '📋' },
    { key: 'insights', label: 'Insights', icon: '💡' },
    { key: 'actions', label: 'Actions', icon: '🎯' },
    { key: 'simulation', label: 'Simulation', icon: '🚀' },
  ] as const;

  const renderOverview = () => {
    const risk_if_no_action = result!.counterfactual?.if_no_action?.projected_outcome || "Potential escalation of operational risk";
    const estimated_completion = result!.action_pack?.estimated_completion || "To be determined";
    const responsible_team = result!.action_pack?.responsible_team || "Operations Team";

    return (
      <View>
        <ExecutiveSummaryCard
          domain_label={result!.domain}
          confidence={result!.confidence}
          severity={result!.severity}
          recommended_action={result!.recommended_action}
          impact_summary={result!.impact}
          risk_if_no_action={risk_if_no_action}
          estimated_completion={estimated_completion}
          responsible_team={responsible_team}
        />
        {/* Summary Card */}
        <AppCard accent elevated>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <View style={{ flex: 1, marginRight: 8, minWidth: 150 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Domain</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{result!.domain}</Text>
          </View>
          <SeverityBadge severity={result!.severity} />
        </View>
        <ConfidenceBar confidence={result!.confidence} />
      </AppCard>

      {/* Executive Summary */}
      {result!.executive_summary && (
        <AppCard elevated>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>📝</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }}>Executive Summary</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22 }}>{result!.executive_summary}</Text>
        </AppCard>
      )}

      {/* Key Insight */}
      <AppCard elevated>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
            <Text style={{ fontSize: 14 }}>💡</Text>
          </View>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }}>Key Insight</Text>
        </View>
        <Text style={{ fontSize: 15, color: '#0F172A', lineHeight: 23, fontWeight: '600' }}>{result!.key_insight}</Text>
      </AppCard>

      {/* Impact */}
      <AppCard elevated>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
            <Text style={{ fontSize: 14 }}>⚡</Text>
          </View>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }}>Impact Assessment</Text>
        </View>
        <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22 }}>{result!.impact}</Text>
      </AppCard>

      {/* Primary Action */}
      <View style={{
        backgroundColor: '#4F46E5', borderRadius: 16, padding: 20, marginBottom: 12,
        shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontSize: 14, marginRight: 8 }}>🎯</Text>
          <Text style={{ fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>Primary Recommendation</Text>
        </View>
        <Text style={{ fontSize: 16, color: '#FFFFFF', lineHeight: 24, fontWeight: '700' }}>{result!.recommended_action}</Text>
      </View>

      {/* Why This Action? (Step 7) */}
      {result!.why_this_action && (
        <AppCard elevated>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 14, marginRight: 8 }}>🤔</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }}>Why This Action?</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22 }}>{result!.why_this_action}</Text>
        </AppCard>
      )}

      {/* Decision Control (Step 7) */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 10, paddingHorizontal: 4 }}>
          Decision Control
        </Text>
        <View style={{ gap: 8 }}>
          <TouchableOpacity
            onPress={handleApproveAction}
            style={{ backgroundColor: '#10B981', padding: 14, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>✓ Approve Action</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <TouchableOpacity
              onPress={handleModifyAction}
              style={{ flex: 1, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', padding: 14, borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ color: '#334155', fontWeight: '700', fontSize: 13 }}>✏️ Modify Action</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowAlternatives(!showAlternatives)}
              style={{ flex: 1, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', padding: 14, borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 13 }}>✖ Reject & Suggest</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Alternative Actions */}
        {showAlternatives && result!.alternative_actions && (
          <AppCard elevated accent style={{ marginTop: 12, borderColor: '#FECACA' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 12 }}>Alternative Actions</Text>
            <View style={{ gap: 10 }}>
              {result!.alternative_actions.map((alt, idx) => (
                <View key={idx} style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#F1F5F9' }}>
                  <Text style={{ fontSize: 13, color: '#334155', marginBottom: 10 }}>{alt}</Text>
                  <TouchableOpacity
                    onPress={() => handleSimulateAlternative(alt)}
                    disabled={isSimulating}
                    style={{ backgroundColor: '#4F46E5', padding: 8, borderRadius: 6, alignItems: 'center', opacity: isSimulating ? 0.7 : 1 }}
                  >
                    <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>Simulate This Action</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            
            {/* Feedback for new alternatives */}
            <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 8 }}>None of these work? Suggest new alternatives:</Text>
              <TextInput
                style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A', minHeight: 60, textAlignVertical: 'top', marginBottom: 10 }}
                multiline
                placeholder="e.g. Suggest a lower-cost alternative."
                value={feedbackText}
                onChangeText={setFeedbackText}
              />
              <TouchableOpacity
                onPress={handleRegenerateAction}
                disabled={isRegenerating || !feedbackText.trim()}
                style={{ backgroundColor: '#0F172A', padding: 10, borderRadius: 8, alignItems: 'center', opacity: (isRegenerating || !feedbackText.trim()) ? 0.5 : 1 }}
              >
                {isRegenerating ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '600' }}>Regenerate Alternatives</Text>}
              </TouchableOpacity>
            </View>
          </AppCard>
        )}
      </View>

      {/* Data Quality */}
      {result!.data_quality_score != null && (
        <AppCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, marginRight: 8 }}>📐</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B' }}>Data Quality Score</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>
              {Math.round(result!.data_quality_score! * 100)}%
            </Text>
          </View>
        </AppCard>
      )}

      {/* Decision Confidence Breakdown (Step 9) */}
      {result!.confidence_breakdown && (
        <View style={{
          backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 12,
          shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
          borderWidth: 1, borderColor: '#DBEAFE',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
              <Text style={{ fontSize: 16 }}>🔍</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E3A8A' }}>Why Trust This Decision?</Text>
          </View>
          
          <Text style={{ fontSize: 14, color: '#334155', lineHeight: 22, fontStyle: 'italic', marginBottom: 16, paddingLeft: 4 }}>
            "{result!.confidence_breakdown.reasoning}"
          </Text>

          <View style={{ gap: 12 }}>
            {result!.confidence_breakdown.factors.map((factor, index) => {
              const p = Math.max(0, Math.min(100, Math.round(factor.score * 100)));
              let fc = '#10B981'; // emerald-500
              if (p < 50) fc = '#EF4444'; // red-500
              else if (p < 75) fc = '#F59E0B'; // amber-500
              else if (p < 90) fc = '#6366F1'; // indigo-500
              
              return (
                <View key={index} style={{ backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#F1F5F9' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }}>{factor.name}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: fc }}>{p}%</Text>
                  </View>
                  <View style={{ height: 6, width: '100%', backgroundColor: '#E2E8F0', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
                    <View style={{ height: '100%', borderRadius: 6, backgroundColor: fc, width: `${p}%` }} />
                  </View>
                  <Text style={{ fontSize: 12, color: '#64748B', lineHeight: 18 }}>{factor.description}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
  };

  const renderInsights = () => (
    <View>
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 14, paddingHorizontal: 4 }}>
        Detailed Findings
      </Text>
      {result!.detailed_insights && result!.detailed_insights.length > 0 ? (
        result!.detailed_insights.map((insight, index) => (
          <AppCard key={index} elevated>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE',
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
              }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase' }}>{insight.category}</Text>
              </View>
              <SeverityBadge severity={insight.risk_level} />
            </View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 8, lineHeight: 22 }}>{insight.finding}</Text>
            <View style={{
              backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12,
              borderWidth: 1, borderColor: '#F1F5F9',
            }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Evidence</Text>
              <Text style={{ fontSize: 13, color: '#64748B', lineHeight: 19, fontStyle: 'italic' }}>"{insight.evidence}"</Text>
            </View>
          </AppCard>
        ))
      ) : (
        <AppCard>
          <Text style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center', paddingVertical: 20 }}>
            No detailed insights available for this analysis.
          </Text>
        </AppCard>
      )}
    </View>
  );

  const renderActions = () => (
    <View>
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 14, paddingHorizontal: 4 }}>
        Improvement Roadmap
      </Text>
      {result!.improvement_steps && result!.improvement_steps.length > 0 ? (
        result!.improvement_steps.map((step, index) => (
          <AppCard key={index} elevated>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              {/* Step Number */}
              <View style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center',
                marginRight: 14,
              }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFFFFF' }}>{step.step_number}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 6 }}>{step.title}</Text>
                <Text style={{ fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 12 }}>{step.description}</Text>
                
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {/* Timeline */}
                  <View style={{
                    flex: 1, backgroundColor: '#F0F9FF', borderWidth: 1, borderColor: '#BAE6FD',
                    borderRadius: 8, padding: 10,
                  }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 3 }}>Timeline</Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#0284C7' }}>{step.timeline}</Text>
                  </View>
                  {/* Expected Outcome */}
                  <View style={{
                    flex: 2, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0',
                    borderRadius: 8, padding: 10,
                  }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 3 }}>Expected Outcome</Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#16A34A', lineHeight: 17 }}>{step.expected_outcome}</Text>
                  </View>
                </View>
              </View>
            </View>
          </AppCard>
        ))
      ) : (
        <AppCard>
          <Text style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center', paddingVertical: 20 }}>
            No improvement steps available for this analysis.
          </Text>
        </AppCard>
      )}
    </View>
  );

  const renderSimulation = () => {
    const risk_if_no_action = result!.counterfactual?.if_no_action?.projected_outcome || "Potential escalation of operational risk";
    const estimated_completion = result!.action_pack?.estimated_completion || "To be determined";
    const responsible_team = result!.action_pack?.responsible_team || "Operations Team";

    return (
      <View>
        {/* Decision Source Banner */}
        <View style={{ backgroundColor: '#EEF2FF', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#C7D2FE', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>ℹ️</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Simulation Source</Text>
            <Text style={{ fontSize: 13, color: '#312E81', fontWeight: '600' }}>{decisionSource}</Text>
          </View>
        </View>

        <ExecutiveSummaryCard
          domain_label={result!.domain}
          confidence={result!.confidence}
          severity={result!.severity}
          recommended_action={result!.recommended_action}
          impact_summary={result!.impact}
          risk_if_no_action={risk_if_no_action}
          estimated_completion={estimated_completion}
          responsible_team={responsible_team}
        />
        {/* ===== PROJECTED IMPACT BANNER (Part C) ===== */}
        {result!.projected_impact && (
          <View style={{
          backgroundColor: '#4F46E5', borderRadius: 16, padding: 20, marginBottom: 16,
          shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>📈</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFFFFF' }}>Projected Impact</Text>
          </View>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 13 }}>📊</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Expected Improvement</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF', lineHeight: 20 }}>{result!.projected_impact.expected_improvement}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 13 }}>🛡️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Risk Reduction</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF', lineHeight: 20 }}>{result!.projected_impact.risk_reduction}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 13 }}>⚙️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Operational Outcome</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF', lineHeight: 20 }}>{result!.projected_impact.operational_outcome}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* ===== COUNTERFACTUAL DECISION COMPARISON (Part B) ===== */}
      {result!.counterfactual && (
        <View style={{ marginBottom: 16 }}>
          <View style={{ marginBottom: 14, paddingHorizontal: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 }}>What Happens Next?</Text>
            <Text style={{ fontSize: 13, color: '#64748B', lineHeight: 19 }}>Compare the expected outcomes with and without taking action.</Text>
          </View>

          {/* If Action Taken — Green Card */}
          <View style={{
            backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 10,
            borderWidth: 2, borderColor: '#BBF7D0',
            shadowColor: '#16A34A', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Text style={{ fontSize: 16 }}>✅</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#16A34A' }}>If Action Is Taken</Text>
              </View>
              <SeverityBadge severity={result!.counterfactual.if_action_taken.risk_level} />
            </View>
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 12 }}>
              {result!.counterfactual.if_action_taken.summary}
            </Text>
            <View style={{
              backgroundColor: '#F0FDF4', borderRadius: 10, padding: 12,
              borderWidth: 1, borderColor: '#BBF7D0',
            }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Projected Outcome</Text>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#16A34A' }}>{result!.counterfactual.if_action_taken.projected_outcome}</Text>
            </View>
          </View>

          {/* If No Action — Red Card */}
          <View style={{
            backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 10,
            borderWidth: 2, borderColor: '#FECACA',
            shadowColor: '#DC2626', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Text style={{ fontSize: 16 }}>⚠️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#DC2626' }}>If No Action Is Taken</Text>
              </View>
              <SeverityBadge severity={result!.counterfactual.if_no_action.risk_level} />
            </View>
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 12 }}>
              {result!.counterfactual.if_no_action.summary}
            </Text>
            <View style={{
              backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12,
              borderWidth: 1, borderColor: '#FECACA',
            }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Projected Outcome</Text>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#DC2626' }}>{result!.counterfactual.if_no_action.projected_outcome}</Text>
            </View>
          </View>
        </View>
      )}

      {/* ===== ACTION PACK (Step 8) ===== */}
      {result!.action_pack ? (() => {
        const pack = result!.action_pack!;
        const currentStatus = approvalStatus || pack.approval_status;
        const isApproved = currentStatus === 'Approved';

        const priorityColors: Record<string, { bg: string; border: string; text: string }> = {
          'Critical': { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' },
          'High': { bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C' },
          'Medium': { bg: '#FEFCE8', border: '#FEF08A', text: '#CA8A04' },
          'Low': { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A' },
        };
        const pc = priorityColors[pack.priority] || priorityColors['Medium'];

        const statusColors = isApproved
          ? { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A' }
          : { bg: '#FEFCE8', border: '#FEF08A', text: '#CA8A04' };

        const handleExport = async () => {
          try {
            // Build a very premium HTML template for the PDF
            let htmlContent = `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1E293B; max-width: 800px; margin: 0 auto; background-color: #FFFFFF;">
                <div style="text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; margin-bottom: 30px;">
                  <h1 style="color: #4F46E5; margin-bottom: 5px; font-size: 28px;">Insight2Action AI</h1>
                  <h2 style="color: #64748B; margin-top: 0; font-weight: 500; font-size: 18px;">Executive Action Report</h2>
                </div>
                
                <h2 style="color: #0F172A; font-size: 24px; margin-bottom: 15px;">${pack.action_title}</h2>
                <div style="margin-bottom: 25px;">
                  <span style="display: inline-block; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 12px; background: ${pack.priority.toLowerCase() === 'high' || pack.priority.toLowerCase() === 'critical' ? '#FEE2E2' : '#FEF3C7'}; color: ${pack.priority.toLowerCase() === 'high' || pack.priority.toLowerCase() === 'critical' ? '#DC2626' : '#D97706'};">${pack.priority} Priority</span>
                  <span style="display: inline-block; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 12px; background: ${isApproved ? '#F0FDF4' : '#F8FAFC'}; color: ${isApproved ? '#16A34A' : '#475569'}; margin-left: 10px;">Status: ${currentStatus}</span>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; background: #F8FAFC; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-weight: 600; color: #475569; width: 30%;">Responsible Team</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-weight: 700; color: #0F172A;">${pack.responsible_team}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 16px; font-weight: 600; color: #475569;">Estimated Completion</td>
                    <td style="padding: 12px 16px; font-weight: 700; color: #0F172A;">${pack.estimated_completion}</td>
                  </tr>
                </table>

                <h3 style="color: #1E3A8A; border-bottom: 2px solid #EEF2FF; padding-bottom: 8px; margin-top: 30px;">Executive Summary</h3>
                <p style="line-height: 1.6; color: #334155; font-size: 15px;">${pack.action_summary}</p>

                <h3 style="color: #1E3A8A; border-bottom: 2px solid #EEF2FF; padding-bottom: 8px; margin-top: 30px;">Generated Artifact: ${pack.generated_artifact.type}</h3>
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px; margin-top: 15px;">
                  <h4 style="margin-top: 0; color: #0F172A;">${pack.generated_artifact.title}</h4>
                  <p style="line-height: 1.6; color: #334155; margin-bottom: 0;">${pack.generated_artifact.content}</p>
                </div>

                <h3 style="color: #1E3A8A; border-bottom: 2px solid #EEF2FF; padding-bottom: 8px; margin-top: 30px;">Actionable Next Steps</h3>
                <ol style="line-height: 1.8; color: #334155; padding-left: 20px;">
                  ${pack.next_steps.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
                </ol>
            `;

            if (result!.counterfactual) {
              htmlContent += `
                <h3 style="color: #1E3A8A; border-bottom: 2px solid #EEF2FF; padding-bottom: 8px; margin-top: 30px;">Counterfactual Analysis</h3>
                <div style="display: flex; gap: 20px; margin-top: 15px;">
                  <div style="flex: 1; background: #F0FDF4; border: 1px solid #BBF7D0; padding: 15px; border-radius: 8px;">
                    <h4 style="color: #16A34A; margin-top: 0; margin-bottom: 10px;">If Action Taken</h4>
                    <p style="font-size: 14px; margin-bottom: 8px;"><b>Summary:</b><br/>${result!.counterfactual.if_action_taken.summary}</p>
                    <p style="font-size: 14px; margin-bottom: 0;"><b>Projected Outcome:</b><br/>${result!.counterfactual.if_action_taken.projected_outcome}</p>
                  </div>
                  <div style="flex: 1; background: #FEF2F2; border: 1px solid #FECACA; padding: 15px; border-radius: 8px;">
                    <h4 style="color: #DC2626; margin-top: 0; margin-bottom: 10px;">If No Action</h4>
                    <p style="font-size: 14px; margin-bottom: 8px;"><b>Summary:</b><br/>${result!.counterfactual.if_no_action.summary}</p>
                    <p style="font-size: 14px; margin-bottom: 0;"><b>Projected Outcome:</b><br/>${result!.counterfactual.if_no_action.projected_outcome}</p>
                  </div>
                </div>
              `;
            }

            const sim = result!.simulation as any;
            if (sim && sim.before_state && sim.after_state) {
              htmlContent += `
                <h3 style="color: #1E3A8A; border-bottom: 2px solid #EEF2FF; padding-bottom: 8px; margin-top: 30px;">Simulation Metrics</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
                  <tr style="background: #F8FAFC;">
                    <th style="padding: 10px; border: 1px solid #E2E8F0; text-align: left;">Metric</th>
                    <th style="padding: 10px; border: 1px solid #E2E8F0; text-align: left;">Before State</th>
                    <th style="padding: 10px; border: 1px solid #E2E8F0; text-align: left;">After State</th>
                  </tr>
                  ${Object.keys(sim.before_state).map(k => `
                    <tr>
                      <td style="padding: 10px; border: 1px solid #E2E8F0; font-weight: 600; text-transform: capitalize;">${k.replace(/_/g, ' ')}</td>
                      <td style="padding: 10px; border: 1px solid #E2E8F0; color: #DC2626;">${sim.before_state[k]}</td>
                      <td style="padding: 10px; border: 1px solid #E2E8F0; color: #16A34A; font-weight: bold;">${sim.after_state[k] || 'N/A'}</td>
                    </tr>
                  `).join('')}
                </table>
              `;
            }

            htmlContent += `</div>`;

            // Wrap in basic HTML tags for Print API
            const fullHtml = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                </head>
                <body>
                  ${htmlContent}
                </body>
              </html>
            `;

            // Fallback plain text for native share failure
            let textContent = `# Action Pack: ${pack.action_title}\n\n`;
            textContent += `**Priority:** ${pack.priority}\n`;
            textContent += `**Approval Status:** ${currentStatus}\n`;
            textContent += `**Responsible Team:** ${pack.responsible_team}\n`;
            textContent += `**Estimated Completion:** ${pack.estimated_completion}\n\n`;
            textContent += `## Summary\n${pack.action_summary}\n\n`;
            textContent += `## Next Steps\n`;
            pack.next_steps.forEach((step, idx) => { textContent += `${idx + 1}. ${step}\n`; });

            if (Platform.OS === 'web') {
              // Inject html2pdf.js dynamically to trigger a direct download instead of a print popup
              const scriptId = 'html2pdf-script';
              const downloadPdf = () => {
                const element = document.createElement('div');
                element.innerHTML = htmlContent;
                // Add some extra CSS to fix pdf rendering cuts
                element.style.width = '800px'; 
                (window as any).html2pdf().set({
                  margin: 10,
                  filename: 'Insight2Action_Report.pdf',
                  image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: { scale: 2 },
                  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                }).from(element).save();
              };

              if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
                script.onload = downloadPdf;
                document.head.appendChild(script);
              } else {
                downloadPdf();
              }
            } else {
              // On native (iOS/Android), generate PDF file and open the native Share Sheet
              const { uri } = await Print.printToFileAsync({ html: fullHtml });
              const isSharingAvailable = await Sharing.isAvailableAsync();
              
              if (isSharingAvailable) {
                await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
              } else {
                await Share.share({ message: textContent, title: 'Export Action Pack' });
              }
            }
          } catch (error: any) {
            console.error('Error generating PDF', error);
            Alert.alert('Error', 'Failed to generate PDF: ' + error.message);
          }
        };

        return (
          <View style={{ marginBottom: 16 }}>
            <View style={{ marginBottom: 14, paddingHorizontal: 4 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 }}>Generated Action Pack</Text>
              <Text style={{ fontSize: 13, color: '#64748B', lineHeight: 19 }}>A ready-to-review operational package created from the recommended action.</Text>
            </View>

            <AppCard elevated accent>
              {/* Header: Title + Badges */}
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 12 }}>{pack.action_title}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                <View style={{ backgroundColor: pc.bg, borderWidth: 1, borderColor: pc.border, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: pc.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>{pack.priority} Priority</Text>
                </View>
                <View style={{ backgroundColor: statusColors.bg, borderWidth: 1, borderColor: statusColors.border, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: statusColors.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>{currentStatus}</Text>
                </View>
              </View>

              <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 16 }}>{pack.action_summary}</Text>

              {/* Meta Row */}
              <View style={{ flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden', marginBottom: 16 }}>
                <View style={{ flex: 1, padding: 14, borderRightWidth: 1, borderRightColor: '#F1F5F9' }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Team</Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#0F172A' }}>{pack.responsible_team}</Text>
                </View>
                <View style={{ flex: 1, padding: 14 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Est. Completion</Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#0F172A' }}>{pack.estimated_completion}</Text>
                </View>
              </View>

              {/* Generated Artifact */}
              <View style={{ backgroundColor: '#EEF2FF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#C7D2FE', marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 14, marginRight: 8 }}>📄</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: 0.5 }}>{pack.generated_artifact.type}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 6 }}>{pack.generated_artifact.title}</Text>
                <Text style={{ fontSize: 13, color: '#475569', lineHeight: 20 }}>{pack.generated_artifact.content}</Text>
              </View>

              {/* Next Steps Checklist */}
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Next Steps</Text>
              {pack.next_steps.map((step, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                  <View style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: isApproved ? '#F0FDF4' : '#F8FAFC', borderWidth: 1, borderColor: isApproved ? '#BBF7D0' : '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 1 }}>
                    <Text style={{ fontSize: 10, color: isApproved ? '#16A34A' : '#94A3B8' }}>{isApproved ? '✓' : (idx + 1)}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: 13, color: '#475569', lineHeight: 19 }}>{step}</Text>
                </View>
              ))}

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                <TouchableOpacity
                  onPress={() => setApprovalStatus(isApproved ? 'Pending Approval' : 'Approved')}
                  style={{
                    flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center',
                    backgroundColor: isApproved ? '#F0FDF4' : '#4F46E5',
                    borderWidth: isApproved ? 1 : 0, borderColor: '#BBF7D0',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: isApproved ? '#16A34A' : '#FFFFFF' }}>
                    {isApproved ? '✓ Approved' : '✓ Approve Action'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleExport}
                  style={{
                    flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center',
                    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#475569' }}>📤 Export Pack</Text>
                </TouchableOpacity>
              </View>
            </AppCard>
          </View>
        );
      })() : (
        <AppCard>
          <Text style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center', paddingVertical: 16 }}>
            No action pack generated for this simulation.
          </Text>
        </AppCard>
      )}

      {/* ===== SIMULATION CARD (existing) ===== */}
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 14, paddingHorizontal: 4 }}>
        Simulated Execution
      </Text>
      <AppCard elevated accent>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <View style={{
            backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE',
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
          }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: 0.5 }}>{result!.simulation.type.replace('_', ' ')}</Text>
          </View>
          <View style={{
            backgroundColor: result!.simulation.status === 'Open' ? '#FFF7ED' : '#F0FDF4',
            borderWidth: 1, borderColor: result!.simulation.status === 'Open' ? '#FED7AA' : '#BBF7D0',
            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
          }}>
            <Text style={{
              fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5,
              color: result!.simulation.status === 'Open' ? '#EA580C' : '#16A34A',
            }}>{result!.simulation.status}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 }}>{result!.simulation.title}</Text>
        <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 16 }}>{result!.simulation.description}</Text>

        {/* Meta Grid */}
        <View style={{ 
          flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, 
          borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' 
        }}>
          <View style={{ flex: 1, padding: 14, borderRightWidth: 1, borderRightColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Priority</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }}>{result!.simulation.priority}</Text>
          </View>
          <View style={{ flex: 1, padding: 14 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Assigned Team</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }}>{result!.simulation.assigned_team}</Text>
          </View>
        </View>
      </AppCard>

      {/* Agent Trace */}
      <AgentTrace result={result!} />
    </View>
  );
  };

  return (
    <ScreenContainer scroll>
      <AppHeader title="Analysis Report" showBack />
      
      {/* Tab Navigation */}
      <View style={{ 
        flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, 
        padding: 4, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9',
        shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03, shadowRadius: 6,
      }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{
              flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
              backgroundColor: activeTab === tab.key ? '#4F46E5' : 'transparent',
            }}
          >
            <Text style={{ fontSize: 12, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{
              fontSize: 11, fontWeight: '700',
              color: activeTab === tab.key ? '#FFFFFF' : '#94A3B8',
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'insights' && renderInsights()}
        {activeTab === 'actions' && renderActions()}
        {activeTab === 'simulation' && renderSimulation()}
      </View>

      {/* Bottom Actions */}
      <View style={{ marginTop: 20, marginBottom: 8, gap: 10 }}>
        <AppButton 
          title="New Analysis" 
          icon="⚡"
          onPress={() => router.replace('/input')} 
        />
        <AppButton 
          title="View History" 
          icon="📋"
          variant="secondary"
          onPress={() => router.push('/history')} 
        />
        <AppButton 
          title="Back to Home" 
          variant="outline"
          onPress={() => router.replace('/')} 
        />
      </View>

      {/* Modify Action Modal */}
      <Modal
        visible={isModifyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModifyModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFF', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 }}>✏️ Modify Recommended Action</Text>
            <TextInput
              style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 15, color: '#0F172A', minHeight: 100, textAlignVertical: 'top', marginBottom: 20 }}
              multiline
              value={modifiedActionText}
              onChangeText={setModifiedActionText}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setIsModifyModalVisible(false)}
                style={{ flex: 1, backgroundColor: '#F1F5F9', padding: 14, borderRadius: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#475569', fontWeight: '700', fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveAndSimulate}
                disabled={isSimulating}
                style={{ flex: 1, backgroundColor: '#4F46E5', padding: 14, borderRadius: 12, alignItems: 'center', opacity: isSimulating ? 0.7 : 1 }}
              >
                {isSimulating ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>Save & Simulate</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
