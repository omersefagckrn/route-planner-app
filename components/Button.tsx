import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, shadows } from '../lib/theme';

interface ButtonProps extends TouchableOpacityProps {
	title: string;
	loading?: boolean;
	variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ title, loading, variant = 'primary', style, disabled, onPress, ...props }) => {
	return (
		<TouchableOpacity style={[styles.button, disabled && styles.disabled, style]} disabled={disabled || loading} activeOpacity={0.8} onPress={onPress} {...props}>
			<LinearGradient colors={gradients[variant] as [string, string, ...string[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
				{loading ? <ActivityIndicator color='#fff' size='small' /> : <Text style={styles.title}>{title}</Text>}
			</LinearGradient>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: 12,
		overflow: 'hidden',
		...shadows.medium
	},
	gradient: {
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600'
	},
	disabled: {
		opacity: 0.7
	}
});
