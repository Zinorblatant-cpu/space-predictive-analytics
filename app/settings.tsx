import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert as RNAlert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Header from '../components/common/Header';
import { Colors } from '../constants/colors';
import { useMission } from '../context/MissionContext';
import { useAuth } from '../context/AuthContext';
import { MissionSettings } from '../types';

type FormErrors = Partial<Record<string, string>>;

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  placeholder?: string;
}

function InputField({ label, value, onChangeText, error, keyboardType = 'default', placeholder = '' }: InputFieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.textMuted}
        placeholder={placeholder}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, updateSettings } = useMission();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<MissionSettings>({ ...settings, thresholds: { ...settings.thresholds } });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);

  function setField(key: keyof MissionSettings, val: unknown) {
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  }

  function setThreshold(key: keyof MissionSettings['thresholds'], val: string) {
    const n = parseFloat(val);
    setForm((f) => ({ ...f, thresholds: { ...f.thresholds, [key]: isNaN(n) ? 0 : n } }));
    setSaved(false);
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.missionName.trim()) e.missionName = 'Nome da missão obrigatório.';
    if (form.refreshInterval < 1 || form.refreshInterval > 60) e.refreshInterval = 'Intervalo: 1–60 segundos.';
    if (form.thresholds.temperatureMax < 30 || form.thresholds.temperatureMax > 100) e.tempMax = 'Temperatura: 30–100°C.';
    if (form.thresholds.pressureMax < 1 || form.thresholds.pressureMax > 2) e.pressMax = 'Pressão: 1.0–2.0 atm.';
    if (form.thresholds.vibrationMax < 1 || form.thresholds.vibrationMax > 10) e.vibMax = 'Vibração: 1–10 m/s².';
    if (form.thresholds.batteryMin < 5 || form.thresholds.batteryMin > 50) e.batMin = 'Bateria mínima: 5–50%.';
    if (form.thresholds.signalMin < 5 || form.thresholds.signalMin > 80) e.sigMin = 'Sinal mínimo: 5–80%.';
    if (form.thresholds.rulMin < 5 || form.thresholds.rulMin > 50) e.rulMin = 'RUL mínimo: 5–50%.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    await updateSettings(form);
    setSaved(true);
    setTimeout(() => router.back(), 800);
  }

  async function handleLogout() {
    if (Platform.OS === 'web') {
      if (window.confirm('Confirmar logout da missão?')) {
        await logout();
        router.replace('/(auth)/login');
      }
      return;
    }
    RNAlert.alert('Sair', 'Confirmar logout da missão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive',
        onPress: async () => { await logout(); router.replace('/(auth)/login'); },
      },
    ]);
  }

  return (
    <View style={styles.screen}>
      <Header title="Configurações" showBack />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <Text style={styles.sectionTitle}>Missão</Text>
          <View style={styles.card}>
            <InputField
              label="Nome da Missão"
              value={form.missionName}
              onChangeText={(v) => setField('missionName', v)}
              error={errors.missionName}
              placeholder="Missão Orbital Alpha"
            />
            <InputField
              label="Intervalo de Atualização (segundos)"
              value={String(form.refreshInterval)}
              onChangeText={(v) => setField('refreshInterval', parseInt(v) || 5)}
              error={errors.refreshInterval}
              keyboardType="numeric"
              placeholder="5"
            />
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Notificações Push</Text>
              <Switch
                value={Boolean(form.notificationsEnabled)}
                onValueChange={(v) => setField('notificationsEnabled', v)}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.textPrimary}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Limiares de Alerta</Text>
          <View style={styles.card}>
            <InputField label="Temperatura Máxima (°C)" value={String(form.thresholds.temperatureMax)}
              onChangeText={(v) => setThreshold('temperatureMax', v)} error={errors.tempMax} keyboardType="numeric" />
            <InputField label="Pressão Máxima (atm)" value={String(form.thresholds.pressureMax)}
              onChangeText={(v) => setThreshold('pressureMax', v)} error={errors.pressMax} keyboardType="decimal-pad" />
            <InputField label="Vibração Máxima (m/s²)" value={String(form.thresholds.vibrationMax)}
              onChangeText={(v) => setThreshold('vibrationMax', v)} error={errors.vibMax} keyboardType="decimal-pad" />
            <InputField label="Bateria Mínima (%)" value={String(form.thresholds.batteryMin)}
              onChangeText={(v) => setThreshold('batteryMin', v)} error={errors.batMin} keyboardType="numeric" />
            <InputField label="Sinal Mínimo (%)" value={String(form.thresholds.signalMin)}
              onChangeText={(v) => setThreshold('signalMin', v)} error={errors.sigMin} keyboardType="numeric" />
            <InputField label="RUL Mínimo (%)" value={String(form.thresholds.rulMin)}
              onChangeText={(v) => setThreshold('rulMin', v)} error={errors.rulMin} keyboardType="numeric" />
          </View>

          <Text style={styles.sectionTitle}>Astronauta</Text>
          <View style={styles.card}>
            <View style={styles.userRow}>
              <Ionicons name="person-circle" size={40} color={Colors.primary} />
              <View>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>
          </View>

          <Pressable style={[styles.saveBtn, saved && { backgroundColor: Colors.accent }]} onPress={handleSave}>
            <Ionicons name={saved ? 'checkmark' : 'save'} size={18} color={Colors.textPrimary} />
            <Text style={styles.saveBtnText}>{saved ? 'Salvo!' : 'Salvar Configurações'}</Text>
          </Pressable>

          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out" size={18} color={Colors.critical} />
            <Text style={styles.logoutText}>Sair da Missão</Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: { color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  card: { backgroundColor: Colors.surface, borderRadius: 12, padding: 16, gap: 4 },
  fieldWrap: { marginBottom: 4 },
  inputLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 6, marginTop: 8 },
  input: { backgroundColor: Colors.surfaceLight, borderRadius: 10, padding: 12, color: Colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: Colors.border },
  inputError: { borderColor: Colors.critical },
  errorText: { color: Colors.critical, fontSize: 12, marginTop: 4 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, marginTop: 4 },
  switchLabel: { color: Colors.textPrimary, fontSize: 15 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  userName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600' },
  userEmail: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: 12, padding: 16, marginTop: 24 },
  saveBtnText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, marginTop: 8, borderRadius: 12, borderWidth: 1, borderColor: Colors.critical },
  logoutText: { color: Colors.critical, fontSize: 15, fontWeight: '600' },
});
