import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import React, { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

export interface ModalProps {
  visible: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  actionButtons?: {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
  closeButton?: boolean;
}

export function ModalDialog({
  visible,
  title,
  children,
  onClose,
  actionButtons,
  closeButton = true,
}: ModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <ThemedView style={styles.modal}>
          {title && (
            <View style={styles.header}>
              <ThemedText type="subtitle">{title}</ThemedText>
            </View>
          )}
          <View style={styles.content}>{children}</View>
          <View style={styles.footer}>
            {actionButtons?.map((btn, idx) => (
              <Button
                key={idx}
                title={btn.title}
                onPress={btn.onPress}
                variant={btn.variant || 'primary'}
                size="medium"
              />
            ))}
            {closeButton && (
              <Button
                title="Close"
                onPress={onClose}
                variant="secondary"
                size="medium"
              />
            )}
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    borderRadius: 12,
    padding: 20,
    maxWidth: 400,
    width: '100%',
  },
  header: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    marginVertical: 16,
  },
  footer: {
    gap: 8,
    marginTop: 16,
  },
});
