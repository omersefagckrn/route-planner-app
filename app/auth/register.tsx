import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signUp, clearError } from '../../store/features/authSlice';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { RegisterFormValues, RegisterSchema } from '@/schemas/auth';
import { Mask } from 'react-native-mask-input';

const phoneMask: Mask = ['(', /5/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

export default function RegisterScreen() {
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state) => state.auth);

	useEffect(() => {
		dispatch(clearError());
	}, [dispatch]);

	const handleRegister = async (values: RegisterFormValues) => {
		const { confirmPassword, ...userData } = values;
		dispatch(signUp(userData));
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
			<LinearGradient colors={['#4C47DB', '#6366F1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
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

			<LoadingOverlay visible={isLoading} message='Kayıt yapılıyor...' />

			{error && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			)}

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
										<Input
											label='Ad'
											placeholder='John'
											value={values.firstName}
											onChangeText={handleChange('firstName')}
											onBlur={handleBlur('firstName')}
											error={touched.firstName && errors.firstName}
										/>
									</View>
									<View style={styles.inputHalf}>
										<Input
											label='Soyad'
											placeholder='Doe'
											value={values.lastName}
											onChangeText={handleChange('lastName')}
											onBlur={handleBlur('lastName')}
											error={touched.lastName && errors.lastName}
										/>
									</View>
								</View>

								<Input
									label='E-posta Adresi'
									placeholder='ornek@email.com'
									value={values.email}
									onChangeText={handleChange('email')}
									onBlur={handleBlur('email')}
									error={touched.email && errors.email}
									keyboardType='email-address'
									autoCapitalize='none'
								/>

								<Input
									label='Telefon Numarası'
									placeholder='(5XX) XXX-XXXX'
									value={values.phone}
									onChangeText={handleChange('phone')}
									onBlur={handleBlur('phone')}
									error={touched.phone && errors.phone}
									keyboardType='numeric'
									mask={phoneMask}
								/>

								<Input
									label='Şifre'
									placeholder='••••••'
									value={values.password}
									onChangeText={handleChange('password')}
									onBlur={handleBlur('password')}
									error={touched.password && errors.password}
									secureTextEntry
								/>

								<Input
									label='Şifre Tekrarı'
									placeholder='••••••'
									value={values.confirmPassword}
									onChangeText={handleChange('confirmPassword')}
									onBlur={handleBlur('confirmPassword')}
									error={touched.confirmPassword && errors.confirmPassword}
									secureTextEntry
								/>
							</View>

							<View style={styles.actionGroup}>
								<Button onPress={() => handleSubmit()} title='Hesap Oluştur' loading={isLoading} />

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
		color: '#3b5998',
		fontSize: 16
	},
	loginButtonTextBold: {
		fontWeight: 'bold'
	}
});
