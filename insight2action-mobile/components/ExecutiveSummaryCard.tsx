import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SeverityBadge } from './SeverityBadge';

interface ExecutiveSummaryProps {
  domain_label: string;
  confidence: number;
  severity: string;
  recommended_action: string;
  impact_summary: string;
  risk_if_no_action: string;
  estimated_completion: string;
  responsible_team: string;
}

export function ExecutiveSummaryCard({
  domain_label,
  confidence,
  severity,
  recommended_action,
  impact_summary,
  risk_if_no_action,
  estimated_completion,
  responsible_team,
}: ExecutiveSummaryProps) {
  const confidencePercent = Math.round(confidence * 100);

  return (
    <View style={styles.card}>
      {/* Subtle Blue Accent/Header Line */}
      <View style={styles.headerAccent} />

      <View style={styles.content}>
        {/* Top KPI Row */}
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{domain_label}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceText}>{confidencePercent}% Confident</Text>
            </View>
            <SeverityBadge severity={severity} />
          </View>
        </View>

        {/* Main Action Section */}
        <View style={styles.actionSection}>
          <View style={styles.actionHeader}>
            <Text style={styles.icon}>🎯</Text>
            <Text style={styles.actionTitle}>Recommended Action</Text>
          </View>
          <Text style={styles.actionText}>{recommended_action}</Text>
        </View>

        {/* Metrics Grid 2x2 */}
        <View style={styles.grid}>
          <View style={[styles.gridCell, styles.cellBorderRight, styles.cellBorderBottom]}>
            <Text style={styles.gridLabel}>Expected Impact</Text>
            <Text style={styles.gridValue}>{impact_summary}</Text>
          </View>
          <View style={[styles.gridCell, styles.cellBorderBottom]}>
            <Text style={styles.gridLabel}>Risk if No Action</Text>
            <Text style={[styles.gridValue, { color: '#DC2626' }]}>{risk_if_no_action}</Text>
          </View>
          <View style={[styles.gridCell, styles.cellBorderRight]}>
            <Text style={styles.gridLabel}>Est. Completion</Text>
            <Text style={styles.gridValue}>{estimated_completion}</Text>
          </View>
          <View style={styles.gridCell}>
            <Text style={styles.gridLabel}>Responsible Team</Text>
            <Text style={styles.gridValue}>{responsible_team}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  headerAccent: {
    height: 4,
    backgroundColor: '#3B82F6', // Blue-500
    width: '100%',
  },
  content: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  confidenceContainer: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  actionSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  gridCell: {
    width: '50%',
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  cellBorderRight: {
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  cellBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
});
