import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signIn, clearError } from '../../store/features/authSlice';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { LoginFormValues, LoginSchema } from '@/schemas/auth';

export default function LoginScreen() {
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state) => state.auth);

	useEffect(() => {
		dispatch(clearError());
	}, [dispatch]);

	const handleLogin = async (values: LoginFormValues) => {
		dispatch(signIn(values));
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
			<LinearGradient colors={['#4C47DB', '#6366F1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
						<Ionicons name='arrow-back' size={24} color='#fff' />
					</TouchableOpacity>
					<View style={styles.headerTextContainer}>
						<Text style={styles.title}>Tekrar Hoşgeldiniz</Text>
						<Text style={styles.description}>Rotalarınızı planlamaya devam etmek için giriş yapın</Text>
					</View>
				</View>
			</LinearGradient>

			<LoadingOverlay visible={isLoading} message='Giriş yapılıyor...' />

			{error && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			)}

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				showsVerticalScrollIndicator={false}
				bounces={false}
				keyboardShouldPersistTaps='handled'
			>
				<Formik initialValues={{ email: '', password: '' }} validationSchema={LoginSchema} onSubmit={handleLogin}>
					{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
						<View style={styles.form}>
							<View style={styles.inputGroup}>
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
									label='Şifre'
									placeholder='••••••'
									value={values.password}
									onChangeText={handleChange('password')}
									onBlur={handleBlur('password')}
									error={touched.password && errors.password}
									secureTextEntry
								/>
							</View>

							<View style={styles.actionGroup}>
								<Button onPress={() => handleSubmit()} title='Giriş Yap' loading={isLoading} />

								<Link href='/auth/register' asChild>
									<TouchableOpacity style={styles.registerButton}>
										<Text style={styles.registerButtonText}>
											Henüz hesabınız yok mu? <Text style={styles.registerButtonTextBold}>Hemen oluşturun</Text>
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
		flexGrow: 1,
		justifyContent: 'space-between'
	},
	form: {
		padding: 20,
		gap: 24
	},
	inputGroup: {
		gap: 8
	},
	actionGroup: {
		gap: 12,
		marginTop: 4
	},
	errorContainer: {
		backgroundColor: '#ffebee',
		padding: 10,
		margin: 20,
		borderRadius: 12
	},
	errorText: {
		color: '#c62828',
		textAlign: 'center'
	},
	registerButton: {
		alignItems: 'center',
		paddingVertical: 8
	},
	registerButtonText: {
		color: '#6B7280',
		fontSize: 14,
		textAlign: 'center'
	},
	registerButtonTextBold: {
		color: '#6366F1',
		fontWeight: '600'
	}
});
