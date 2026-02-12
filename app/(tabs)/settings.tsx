import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  const textColor = useThemeColor({}, 'text');
  const { logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 16 }}>
        <ThemedView style={styles.container}>
          {/* Account Settings */}
          <View>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Account
            </ThemedText>
            <Card>
              <Link href="/profile/edit" asChild>
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Feather name="user" size={24} color={textColor} />
                    <View>
                      <ThemedText style={styles.settingTitle}>Edit Profile</ThemedText>
                      <ThemedText style={styles.settingSubtitle}>
                        Update your information
                      </ThemedText>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={20} color={textColor} />
                </View>
              </Link>
            </Card>
          </View>

          {/* Preferences */}
          <View>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Preferences
            </ThemedText>
            <Card>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Feather name="moon" size={24} color={textColor} />
                  <View>
                    <ThemedText style={styles.settingTitle}>Theme</ThemedText>
                    <ThemedText style={styles.settingSubtitle}>Light, Dark, Auto</ThemedText>
                  </View>
                </View>
                <ThemedText style={{ opacity: 0.6, fontSize: 14 }}>Auto</ThemedText>
              </View>
            </Card>
            <Card>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Feather name="globe" size={24} color={textColor} />
                  <View>
                    <ThemedText style={styles.settingTitle}>Language</ThemedText>
                    <ThemedText style={styles.settingSubtitle}>English</ThemedText>
                  </View>
                </View>
                <ThemedText style={{ opacity: 0.6, fontSize: 14 }}>English</ThemedText>
              </View>
            </Card>
          </View>

          {/* Support */}
          <View>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Support & About
            </ThemedText>
            <Card>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Feather name="help-circle" size={24} color={textColor} />
                  <View>
                    <ThemedText style={styles.settingTitle}>Help & Feedback</ThemedText>
                    <ThemedText style={styles.settingSubtitle}>
                      Get help or send feedback
                    </ThemedText>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color={textColor} />
              </View>
            </Card>
            <Card>
              <View style={styles.versionItem}>
                <ThemedText>App Version</ThemedText>
                <ThemedText style={{ opacity: 0.6 }}>1.0.0</ThemedText>
              </View>
            </Card>
          </View>

          {/* Logout */}
          <View style={styles.logoutSection}>
            <Button
              title={isLoading ? 'Logging out...' : 'Logout'}
              onPress={handleLogout}
              loading={isLoading}
              disabled={isLoading}
              variant="danger"
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
    gap: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  versionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutSection: {
    marginTop: 20,
  },
});
