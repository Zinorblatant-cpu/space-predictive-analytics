import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/common/Header';
import MetricCard from '../../components/cards/MetricCard';
import { Colors } from '../../constants/colors';
import { useAlerts } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';
import { useMission } from '../../context/MissionContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const { currentSensor, issPosition, settings } = useMission();
  const { unacknowledgedCount, alerts } = useAlerts();

  const tempStatus = currentSensor && currentSensor.temperature > settings.thresholds.temperatureMax
    ? 'critical' : currentSensor && currentSensor.temperature > settings.thresholds.temperatureMax * 0.85
    ? 'warning' : 'normal';

  const signalStatus = currentSensor && currentSensor.signalQuality < settings.thresholds.signalMin
    ? 'critical' : currentSensor && currentSensor.signalQuality < settings.thresholds.signalMin * 1.3
    ? 'warning' : 'normal';

  const criticalCount = alerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length;

  return (
    <View style={styles.screen}>
      <Header title={settings.missionName} subtitle="Dashboard Principal" showSettings />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Boas-vindas */}
        <View style={styles.welcome}>
          <Ionicons name="person-circle" size={36} color={Colors.primary} />
          <View>
            <Text style={styles.welcomeText}>Bem-vindo, {user?.name.split(' ')[0]}</Text>
            <Text style={styles.welcomeSub}>RM: {user?.rm}</Text>
          </View>
        </View>

        {/* Status geral da missão */}
        <View style={[styles.missionStatus, { borderColor: criticalCount > 0 ? Colors.critical : Colors.accent }]}>
          <Ionicons
            name={criticalCount > 0 ? 'warning' : 'checkmark-circle'}
            size={28}
            color={criticalCount > 0 ? Colors.critical : Colors.accent}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.missionStatusTitle}>
              {criticalCount > 0 ? `${criticalCount} Alertas Críticos` : 'Missão Operacional'}
            </Text>
            <Text style={styles.missionStatusSub}>
              {unacknowledgedCount > 0
                ? `${unacknowledgedCount} alerta(s) não reconhecido(s)`
                : 'Todos os sistemas normais'}
            </Text>
          </View>
        </View>

        {/* Cards de métricas */}
        <Text style={styles.sectionTitle}>Visão Geral dos Sistemas</Text>
        <View style={styles.row}>
          <MetricCard
            label="Temperatura"
            value={currentSensor ? `${currentSensor.temperature.toFixed(1)}°C` : '--'}
            icon="thermometer"
            status={tempStatus}
            subtext={`Limiar: ${settings.thresholds.temperatureMax}°C`}
          />
          <MetricCard
            label="Sinal"
            value={currentSensor ? `${currentSensor.signalQuality}%` : '--'}
            icon="wifi"
            status={signalStatus}
            subtext={`Limiar: ${settings.thresholds.signalMin}%`}
          />
        </View>
        <View style={styles.row}>
          <MetricCard
            label="Saúde Orbital"
            value={currentSensor ? `${currentSensor.rul}%` : '--'}
            icon="shield-checkmark"
            status={currentSensor && currentSensor.rul < settings.thresholds.rulMin ? 'critical' : 'normal'}
            subtext="RUL (Vida Útil Residual)"
          />
          <MetricCard
            label="Altitude"
            value={currentSensor ? `${currentSensor.altitude.toFixed(0)} km` : '--'}
            icon="rocket"
            status="normal"
            subtext="Órbita baixa"
          />
        </View>

        {/* Posição ISS */}
        <Text style={styles.sectionTitle}>Posição da ISS (Open Notify)</Text>
        <View style={styles.issCard}>
          <Ionicons name="location" size={20} color={Colors.info} />
          {issPosition ? (
            <View>
              <Text style={styles.issCoords}>
                {issPosition.latitude.toFixed(4)}°N, {issPosition.longitude.toFixed(4)}°E
              </Text>
              <Text style={styles.issTime}>
                Atualizado: {new Date(issPosition.timestamp).toLocaleTimeString('pt-BR')}
              </Text>
            </View>
          ) : (
            <Text style={styles.issWaiting}>Aguardando dados da ISS...</Text>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  welcome: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 16,
  },
  welcomeText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600' },
  welcomeSub: { color: Colors.textSecondary, fontSize: 12 },
  missionStatus: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1,
  },
  missionStatusTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
  missionStatusSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  sectionTitle: { color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 8 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  issCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginTop: 4,
  },
  issCoords: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  issTime: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  issWaiting: { color: Colors.textMuted, fontSize: 13 },
});
