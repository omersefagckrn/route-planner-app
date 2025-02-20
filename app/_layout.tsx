import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import { checkFirstLaunch } from '../utils/routeUtils';

export default function Layout() {
	useEffect(() => {
		checkFirstLaunch();
	}, []);

	return (
		<Provider store={store}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name='index' />
				<Stack.Screen name='tabs' />
				<Stack.Screen name='auth' options={{ presentation: 'modal' }} />
				<Stack.Screen name='(modals)/edit-profile' options={{ presentation: 'modal' }} />
				<Stack.Screen name='(modals)/change-password' options={{ presentation: 'modal' }} />
			</Stack>
			<Toast />
		</Provider>
	);
}
