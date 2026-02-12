import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { TextInputField } from '@/components/ui/input';
import { SignupFormData, parseSignupForm } from '@/utils/validation';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function SignupForm({ onSubmit, loading = false, error }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setErrors({});
    try {
      const validData = parseSignupForm({
        name,
        email,
        password,
        confirmPassword,
      });
      await onSubmit(validData);
    } catch (err: any) {
      if (typeof err === 'object') {
        setErrors(err);
      } else {
        setErrors({ general: 'Signup failed' });
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
        label="Full Name"
        placeholder="John Doe"
        value={name}
        onChangeText={setName}
        error={errors.name}
        disabled={loading}
      />

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

      <TextInputField
        label="Confirm Password"
        placeholder="••••••••"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        error={errors.confirmPassword}
        disabled={loading}
      />

      <Button
        title={loading ? 'Creating Account...' : 'Sign Up'}
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
