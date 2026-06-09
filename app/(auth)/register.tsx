import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

interface Fields {
  name: string;
  email: string;
  rm: string;
  password: string;
  confirm: string;
}

type Errors = Partial<Record<keyof Fields | 'general', string>>;

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const [fields, setFields] = useState<Fields>({ name: '', email: '', rm: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function set(key: keyof Fields) {
    return (val: string) => setFields((f) => ({ ...f, [key]: val }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!fields.name.trim()) e.name = 'Nome obrigatório.';
    else if (fields.name.trim().split(' ').length < 2) e.name = 'Informe nome e sobrenome.';
    if (!fields.email.trim()) e.email = 'E-mail obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'E-mail inválido.';
    if (!fields.rm.trim()) e.rm = 'RM obrigatório.';
    else if (!/^RM\d{6}$/i.test(fields.rm.trim())) e.rm = 'Formato esperado: RM123456';
    if (!fields.password) e.password = 'Senha obrigatória.';
    else if (fields.password.length < 6) e.password = 'Mínimo 6 caracteres.';
    if (fields.confirm !== fields.password) e.confirm = 'Senhas não coincidem.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    const result = await register({ name: fields.name, email: fields.email, rm: fields.rm, password: fields.password });
    if (!result.success) setErrors({ general: result.error });
    else router.replace('/(tabs)');
  }

  const Field = ({ label, fkey, placeholder, keyboardType = 'default', secure = false }: {
    label: string; fkey: keyof Fields; placeholder: string;
    keyboardType?: 'default' | 'email-address'; secure?: boolean;
  }) => (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.passRow, errors[fkey] && styles.inputError]}>
        <TextInput
          style={styles.passInput}
          value={fields[fkey]}
          onChangeText={set(fkey)}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          keyboardType={keyboardType}
          autoCapitalize="none"
          secureTextEntry={secure && !showPass}
        />
        {(fkey === 'password' || fkey === 'confirm') && (
          <Pressable onPress={() => setShowPass((v) => !v)} style={styles.eyeBtn}>
            <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color={Colors.textSecondary} />
          </Pressable>
        )}
      </View>
      {errors[fkey] ? <Text style={styles.errorText}>{errors[fkey]}</Text> : null}
    </>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.topTitle}>Novo Astronauta</Text>
        </View>

        <View style={styles.form}>
          {errors.general ? <Text style={styles.errorBox}>{errors.general}</Text> : null}
          <Field label="Nome Completo" fkey="name" placeholder="João Silva" />
          <Field label="E-mail" fkey="email" placeholder="joao@fiap.com.br" keyboardType="email-address" />
          <Field label="RM (ex: RM123456)" fkey="rm" placeholder="RM123456" />
          <Field label="Senha" fkey="password" placeholder="••••••••" secure />
          <Field label="Confirmar Senha" fkey="confirm" placeholder="••••••••" secure />

          <Pressable style={styles.btn} onPress={handleRegister} disabled={isLoading}>
            {isLoading
              ? <ActivityIndicator color={Colors.textPrimary} />
              : <Text style={styles.btnText}>Criar Conta</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: 24 },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 8 },
  backBtn: { padding: 4 },
  topTitle: { color: Colors.textPrimary, fontSize: 20, fontWeight: '700' },
  form: { backgroundColor: Colors.surface, borderRadius: 16, padding: 24 },
  inputLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 6, marginTop: 12 },
  passRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceLight, borderRadius: 10, borderWidth: 1, borderColor: Colors.border },
  passInput: { flex: 1, padding: 14, color: Colors.textPrimary, fontSize: 15 },
  eyeBtn: { padding: 12 },
  inputError: { borderColor: Colors.critical },
  errorText: { color: Colors.critical, fontSize: 12, marginTop: 4 },
  errorBox: { backgroundColor: '#7F1D1D', padding: 10, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  btnText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
});
