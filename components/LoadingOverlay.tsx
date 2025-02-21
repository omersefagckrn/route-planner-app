import React from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../lib/theme';

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
			<View style={styles.content}>
				<View style={styles.iconContainer}>
					<View style={styles.iconBackground}>
						<Animated.View style={{ transform: [{ rotate: spin }] }}>
							<Ionicons name='sync' size={28} color={colors.primary.dark} />
						</Animated.View>
					</View>
				</View>
				<Text style={styles.message}>{message}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 999,
		backgroundColor: 'rgba(255, 255, 255, 0.95)'
	},
	content: {
		padding: 20,
		borderRadius: 16,
		minWidth: 160,
		alignItems: 'center',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: colors.border.default,
		...shadows.medium
	},
	iconContainer: {
		marginBottom: 14
	},
	iconBackground: {
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background.primary,
		borderWidth: 1,
		borderColor: colors.border.default
	},
	message: {
		fontSize: 14,
		fontWeight: '500',
		color: colors.text.primary,
		textAlign: 'center'
	}
});
