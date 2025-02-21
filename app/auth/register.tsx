import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../store/useStore';
import { signUp, signIn, clearError } from '../../store/features/authSlice';
import { OverlayLoading } from '../../components/OverlayLoading';
import { InputField } from '../../components/InputField';
import { BtnPrimary } from '../../components/BtnPrimary';
import { RegisterFormValues, RegisterSchema } from '@/schemas/auth';
import { Mask } from 'react-native-mask-input';

const phoneMask: Mask = ['(', /5/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

export default function RegisterScreen() {
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state) => state.auth);
	const [registrationError, setRegistrationError] = useState('');

	useEffect(() => {
		dispatch(clearError());
	}, [dispatch]);

	const handleRegister = async (values: RegisterFormValues) => {
		try {
			const { confirmPassword, ...userData } = values;
			await dispatch(signUp(userData)).unwrap();
			router.replace('/tabs');
		} catch (error) {
			setRegistrationError(`Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin. ${error}`);
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
			<LinearGradient colors={['#1A1A1A', '#333333']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
						<Ionicons name='arrow-back' size={24} color='#fff' />
					</TouchableOpacity>
					<View style={styles.headerTextContainer}>
						<Text style={styles.title}>Kayıt Ol</Text>
						<Text style={styles.description}>Yeni bir hesap oluşturun</Text>
					</View>
				</View>
			</LinearGradient>

			<OverlayLoading visible={isLoading} message='Kayıt yapılıyor...' />

			{error || registrationError ? (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error || registrationError}</Text>
				</View>
			) : null}

			<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false} bounces={false}>
				<Formik
					initialValues={{
						firstName: '',
						lastName: '',
						email: '',
						phone: '',
						password: '',
						confirmPassword: ''
					}}
					validationSchema={RegisterSchema}
					onSubmit={handleRegister}
				>
					{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
						<View style={styles.form}>
							<View style={styles.inputGroup}>
								<View style={styles.inputRow}>
									<View style={styles.inputHalf}>
										<InputField
											label='Ad'
											placeholder='John'
											value={values.firstName}
											onChangeText={handleChange('firstName')}
											onBlur={handleBlur('firstName')}
											error={touched.firstName && errors.firstName ? errors.firstName : undefined}
										/>
									</View>
									<View style={styles.inputHalf}>
										<InputField
											label='Soyad'
											placeholder='Doe'
											value={values.lastName}
											onChangeText={handleChange('lastName')}
											onBlur={handleBlur('lastName')}
											error={touched.lastName && errors.lastName ? errors.lastName : undefined}
										/>
									</View>
								</View>

								<InputField
									label='E-posta Adresi'
									placeholder='ornek@email.com'
									value={values.email}
									onChangeText={handleChange('email')}
									onBlur={handleBlur('email')}
									error={touched.email && errors.email ? errors.email : undefined}
									keyboardType='email-address'
									autoCapitalize='none'
								/>

								<InputField
									label='Telefon Numarası'
									placeholder='(5XX) XXX-XXXX'
									value={values.phone}
									onChangeText={handleChange('phone')}
									onBlur={handleBlur('phone')}
									error={touched.phone && errors.phone ? errors.phone : undefined}
									keyboardType='numeric'
									/* @ts-ignore */
									mask={phoneMask}
								/>

								<InputField
									label='Şifre'
									placeholder='••••••'
									value={values.password}
									onChangeText={handleChange('password')}
									onBlur={handleBlur('password')}
									error={touched.password && errors.password ? errors.password : undefined}
									secureTextEntry
								/>

								<InputField
									label='Şifre Tekrarı'
									placeholder='••••••'
									value={values.confirmPassword}
									onChangeText={handleChange('confirmPassword')}
									onBlur={handleBlur('confirmPassword')}
									error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
									secureTextEntry
								/>
							</View>

							<View style={styles.actionGroup}>
								<BtnPrimary onPress={() => handleSubmit()} title='Hesap Oluştur' loading={isLoading} />

								<Link href='/auth/login' asChild>
									<TouchableOpacity style={styles.loginButton}>
										<Text style={styles.loginButtonText}>
											Zaten hesabınız var mı? <Text style={styles.loginButtonTextBold}>Giriş yapın</Text>
										</Text>
									</TouchableOpacity>
								</Link>
							</View>
						</View>
					)}
				</Formik>
			</ScrollView>
		</KeyboardAvoidingView>
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
				shadowColor: '#1A1A1A',
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
	scrollView: {
		flex: 1
	},
	scrollViewContent: {
		flexGrow: 1
	},
	form: {
		padding: 20,
		gap: 24
	},
	inputGroup: {
		gap: 8
	},
	inputRow: {
		flexDirection: 'row',
		gap: 12
	},
	inputHalf: {
		flex: 1
	},
	actionGroup: {
		gap: 12,
		marginTop: 4
	},
	errorContainer: {
		backgroundColor: '#ffebee',
		padding: 10,
		margin: 20,
		borderRadius: 5
	},
	errorText: {
		color: '#c62828',
		textAlign: 'center'
	},
	loginButton: {
		marginTop: 20,
		alignItems: 'center'
	},
	loginButtonText: {
		color: '#1A1A1A',
		fontSize: 16
	},
	loginButtonTextBold: {
		fontWeight: 'bold',
		color: '#1A1A1A'
	}
});
