import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/common/Header';
import LineChart from '../../components/charts/LineChart';
import MetricCard from '../../components/cards/MetricCard';
import { Colors } from '../../constants/colors';
import { useMission } from '../../context/MissionContext';

export default function CommunicationScreen() {
  const { currentSensor, communicationHistory, issPosition, settings } = useMission();

  const signals = communicationHistory.map((c) => c.signalQuality);
  const latencies = communicationHistory.map((c) => c.latency);
  const dataRates = communicationHistory.map((c) => c.dataRate);

  const latest = communicationHistory[communicationHistory.length - 1];
  const linkStatus = latest?.linkStatus ?? 'stable';
  const linkColor = linkStatus === 'stable' ? Colors.accent : linkStatus === 'degraded' ? Colors.warning : Colors.critical;
  const linkIcon = linkStatus === 'stable' ? 'checkmark-circle' : linkStatus === 'degraded' ? 'alert-circle' : 'close-circle';

  const signalStatus = currentSensor && currentSensor.signalQuality < settings.thresholds.signalMin ? 'critical'
    : currentSensor && currentSensor.signalQuality < settings.thresholds.signalMin * 1.3 ? 'warning' : 'normal';

  return (
    <View style={styles.screen}>
      <Header title="Comunicação" subtitle="Telemetria e rastreamento ISS" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Status do link */}
        <View style={[styles.linkCard, { borderColor: linkColor }]}>
          <Ionicons name={linkIcon} size={28} color={linkColor} />
          <View>
            <Text style={styles.linkTitle}>Link de Telemetria</Text>
            <Text style={[styles.linkStatus, { color: linkColor }]}>
              {linkStatus === 'stable' ? 'ESTÁVEL' : linkStatus === 'degraded' ? 'DEGRADADO' : 'PERDIDO'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Métricas de Comunicação</Text>
        <View style={styles.row}>
          <MetricCard label="Qualidade" value={currentSensor ? `${currentSensor.signalQuality}%` : '--'} icon="wifi" status={signalStatus} />
          <MetricCard label="Latência" value={latest ? `${latest.latency} ms` : '--'} icon="timer" status={latest && latest.latency > 2000 ? 'warning' : 'normal'} />
        </View>
        <View style={styles.row}>
          <MetricCard label="Taxa de Dados" value={latest ? `${latest.dataRate.toFixed(1)} Mbps` : '--'} icon="analytics" status="normal" />
          <MetricCard label="Frequência" value="S-Band" icon="radio" status="normal" subtext="2.0–4.0 GHz" />
        </View>

        {/* ISS */}
        <Text style={styles.sectionTitle}>Rastreamento ISS (Open Notify API)</Text>
        <View style={styles.issCard}>
          <Ionicons name="location" size={22} color={Colors.info} style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            {issPosition ? (
              <>
                <Text style={styles.issLabel}>Posição Atual</Text>
                <Text style={styles.issCoords}>
                  Lat: {issPosition.latitude.toFixed(4)}°{'\n'}
                  Lon: {issPosition.longitude.toFixed(4)}°
                </Text>
                <Text style={styles.issTime}>
                  Última atualização: {new Date(issPosition.timestamp).toLocaleTimeString('pt-BR')}
                </Text>
              </>
            ) : (
              <Text style={styles.issWaiting}>Conectando à API Open Notify...</Text>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Histórico</Text>
        <LineChart data={signals} label="Qualidade do Sinal" unit="%" color={Colors.accent} />
        <LineChart data={latencies} label="Latência" unit=" ms" color={Colors.warning} />
        <LineChart data={dataRates} label="Taxa de Dados" unit=" Mbps" color={Colors.info} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: { color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 8 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  linkCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1,
  },
  linkTitle: { color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  linkStatus: { fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  issCard: {
    flexDirection: 'row', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginBottom: 12,
  },
  issLabel: { color: Colors.textSecondary, fontSize: 11, textTransform: 'uppercase', marginBottom: 4 },
  issCoords: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600', lineHeight: 22 },
  issTime: { color: Colors.textMuted, fontSize: 11, marginTop: 4 },
  issWaiting: { color: Colors.textMuted, fontSize: 13, marginTop: 4 },
});
