import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { rootStore } from '../store/rootStore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, fetchFavorites } from '../store/features/addressSlice';
import type { RootState, AppDispatch } from '../store/rootStore';

function AppContent() {
	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		if (user?.id) {
			dispatch(fetchAddresses(user.id));
			dispatch(fetchFavorites(user.id));
		}
	}, [user?.id, dispatch]);

	return (
		<>
			<StatusBar style='dark' />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name='index' />
				<Stack.Screen name='tabs' />
				<Stack.Screen name='auth' />
				<Stack.Screen
					name='(modals)'
					options={{
						presentation: 'modal',
						animation: 'slide_from_bottom'
					}}
				/>
			</Stack>
		</>
	);
}

export default function RootLayout() {
	return (
		<Provider store={rootStore}>
			<AppContent />
		</Provider>
	);
}
