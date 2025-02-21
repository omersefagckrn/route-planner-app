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
			<MaskInput
				style={[styles.input, error && styles.inputError, style]}
				placeholderTextColor={colors.text.secondary}
				onChangeText={(masked) => onChangeText(masked)}
				mask={mask}
				{...props}
			/>
			{typeof error === 'string' && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 8
	},
	label: {
		fontSize: 13,
		fontWeight: '500',
		color: colors.text.secondary,
		marginBottom: 6,
		marginLeft: 2
	},
	input: {
		height: 44,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: 10,
		paddingHorizontal: 14,
		fontSize: 14,
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
		fontSize: 11,
		marginTop: 4,
		marginLeft: 2
	}
});
