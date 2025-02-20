import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
	return (
		<View style={{ flex: 1, backgroundColor: '#6366F1' }}>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: '#fff' }
				}}
			>
				<Stack.Screen name='login' />
				<Stack.Screen name='register' />
			</Stack>
		</View>
	);
}
