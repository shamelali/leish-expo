import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export interface TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  disabled?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  autoComplete?: 'email' | 'password' | 'off';
  testID?: string;
}

export function TextInputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  disabled = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  autoComplete = 'off',
  testID,
}: TextInputProps) {
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = error ? '#dc2626' : tintColor;

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText style={styles.label}>
          {label}
          {error && <ThemedText style={{ color: '#dc2626' }}> *</ThemedText>}
        </ThemedText>
      )}
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            backgroundColor,
            borderColor,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoComplete={autoComplete}
        testID={testID}
      />
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
});
