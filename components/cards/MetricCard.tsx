import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { Colors } from '../../constants/colors';

type Status = 'normal' | 'warning' | 'critical';

interface Props extends Pick<ViewProps, 'testID'> {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  subtext?: string;
  status?: Status;
}

const statusColor: Record<Status, string> = {
  normal: Colors.normal,
  warning: Colors.warning,
  critical: Colors.critical,
};

export default function MetricCard({ label, value, icon, subtext, status = 'normal', testID }: Props) {
  const color = statusColor[status];
  return (
    <View style={[styles.card, { borderLeftColor: color }]} testID={testID}>
      <View style={styles.row}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 4,
    borderLeftWidth: 3,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtext: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
