import { SignupForm } from '@/components/forms/signup-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { SignupFormData } from '@/utils/validation';
import { Link, Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function SignupScreen() {
  const { signup, isLoading, error, clearError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSignup = async (data: SignupFormData) => {
    setFormError(null);
    clearError();
    try {
      await signup(data.email, data.password, data.name);
      // Navigation will be handled by root layout based on auth state
    } catch (err: any) {
      const message = err?.message || 'Signup failed. Please try again.';
      setFormError(message);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign Up',
          headerShown: false,
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.container}>
          <View style={styles.headerContainer}>
            <ThemedText type="title" style={styles.title}>
              Create Account
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Join us and get started today
            </ThemedText>
          </View>

          <SignupForm
            onSubmit={handleSignup}
            loading={isLoading}
            error={formError || error || ''}
          />

          <View style={styles.divider} />

          <View style={styles.footerContainer}>
            <ThemedText style={styles.footerText}>
              Already have an account?{' '}
            </ThemedText>
            <Link href="/auth/login" asChild>
              <ThemedText type="link" style={styles.link}>
                Login here
              </ThemedText>
            </Link>
          </View>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 24,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
});
