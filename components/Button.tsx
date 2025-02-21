import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacityProps } from 'react-native';
import { colors, shadows } from '../lib/theme';

interface ButtonProps extends TouchableOpacityProps {
	title: string;
	loading?: boolean;
	variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ title, loading, variant = 'primary', style, disabled, onPress, ...props }) => {
	return (
		<TouchableOpacity style={[styles.button, styles[variant], disabled && styles.disabled, style]} disabled={disabled || loading} activeOpacity={0.8} onPress={onPress} {...props}>
			{loading ? <ActivityIndicator color='#fff' size='small' /> : <Text style={[styles.title, variant === 'secondary' && styles.secondaryTitle]}>{title}</Text>}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: 12,
		overflow: 'hidden',
		paddingVertical: 14,
		alignItems: 'center',
		justifyContent: 'center',
		...shadows.medium
	},
	primary: {
		backgroundColor: colors.primary.dark
	},
	secondary: {
		backgroundColor: colors.primary.light,
		borderWidth: 1,
		borderColor: colors.border.default
	},
	title: {
		color: colors.text.primary,
		fontSize: 15,
		fontWeight: '600'
	},
	secondaryTitle: {
		color: colors.text.primary
	},
	disabled: {
		opacity: 0.7
	}
});
