import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextInputField } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/hooks/use-auth';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileEditScreen() {
  const { user, isLoading } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    setErrors({});
    if (!name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Call API to update profile
      // await apiService.put('/user/profile', { name });
      // Show success toast
      console.log('Profile updated:', { name });
    } catch (error: any) {
      setErrors({ general: error?.message || 'Failed to save profile' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader message="Loading profile..." />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 16 }}>
        <ThemedView style={styles.container}>
          <Card>
            <ThemedText type="subtitle">Profile Information</ThemedText>
            <TextInputField
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              disabled={isSaving}
            />
            <TextInputField
              label="Email"
              value={user?.email || ''}
              onChangeText={() => {}}
              disabled
            />
          </Card>

          {errors.general && (
            <View style={styles.errorBanner}>
              <ThemedText style={styles.errorText}>{errors.general}</ThemedText>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title={isSaving ? 'Saving...' : 'Save Changes'}
              onPress={handleSave}
              loading={isSaving}
              disabled={isSaving}
            />
          </View>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
  },
  buttonContainer: {
    gap: 8,
  },
});
