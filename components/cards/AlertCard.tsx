import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Alert } from '../../types';

interface Props {
  alert: Alert;
  onAcknowledge: (id: string) => void;
}

export default function AlertCard({ alert, onAcknowledge }: Props) {
  const color = alert.severity === 'critical' ? Colors.critical : Colors.warning;
  const icon = alert.severity === 'critical' ? 'warning' : 'alert-circle';
  const time = new Date(alert.timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.card, { borderLeftColor: color, opacity: alert.acknowledged ? 0.5 : 1 }]}>
      <View style={styles.header}>
        <Ionicons name={icon} size={18} color={color} />
        <Text style={[styles.severity, { color }]}>
          {alert.severity === 'critical' ? 'CRÍTICO' : 'ALERTA'}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Text style={styles.message}>{alert.message}</Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>
          Valor: {alert.value.toFixed ? alert.value.toFixed(1) : alert.value} | Limiar: {alert.threshold}
        </Text>
        {!alert.acknowledged && (
          <Pressable onPress={() => onAcknowledge(alert.id)} style={styles.ackBtn}>
            <Text style={styles.ackText}>Reconhecer</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  severity: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  time: {
    marginLeft: 'auto',
    color: Colors.textMuted,
    fontSize: 11,
  },
  message: {
    color: Colors.textPrimary,
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  ackBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ackText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
