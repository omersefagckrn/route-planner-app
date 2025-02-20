import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProfile } from '../../store/features/authSlice';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { EditProfileFormValues, EditProfileSchema } from '@/schemas/auth';
import { Mask } from 'react-native-mask-input';

const phoneMask: Mask = ['(', /5/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

export default function EditProfileScreen() {
	const dispatch = useAppDispatch();
	const { isLoading, error, user } = useAppSelector((state) => state.auth);

	if (!user) {
		return (
			<View style={styles.container}>
				<LoadingOverlay visible={true} message='Profil yükleniyor...' />
			</View>
		);
	}

	const handleSubmit = async (values: EditProfileFormValues) => {
		dispatch(
			updateProfile({
				userId: user.id,
				updates: {
					first_name: values.first_name,
					last_name: values.last_name,
					phone: values.phone
				}
			})
		);
	};

	return (
		<View style={styles.container}>
			<LinearGradient colors={['#4C47DB', '#6366F1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
						<Ionicons name='arrow-back' size={24} color='#fff' />
					</TouchableOpacity>
					<View style={styles.headerTextContainer}>
						<Text style={styles.title}>Profili Düzenle</Text>
						<Text style={styles.description}>Kişisel bilgilerinizi güncelleyin</Text>
					</View>
				</View>
			</LinearGradient>

			<LoadingOverlay visible={isLoading} message='Profil güncelleniyor...' />

			{error && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			)}

			<View style={styles.content}>
				<Formik
					initialValues={{
						first_name: user.first_name || '',
						last_name: user.last_name || '',
						phone: user.phone || ''
					}}
					validationSchema={EditProfileSchema}
					onSubmit={handleSubmit}
					enableReinitialize
				>
					{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
						<View style={styles.form}>
							<View style={styles.inputGroup}>
								<View style={styles.inputRow}>
									<View style={styles.inputHalf}>
										<Input
											label='Ad'
											placeholder='John'
											value={values.first_name}
											onChangeText={handleChange('first_name')}
											onBlur={handleBlur('first_name')}
											error={touched.first_name && errors.first_name}
										/>
									</View>
									<View style={styles.inputHalf}>
										<Input
											label='Soyad'
											placeholder='Doe'
											value={values.last_name}
											onChangeText={handleChange('last_name')}
											onBlur={handleBlur('last_name')}
											error={touched.last_name && errors.last_name}
										/>
									</View>
								</View>

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
							</View>

							<View style={styles.buttonContainer}>
								<Button onPress={() => handleSubmit()} title='Kaydet' loading={isLoading} />
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
	inputRow: {
		flexDirection: 'row',
		gap: 12
	},
	inputHalf: {
		flex: 1
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
