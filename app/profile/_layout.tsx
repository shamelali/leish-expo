import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Profile',
      }}
    >
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
        }}
      />
    </Stack>
  );
}
