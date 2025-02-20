import React from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, shadows } from '../lib/theme';

interface LoadingOverlayProps {
	visible: boolean;
	message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message = 'Yükleniyor...' }) => {
	const spinValue = React.useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		if (visible) {
			Animated.loop(
				Animated.timing(spinValue, {
					toValue: 1,
					duration: 1500,
					easing: Easing.linear,
					useNativeDriver: true
				})
			).start();
		}
	}, [visible]);

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg']
	});

	if (!visible) return null;

	return (
		<View style={styles.container}>
			<LinearGradient colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.97)']} style={styles.content}>
				<View style={styles.iconContainer}>
					<LinearGradient colors={gradients.primary as [string, string, ...string[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.iconBackground}>
						<Animated.View style={{ transform: [{ rotate: spin }] }}>
							<Ionicons name='sync' size={32} color='#fff' />
						</Animated.View>
					</LinearGradient>
				</View>
				<Text style={styles.message}>{message}</Text>
			</LinearGradient>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 999,
		backdropFilter: 'blur(5px)'
	},
	content: {
		padding: 24,
		borderRadius: 20,
		minWidth: 180,
		alignItems: 'center',
		...shadows.large
	},
	iconContainer: {
		marginBottom: 16
	},
	iconBackground: {
		width: 64,
		height: 64,
		borderRadius: 32,
		justifyContent: 'center',
		alignItems: 'center',
		...shadows.medium
	},
	message: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.text.primary,
		textAlign: 'center'
	}
});
