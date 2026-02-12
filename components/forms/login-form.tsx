import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { TextInputField } from '@/components/ui/input';
import { LoginFormData, parseLoginForm } from '@/utils/validation';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, loading = false, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setErrors({});
    try {
      const validData = parseLoginForm({ email, password });
      await onSubmit(validData);
    } catch (err: any) {
      if (typeof err === 'object') {
        setErrors(err);
      } else {
        setErrors({ general: 'Login failed' });
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      {error && (
        <View style={styles.errorBanner}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      <TextInputField
        label="Email"
        placeholder="example@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        error={errors.email}
        disabled={loading}
      />

      <TextInputField
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        error={errors.password}
        disabled={loading}
      />

      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
  },
});
