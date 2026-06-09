import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/common/Header';
import LineChart from '../../components/charts/LineChart';
import MetricCard from '../../components/cards/MetricCard';
import { Colors } from '../../constants/colors';
import { useMission } from '../../context/MissionContext';

function GaugeBar({ value, max = 100, color, label }: { value: number; max?: number; color: string; label: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <View style={gauge.container}>
      <View style={gauge.labelRow}>
        <Text style={gauge.label}>{label}</Text>
        <Text style={[gauge.val, { color }]}>{value.toFixed(1)}{max === 100 ? '%' : ''}</Text>
      </View>
      <View style={gauge.track}>
        <View style={[gauge.fill, { width: `${pct}%` as `${number}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function EnergyScreen() {
  const { currentSensor, energyHistory, settings } = useMission();

  const batteries = energyHistory.map((e) => e.batteryLevel);
  const solars = energyHistory.map((e) => e.solarOutput);
  const consumptions = energyHistory.map((e) => e.consumption);

  const battStatus = currentSensor && currentSensor.solarOutput < settings.thresholds.batteryMin
    ? 'critical' : currentSensor && currentSensor.solarOutput < settings.thresholds.batteryMin * 1.5
    ? 'warning' : 'normal';

  const latestEnergy = energyHistory[energyHistory.length - 1];

  return (
    <View style={styles.screen}>
      <Header title="Energia" subtitle="Painéis solares e consumo" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>Indicadores de Energia</Text>
        <View style={styles.row}>
          <MetricCard label="Saída Solar" value={currentSensor ? `${currentSensor.solarOutput}%` : '--'} icon="sunny" status={battStatus} />
          <MetricCard label="Saúde (RUL)" value={currentSensor ? `${currentSensor.rul}%` : '--'} icon="heart" status={currentSensor && currentSensor.rul < settings.thresholds.rulMin ? 'critical' : 'normal'} />
        </View>

        {latestEnergy && (
          <>
            <Text style={styles.sectionTitle}>Gauges de Energia</Text>
            <View style={styles.gaugesCard}>
              <GaugeBar value={latestEnergy.batteryLevel} label="Bateria" color={latestEnergy.batteryLevel < 25 ? Colors.critical : Colors.accent} />
              <GaugeBar value={latestEnergy.solarOutput} label="Painel Solar" color={Colors.warning} />
              <GaugeBar value={latestEnergy.consumption} max={120} label="Consumo (W)" color={Colors.info} />
              <GaugeBar value={Math.min(100, latestEnergy.efficiency * 50)} label="Eficiência" color={Colors.primary} />
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Histórico</Text>
        <LineChart data={batteries} label="Nível de Bateria" unit="%" color={Colors.accent} />
        <LineChart data={solars} label="Saída Solar" unit="%" color={Colors.warning} />
        <LineChart data={consumptions} label="Consumo" unit=" W" color={Colors.info} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: { color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 8 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  gaugesCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, gap: 16 },
});

const gauge = StyleSheet.create({
  container: {},
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { color: Colors.textSecondary, fontSize: 12 },
  val: { fontSize: 13, fontWeight: '700' },
  track: { height: 10, backgroundColor: Colors.surfaceLight, borderRadius: 5, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
});
