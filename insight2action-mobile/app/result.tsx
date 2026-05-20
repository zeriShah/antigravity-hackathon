import { View, Text, TouchableOpacity, Alert, Platform, Share } from 'react-native';
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
import { useState } from 'react';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'actions' | 'simulation'>('overview');
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  
  let result: AnalyzeResponse | null = null;
  try {
    if (params.resultData && typeof params.resultData === 'string') {
      result = JSON.parse(params.resultData);
    }
  } catch (e) {
    console.error("Failed to parse result data", e);
  }

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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <View>
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
          let content = `# Action Pack: ${pack.action_title}\n\n`;
          content += `**Priority:** ${pack.priority}\n`;
          content += `**Approval Status:** ${currentStatus}\n`;
          content += `**Responsible Team:** ${pack.responsible_team}\n`;
          content += `**Estimated Completion:** ${pack.estimated_completion}\n\n`;
          
          content += `## Summary\n${pack.action_summary}\n\n`;
          
          content += `## Generated Artifact (${pack.generated_artifact.type})\n`;
          content += `**${pack.generated_artifact.title}**\n${pack.generated_artifact.content}\n\n`;
          
          content += `## Next Steps\n`;
          pack.next_steps.forEach((step, idx) => {
            content += `${idx + 1}. ${step}\n`;
          });
          
          if (result!.counterfactual) {
            content += `\n## Counterfactual Comparison\n`;
            content += `**If Action Taken:**\n`;
            content += `- Summary: ${result!.counterfactual.if_action_taken.summary}\n`;
            content += `- Projected Outcome: ${result!.counterfactual.if_action_taken.projected_outcome}\n`;
            content += `**If No Action:**\n`;
            content += `- Summary: ${result!.counterfactual.if_no_action.summary}\n`;
            content += `- Projected Outcome: ${result!.counterfactual.if_no_action.projected_outcome}\n`;
          }
          
          const sim = result!.simulation as any;
          if (sim && sim.before_state && sim.after_state) {
            content += `\n## Simulation Metrics\n`;
            content += `**Before State:**\n`;
            Object.entries(sim.before_state).forEach(([k, v]) => {
              content += `- ${k}: ${v}\n`;
            });
            content += `**After State:**\n`;
            Object.entries(sim.after_state).forEach(([k, v]) => {
              content += `- ${k}: ${v}\n`;
            });
          }

          if (Platform.OS === 'web') {
            try {
              if (navigator.share) {
                await navigator.share({
                  title: 'Action Pack',
                  text: content
                });
              } else {
                await navigator.clipboard.writeText(content);
                window.alert('Action Pack copied to clipboard.');
              }
            } catch (e) {
              console.log('Error sharing', e);
            }
          } else {
            try {
              await Share.share({
                message: content,
                title: 'Export Action Pack'
              });
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
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
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
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
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }} numberOfLines={1}>{result!.simulation.assigned_team}</Text>
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
    </ScreenContainer>
  );
}
