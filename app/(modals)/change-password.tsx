import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updatePassword } from '../../store/features/authSlice';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ChangePasswordFormValues, ChangePasswordSchema } from '@/schemas/auth';

export default function ChangePasswordScreen() {
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state) => state.auth);

	const handleSubmit = async (values: ChangePasswordFormValues) => {
		dispatch(updatePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword }));
	};

	return (
		<View style={styles.container}>
			<LinearGradient colors={['#4C47DB', '#6366F1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
						<Ionicons name='arrow-back' size={24} color='#fff' />
					</TouchableOpacity>
					<View style={styles.headerTextContainer}>
						<Text style={styles.title}>Şifre Değiştir</Text>
						<Text style={styles.description}>Hesap güvenliğiniz için şifrenizi güncelleyin</Text>
					</View>
				</View>
			</LinearGradient>

			<LoadingOverlay visible={isLoading} message='Şifre değiştiriliyor...' />

			{error && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			)}

			<View style={styles.content}>
				<Formik
					initialValues={{
						currentPassword: '',
						newPassword: '',
						confirmNewPassword: ''
					}}
					validationSchema={ChangePasswordSchema}
					onSubmit={handleSubmit}
				>
					{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
						<View style={styles.form}>
							<View style={styles.inputGroup}>
								<Input
									label='Mevcut Şifre'
									placeholder='••••••'
									value={values.currentPassword}
									onChangeText={handleChange('currentPassword')}
									onBlur={handleBlur('currentPassword')}
									error={touched.currentPassword && errors.currentPassword}
									secureTextEntry
								/>

								<Input
									label='Yeni Şifre'
									placeholder='••••••'
									value={values.newPassword}
									onChangeText={handleChange('newPassword')}
									onBlur={handleBlur('newPassword')}
									error={touched.newPassword && errors.newPassword}
									secureTextEntry
								/>

								<Input
									label='Yeni Şifre Tekrarı'
									placeholder='••••••'
									value={values.confirmNewPassword}
									onChangeText={handleChange('confirmNewPassword')}
									onBlur={handleBlur('confirmNewPassword')}
									error={touched.confirmNewPassword && errors.confirmNewPassword}
									secureTextEntry
								/>
							</View>

							<View style={styles.buttonContainer}>
								<Button onPress={() => handleSubmit()} title='Şifreyi Güncelle' loading={isLoading} />
							</View>
						</View>
					)}
				</Formik>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	header: {
		paddingTop: Platform.OS === 'ios' ? 60 : 40,
		paddingBottom: 30,
		paddingHorizontal: 20,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		...Platform.select({
			ios: {
				shadowColor: '#6366F1',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.2,
				shadowRadius: 8
			},
			android: {
				elevation: 8
			}
		})
	},
	headerContent: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16
	},
	headerTextContainer: {
		flex: 1
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 8
	},
	description: {
		fontSize: 16,
		color: 'rgba(255, 255, 255, 0.9)',
		lineHeight: 22
	},
	content: {
		flex: 1,
		padding: 20
	},
	form: {
		flex: 1
	},
	inputGroup: {
		gap: 16
	},
	buttonContainer: {
		marginTop: 24
	},
	errorContainer: {
		backgroundColor: '#FEF2F2',
		padding: 16,
		marginHorizontal: 20,
		marginTop: 20,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#FEE2E2'
	},
	errorText: {
		color: '#DC2626',
		textAlign: 'center',
		fontSize: 14,
		lineHeight: 20
	}
});
