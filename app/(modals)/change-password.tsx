import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { supabase } from '../../lib/supabase';
import { changePassword } from '../../store/features/authSlice';
import { OverlayLoading } from '../../components/OverlayLoading';
import { InputField } from '../../components/InputField';
import type { RootState, AppDispatch } from '@/store/rootStore';
import { ChangePasswordFormValues, ChangePasswordSchema } from '@/schemas/auth';
import { colors } from '@/lib/theme';

export default function ChangePasswordScreen() {
	const dispatch = useDispatch<AppDispatch>();
	const { isLoading, user } = useSelector((state: RootState) => state.auth);
	const [error, setError] = useState('');
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleChangePassword = async (values: ChangePasswordFormValues) => {
		try {
			setError('');

			if (!user?.email) {
				setError('Kullanıcı bilgileri alınamadı');
				return;
			}

			const { error: signInError } = await supabase.auth.signInWithPassword({
				email: user.email,
				password: values.currentPassword
			});

			if (signInError) {
				if (signInError.message.includes('Invalid login credentials')) {
					setError('Mevcut şifreniz hatalı');
				} else {
					setError('Şifre kontrolü sırasında bir hata oluştu');
				}
				return;
			}

			if (values.currentPassword === values.newPassword) {
				setError('Yeni şifreniz mevcut şifreniz ile aynı olamaz');
				return;
			}

			await dispatch(changePassword({ password: values.newPassword })).unwrap();
			router.back();
		} catch (err: any) {
			const errorMessage = err.message?.toLowerCase() || '';
			if (errorMessage.includes('password')) {
				if (errorMessage.includes('strong')) {
					setError('Yeni şifreniz yeterince güçlü değil. Lütfen en az bir büyük harf, bir küçük harf ve bir rakam içeren 6 karakterlik bir şifre girin.');
				} else {
					setError('Şifre değiştirme işlemi başarısız oldu');
				}
			} else {
				setError('Şifre değiştirilirken bir hata oluştu. Lütfen tekrar deneyin.');
			}
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
				<Formik
					initialValues={{
						currentPassword: '',
						newPassword: '',
						confirmNewPassword: ''
					}}
					validationSchema={ChangePasswordSchema}
					onSubmit={handleChangePassword}
				>
					{({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
						<>
							<View style={styles.header}>
								<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
									<Ionicons name='close' size={24} color='#000' />
								</TouchableOpacity>
								<Text style={styles.title}>Şifre Değiştir</Text>
								<TouchableOpacity
									style={[
										styles.saveButton,
										(!isValid || !values.currentPassword || !values.newPassword || !values.confirmNewPassword) &&
											styles.saveButtonDisabled
									]}
									onPress={() => handleSubmit()}
									disabled={
										isLoading ||
										!isValid ||
										!values.currentPassword ||
										!values.newPassword ||
										!values.confirmNewPassword
									}
								>
									<Text
										style={[
											styles.saveButtonText,
											(!isValid ||
												!values.currentPassword ||
												!values.newPassword ||
												!values.confirmNewPassword) &&
												styles.saveButtonTextDisabled
										]}
									>
										Kaydet
									</Text>
								</TouchableOpacity>
							</View>

							<View style={styles.form}>
								<View style={styles.inputGroup}>
									<InputField
										label='Mevcut Şifre'
										placeholder='••••••'
										value={values.currentPassword}
										onChangeText={handleChange('currentPassword')}
										onBlur={handleBlur('currentPassword')}
										error={touched.currentPassword && errors.currentPassword ? errors.currentPassword : undefined}
										secureTextEntry={!showCurrentPassword}
										rightIcon={
											<TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
												<Ionicons
													name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
													size={24}
													color={colors.text.secondary}
												/>
											</TouchableOpacity>
										}
									/>

									<InputField
										label='Yeni Şifre'
										placeholder='••••••'
										value={values.newPassword}
										onChangeText={handleChange('newPassword')}
										onBlur={handleBlur('newPassword')}
										error={touched.newPassword && errors.newPassword ? errors.newPassword : undefined}
										secureTextEntry={!showNewPassword}
										rightIcon={
											<TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
												<Ionicons
													name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
													size={24}
													color={colors.text.secondary}
												/>
											</TouchableOpacity>
										}
									/>

									<InputField
										label='Yeni Şifre Tekrarı'
										placeholder='••••••'
										value={values.confirmNewPassword}
										onChangeText={handleChange('confirmNewPassword')}
										onBlur={handleBlur('confirmNewPassword')}
										error={
											touched.confirmNewPassword && errors.confirmNewPassword
												? errors.confirmNewPassword
												: undefined
										}
										secureTextEntry={!showConfirmPassword}
										rightIcon={
											<TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
												<Ionicons
													name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
													size={24}
													color={colors.text.secondary}
												/>
											</TouchableOpacity>
										}
									/>
								</View>

								{error ? (
									<View style={styles.errorContainer}>
										<Text style={styles.errorText}>{error}</Text>
									</View>
								) : null}
							</View>
						</>
					)}
				</Formik>

				<OverlayLoading visible={isLoading} message='Şifre değiştiriliyor...' />
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E7EB'
	},
	backButton: {
		padding: 8
	},
	title: {
		fontSize: 17,
		fontWeight: '600',
		color: '#111827'
	},
	form: {
		padding: 20
	},
	inputGroup: {
		gap: 24
	},
	errorContainer: {
		backgroundColor: '#FEF2F2',
		padding: 12,
		borderRadius: 10,
		marginTop: 16,
		marginBottom: 24
	},
	errorText: {
		color: '#DC2626',
		fontSize: 14,
		textAlign: 'center'
	},
	saveButton: {
		paddingVertical: 8,
		paddingHorizontal: 12
	},
	saveButtonDisabled: {
		opacity: 0.5
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#2563EB'
	},
	saveButtonTextDisabled: {
		color: '#9CA3AF'
	}
});
