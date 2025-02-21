import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '../lib/theme';

const { width } = Dimensions.get('window');

interface CustomAlertProps {
	visible: boolean;
	title: string;
	message: string;
	buttons: {
		text: string;
		icon?: string;
		style?: 'default' | 'cancel' | 'primary';
		onPress: () => void;
	}[];
	onClose: () => void;
}

export function CustomAlert({ visible, title, message, buttons, onClose }: CustomAlertProps) {
	return (
		<Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
			<View style={styles.overlay}>
				<View style={styles.alertContainer}>
					<LinearGradient colors={['#1A1A1A', '#2A2A2A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
						<Text style={styles.title}>{title}</Text>
						<Text style={styles.message}>{message}</Text>

						<View style={styles.buttonContainer}>
							{buttons.map((button, index) => (
								<TouchableOpacity
									key={index}
									style={[
										styles.button,
										button.style === 'cancel' && styles.cancelButton,
										button.style === 'primary' && styles.primaryButton,
										index === 0 && styles.firstButton,
										index === buttons.length - 1 && styles.lastButton
									]}
									onPress={() => {
										button.onPress();
										onClose();
									}}
								>
									{button.icon && (
										<Ionicons
											name={button.icon as any}
											size={20}
											color={button.style === 'cancel' ? '#1A1A1A' : '#FFFFFF'}
											style={styles.buttonIcon}
										/>
									)}
									<Text style={[styles.buttonText, button.style === 'cancel' && styles.cancelButtonText]}>{button.text}</Text>
								</TouchableOpacity>
							))}
						</View>
					</LinearGradient>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	alertContainer: {
		width: width * 0.85,
		maxWidth: 400,
		borderRadius: 24,
		overflow: 'hidden',
		...shadows.large
	},
	gradient: {
		padding: 24
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
		color: '#FFFFFF',
		marginBottom: 8,
		textAlign: 'center'
	},
	message: {
		fontSize: 16,
		color: 'rgba(255, 255, 255, 0.8)',
		marginBottom: 24,
		textAlign: 'center',
		lineHeight: 22
	},
	buttonContainer: {
		gap: 12
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 12,
		backgroundColor: 'rgba(255, 255, 255, 0.1)'
	},
	buttonIcon: {
		marginRight: 8
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF'
	},
	cancelButton: {
		backgroundColor: '#FFFFFF'
	},
	cancelButtonText: {
		color: '#1A1A1A'
	},
	primaryButton: {
		backgroundColor: colors.primary.light
	},
	firstButton: {
		marginTop: 8
	},
	lastButton: {
		marginBottom: 8
	}
});
