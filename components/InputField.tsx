import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { ReactElement } from 'react';
import { colors } from '@/lib/theme';

export interface InputProps extends TextInputProps {
	label?: string;
	error?: string;
	containerStyle?: ViewStyle;
	leftIcon?: ReactElement;
	rightIcon?: ReactElement;
}

export function InputField({ label, error, containerStyle, leftIcon, rightIcon, ...props }: InputProps) {
	return (
		<View style={[styles.container, containerStyle]}>
			{label && <Text style={styles.label}>{label}</Text>}
			<View style={[styles.inputContainer, error && styles.inputError]}>
				{leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
				<TextInput
					style={[styles.input, leftIcon && styles.inputWithLeftIcon, rightIcon && styles.inputWithRightIcon]}
					placeholderTextColor={colors.text.secondary}
					{...props}
				/>
				{rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
			</View>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%'
	} as ViewStyle,
	label: {
		fontSize: 15,
		fontWeight: '500',
		marginBottom: 8,
		color: colors.text.primary
	} as TextStyle,
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: colors.border.default,
		borderRadius: 12,
		backgroundColor: '#fff'
	} as ViewStyle,
	iconContainer: {
		paddingLeft: 12,
		justifyContent: 'center',
		alignItems: 'center',
		height: 48,
		display: 'flex'
	} as ViewStyle,
	rightIconContainer: {
		paddingRight: 12,
		justifyContent: 'center',
		alignItems: 'center',
		height: 48,
		display: 'flex'
	} as ViewStyle,
	input: {
		flex: 1,
		height: 48,
		paddingHorizontal: 12,
		fontSize: 16,
		color: colors.text.primary
	} as TextStyle,
	inputWithLeftIcon: {
		paddingLeft: 8
	} as TextStyle,
	inputWithRightIcon: {
		paddingRight: 8
	} as TextStyle,
	inputError: {
		borderColor: colors.danger.light
	} as ViewStyle,
	errorText: {
		color: colors.danger.light,
		fontSize: 14,
		marginTop: 4
	} as TextStyle
});
