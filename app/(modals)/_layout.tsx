import { Stack } from 'expo-router';

export default function ModalLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: 'slide_from_bottom',
				contentStyle: { backgroundColor: 'transparent' }
			}}
		>
			<Stack.Screen name='index' />
			<Stack.Screen name='add-address' />
			<Stack.Screen name='edit-address' />
			<Stack.Screen name='edit-profile' />
			<Stack.Screen name='map-picker' />
			<Stack.Screen name='change-password' />
		</Stack>
	);
}
