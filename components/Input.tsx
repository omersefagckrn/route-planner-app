import React from 'react';
import { View, Text, StyleSheet, TextInputProps } from 'react-native';
import MaskInput, { Mask } from 'react-native-mask-input';
import { colors, shadows } from '../lib/theme';

interface InputProps extends Omit<TextInputProps, 'onChangeText'> {
	error?: string | boolean;
	mask?: Mask;
	onChangeText: (text: string) => void;
	label?: string;
}

export const Input: React.FC<InputProps> = ({ error, style, mask, onChangeText, label, ...props }) => {
	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			{mask ? (
				<MaskInput
					style={[styles.input, error && styles.inputError, style]}
					placeholderTextColor={colors.text.secondary}
					mask={mask}
					textContentType={'oneTimeCode'}
					onChangeText={(masked, unmasked) => {
						onChangeText(masked);
					}}
					{...props}
				/>
			) : (
				<MaskInput
					style={[styles.input, error && styles.inputError, style]}
					placeholderTextColor={colors.text.secondary}
					onChangeText={(masked) => onChangeText(masked)}
					textContentType={'oneTimeCode'}
					{...props}
				/>
			)}
			{typeof error === 'string' && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 8
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: colors.text.secondary,
		marginBottom: 6,
		marginLeft: 4
	},
	input: {
		height: 48,
		backgroundColor: colors.background.primary,
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: 12,
		paddingHorizontal: 16,
		fontSize: 15,
		color: colors.text.primary,
		...shadows.small
	},
	inputError: {
		borderColor: colors.border.error,
		borderWidth: 1.5,
		backgroundColor: colors.background.error
	},
	errorText: {
		color: colors.text.error,
		fontSize: 12,
		marginTop: 4,
		marginLeft: 4
	}
});
