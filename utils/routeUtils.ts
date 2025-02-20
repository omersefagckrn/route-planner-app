import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export const checkFirstLaunch = async () => {
	try {
		const hasLaunched = await AsyncStorage.getItem('hasLaunched');
		if (hasLaunched === 'true') {
			router.replace('/tabs');
			return true;
		}
		return false;
	} catch (error) {
		console.error('Error checking first launch:', error);
		return false;
	}
};

export const setFirstLaunch = async () => {
	try {
		await AsyncStorage.setItem('hasLaunched', 'true');
		return true;
	} catch (error) {
		console.error('Error saving first launch:', error);
		return false;
	}
};
