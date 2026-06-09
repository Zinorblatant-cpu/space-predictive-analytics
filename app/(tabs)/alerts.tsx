import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import AlertCard from '../../components/cards/AlertCard';
import Header from '../../components/common/Header';
import { Colors } from '../../constants/colors';
import { useAlerts } from '../../context/AlertContext';
import { AlertSeverity } from '../../types';

type Filter = 'all' | AlertSeverity;

export default function AlertsScreen() {
  const { alerts, unacknowledgedCount, acknowledgeAlert, clearAll } = useAlerts();
  const [filter, setFilter] = useState<Filter>('all');

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter);

  const filters: { key: Filter; label: string; color: string }[] = [
    { key: 'all', label: `Todos (${alerts.length})`, color: Colors.primary },
    { key: 'critical', label: `Críticos (${criticalCount})`, color: Colors.critical },
    { key: 'warning', label: `Alertas (${warningCount})`, color: Colors.warning },
  ];

  return (
    <View style={styles.screen}>
      <Header title="Alertas" subtitle={`${unacknowledgedCount} não reconhecido(s)`} />

      {/* Contadores */}
      <View style={styles.counters}>
        <View style={[styles.counter, { borderColor: Colors.critical }]}>
          <Text style={[styles.counterNum, { color: Colors.critical }]}>{criticalCount}</Text>
          <Text style={styles.counterLabel}>Críticos</Text>
        </View>
        <View style={[styles.counter, { borderColor: Colors.warning }]}>
          <Text style={[styles.counterNum, { color: Colors.warning }]}>{warningCount}</Text>
          <Text style={styles.counterLabel}>Alertas</Text>
        </View>
        <View style={[styles.counter, { borderColor: Colors.accent }]}>
          <Text style={[styles.counterNum, { color: Colors.accent }]}>{alerts.length - unacknowledgedCount}</Text>
          <Text style={styles.counterLabel}>Reconhecidos</Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <Pressable
            key={f.key}
            style={[styles.filterBtn, filter === f.key && { borderColor: f.color, backgroundColor: `${f.color}22` }]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && { color: f.color }]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Lista */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="checkmark-circle" size={48} color={Colors.accent} />
          <Text style={styles.emptyText}>Nenhum alerta {filter !== 'all' ? `(${filter})` : ''}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AlertCard alert={item} onAcknowledge={acknowledgeAlert} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Limpar todos */}
      {alerts.length > 0 && (
        <Pressable style={styles.clearBtn} onPress={clearAll}>
          <Ionicons name="trash" size={16} color={Colors.textSecondary} />
          <Text style={styles.clearText}>Limpar todos</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  counters: { flexDirection: 'row', padding: 16, gap: 10 },
  counter: {
    flex: 1, alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: 10, padding: 12, borderWidth: 1,
  },
  counterNum: { fontSize: 24, fontWeight: '800' },
  counterLabel: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  filterBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 8,
    borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterText: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600' },
  list: { padding: 16, paddingTop: 8 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { color: Colors.textSecondary, fontSize: 16 },
  clearBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: 14, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  clearText: { color: Colors.textSecondary, fontSize: 14 },
});
