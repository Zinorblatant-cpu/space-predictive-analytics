import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
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

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'E-mail obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'E-mail inválido.';
    if (!password) e.password = 'Senha obrigatória.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    const result = await login(email.trim(), password);
    if (!result.success) {
      setErrors({ general: result.error });
    } else {
      router.replace('/(tabs)');
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logo}>
          <Ionicons name="planet" size={64} color={Colors.primary} />
          <Text style={styles.appName}>Space Predictive</Text>
          <Text style={styles.appSub}>Analytics</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Acesso à Missão</Text>

          {errors.general ? <Text style={styles.errorBox}>{errors.general}</Text> : null}

          <Text style={styles.inputLabel}>E-mail</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            placeholder="astronauta@fiap.com.br"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <Text style={styles.inputLabel}>Senha</Text>
          <View style={[styles.passRow, errors.password && styles.inputError]}>
            <TextInput
              style={styles.passInput}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPass}
              autoComplete="password"
            />
            <Pressable onPress={() => setShowPass((v) => !v)} style={styles.eyeBtn}>
              <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color={Colors.textSecondary} />
            </Pressable>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <Pressable style={styles.btn} onPress={handleLogin} disabled={isLoading}>
            {isLoading
              ? <ActivityIndicator color={Colors.textPrimary} />
              : <Text style={styles.btnText}>Entrar</Text>}
          </Pressable>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Novo astronauta? </Text>
            <Link href="/(auth)/register" style={styles.registerLink}>Cadastrar</Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: 24, justifyContent: 'center' },
  logo: { alignItems: 'center', marginBottom: 40 },
  appName: { color: Colors.textPrimary, fontSize: 28, fontWeight: '800', marginTop: 8 },
  appSub: { color: Colors.primary, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase' },
  form: { backgroundColor: Colors.surface, borderRadius: 16, padding: 24 },
  title: { color: Colors.textPrimary, fontSize: 22, fontWeight: '700', marginBottom: 20 },
  inputLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: Colors.surfaceLight, borderRadius: 10, padding: 14, color: Colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: Colors.border },
  inputError: { borderColor: Colors.critical },
  passRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceLight, borderRadius: 10, borderWidth: 1, borderColor: Colors.border },
  passInput: { flex: 1, padding: 14, color: Colors.textPrimary, fontSize: 15 },
  eyeBtn: { padding: 12 },
  errorText: { color: Colors.critical, fontSize: 12, marginTop: 4 },
  errorBox: { backgroundColor: '#7F1D1D', padding: 10, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  btnText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  registerText: { color: Colors.textSecondary, fontSize: 14 },
  registerLink: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
});
