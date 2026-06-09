import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/common/Header';
import LineChart from '../../components/charts/LineChart';
import MetricCard from '../../components/cards/MetricCard';
import { Colors } from '../../constants/colors';
import { useMission } from '../../context/MissionContext';

export default function SensorsScreen() {
  const { currentSensor, sensorHistory, settings } = useMission();

  const temps = sensorHistory.map((s) => s.temperature);
  const pressures = sensorHistory.map((s) => s.pressure);
  const vibrations = sensorHistory.map((s) => s.vibration);
  const humidity = sensorHistory.map((s) => s.humidity);

  const tStatus = currentSensor && currentSensor.temperature > settings.thresholds.temperatureMax ? 'critical'
    : currentSensor && currentSensor.temperature > settings.thresholds.temperatureMax * 0.85 ? 'warning' : 'normal';
  const pStatus = currentSensor && currentSensor.pressure > settings.thresholds.pressureMax ? 'critical' : 'normal';
  const vStatus = currentSensor && currentSensor.vibration > settings.thresholds.vibrationMax ? 'critical'
    : currentSensor && currentSensor.vibration > settings.thresholds.vibrationMax * 0.85 ? 'warning' : 'normal';

  return (
    <View style={styles.screen}>
      <Header title="Sensores" subtitle="Dados em tempo real simulado" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>Valores Atuais</Text>
        <View style={styles.row}>
          <MetricCard label="Temperatura" value={currentSensor ? `${currentSensor.temperature.toFixed(1)}°C` : '--'} icon="thermometer" status={tStatus} />
          <MetricCard label="Pressão" value={currentSensor ? `${currentSensor.pressure.toFixed(3)} atm` : '--'} icon="speedometer" status={pStatus} />
        </View>
        <View style={styles.row}>
          <MetricCard label="Vibração" value={currentSensor ? `${currentSensor.vibration.toFixed(2)} m/s²` : '--'} icon="layers" status={vStatus} />
          <MetricCard label="Umidade" value={currentSensor ? `${currentSensor.humidity}%` : '--'} icon="water" status="normal" />
        </View>

        <Text style={styles.sectionTitle}>Histórico (últimas {sensorHistory.length} leituras)</Text>
        <LineChart data={temps} label="Temperatura" unit="°C" color={Colors.danger} />
        <LineChart data={pressures} label="Pressão" unit=" atm" color={Colors.info} />
        <LineChart data={vibrations} label="Vibração" unit=" m/s²" color={Colors.warning} />
        <LineChart data={humidity} label="Umidade" unit="%" color={Colors.accent} />

        <Text style={styles.dataSource}>
          Dados derivados do dataset C-MAPSS NASA FD001 com jitter simulado
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: { color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 8 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  dataSource: { color: Colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 16 },
});
