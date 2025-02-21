import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '../../components/InputField';
import { BtnPrimary } from '../../components/BtnPrimary';
import { OverlayLoading } from '../../components/OverlayLoading';
import { colors } from '../../lib/theme';
import { AppDispatch, RootState } from '../../store/rootStore';
import { updateExistingAddress, fetchFavorites, fetchAddresses } from '../../store/features/addressSlice';
import { addressSchema } from '../../schemas/address';
import * as yup from 'yup';

export default function EditAddressModal() {
	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.auth);
	const { addresses } = useSelector((state: RootState) => state.address);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const params = useLocalSearchParams();
	const id = params.id;

	const [formData, setFormData] = useState({
		title: '',
		address: '',
		latitude: '',
		longitude: '',
		is_favorite: false
	});

	// Mevcut adres verilerini yükle
	useEffect(() => {
		if (!id) {
			router.replace('/tabs/address-book');
			return;
		}

		const existingAddress = addresses.find((addr) => addr.id === id);
		if (existingAddress) {
			setFormData({
				title: existingAddress.title,
				address: existingAddress.address,
				latitude: existingAddress.latitude.toString(),
				longitude: existingAddress.longitude.toString(),
				is_favorite: existingAddress.is_favorite
			});
		} else {
			router.replace('/tabs/address-book');
		}
	}, [id, addresses]);

	// Map-picker'dan gelen verileri yakala
	useEffect(() => {
		if (params.latitude && params.longitude && params.address) {
			try {
				const decodedAddress = decodeURIComponent(params.address.toString());
				setFormData((prev) => ({
					...prev,
					address: decodedAddress,
					latitude: params.latitude.toString(),
					longitude: params.longitude.toString()
				}));
				setErrors({});
			} catch (error) {
				console.error('Form verilerini işlerken hata:', error);
				setErrors({ general: 'Konum bilgileri güncellenirken hata oluştu' });
			}
		}
	}, [params.latitude, params.longitude, params.address]);

	const handleSubmit = async () => {
		try {
			if (!user?.id || !id) {
				setErrors({ general: 'Kullanıcı veya adres bilgisi bulunamadı' });
				return;
			}

			setLoading(true);
			setErrors({});

			const addressData = {
				title: formData.title,
				address: formData.address,
				latitude: parseFloat(formData.latitude),
				longitude: parseFloat(formData.longitude),
				is_favorite: formData.is_favorite
			};

			// Veri doğrulama
			await addressSchema.validate({ ...addressData, user_id: user.id }, { abortEarly: false });

			const result = await dispatch(
				updateExistingAddress({
					id: id.toString(),
					updates: addressData
				})
			).unwrap();

			if (!result) {
				setErrors({ general: 'Adres güncellenemedi' });
				return;
			}

			// Adres listesini ve favorileri güncelle
			await dispatch(fetchAddresses(user.id));
			await dispatch(fetchFavorites(user.id));

			// Başarılı işlem sonrası adres listesine dön
			router.replace('/tabs/address-book');
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				const validationErrors: { [key: string]: string } = {};
				error.inner.forEach((err) => {
					if (err.path) {
						validationErrors[err.path] = err.message;
					}
				});
				setErrors(validationErrors);
			} else {
				console.error('Form doğrulama hatası:', error);
				setErrors({
					general: 'Beklenmeyen bir hata oluştu'
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const handlePickLocation = () => {
		try {
			router.push({
				pathname: '/(modals)/map-picker',
				params: {
					editMode: 'true',
					id: id,
					currentLatitude: formData.latitude,
					currentLongitude: formData.longitude,
					currentAddress: formData.address
				}
			});
		} catch (error) {
			console.error('Harita açılırken hata:', error);
			setErrors({ general: 'Harita açılırken bir hata oluştu' });
		}
	};

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name='close' size={24} color={colors.text.primary} />
				</TouchableOpacity>
				<Text style={styles.title}>Adresi Düzenle</Text>
				<TouchableOpacity style={[styles.saveButton, loading && styles.disabledButton]} onPress={handleSubmit} disabled={loading}>
					{loading ? <ActivityIndicator size='small' color='#fff' /> : <Text style={styles.saveButtonText}>Kaydet</Text>}
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
				{errors.general && (
					<View style={styles.errorContainer}>
						<Text style={styles.errorText}>{errors.general}</Text>
					</View>
				)}

				<View style={styles.formGroup}>
					<InputField
						label='Başlık'
						placeholder='Örn: Ev, İş, Spor Salonu'
						value={formData.title}
						onChangeText={(text) => {
							setFormData((prev) => ({ ...prev, title: text }));
							setErrors((prev) => ({ ...prev, title: '' }));
						}}
						error={errors.title}
					/>

					<InputField
						label='Adres'
						placeholder='Tam adresi girin'
						value={formData.address}
						onChangeText={(text) => {
							setFormData((prev) => ({ ...prev, address: text }));
							setErrors((prev) => ({ ...prev, address: '' }));
						}}
						error={errors.address}
						multiline
						numberOfLines={3}
					/>
				</View>

				<View style={styles.buttonContainer}>
					<BtnPrimary title='Haritadan Konum Seç' variant='secondary' onPress={handlePickLocation} style={styles.mapButton} titleStyle={{ color: '#fff' }} />

					<TouchableOpacity
						style={[styles.favoriteButton, formData.is_favorite && styles.favoriteButtonActive, loading && styles.disabledButton]}
						onPress={() => setFormData((prev) => ({ ...prev, is_favorite: !prev.is_favorite }))}
						disabled={loading}
					>
						<View style={styles.favoriteContent}>
							<Ionicons
								name={formData.is_favorite ? 'star' : 'star-outline'}
								size={24}
								color={formData.is_favorite ? colors.primary.light : colors.text.secondary}
							/>
							<Text style={[styles.favoriteText, formData.is_favorite && styles.favoriteTextActive]}>
								{formData.is_favorite ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>

			{loading && <OverlayLoading visible={true} />}
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	} as ViewStyle,
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E7EB'
	} as ViewStyle,
	backButton: {
		padding: 8,
		borderRadius: 8
	} as ViewStyle,
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text.primary
	} as TextStyle,
	saveButton: {
		backgroundColor: colors.primary.light,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8
	} as ViewStyle,
	saveButtonText: {
		color: '#fff',
		fontWeight: '600'
	} as TextStyle,
	disabledButton: {
		opacity: 0.5
	} as ViewStyle,
	content: {
		flex: 1
	},
	contentContainer: {
		padding: 16,
		gap: 16
	},
	formGroup: {
		gap: 12
	},
	errorContainer: {
		backgroundColor: colors.danger.light,
		padding: 12,
		borderRadius: 8,
		marginBottom: 16
	} as ViewStyle,
	errorText: {
		color: '#fff',
		fontSize: 14
	} as TextStyle,
	buttonContainer: {
		gap: 12
	} as ViewStyle,
	mapButton: {
		marginBottom: 0
	} as ViewStyle,
	favoriteButton: {
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E5E7EB',
		backgroundColor: '#fff'
	} as ViewStyle,
	favoriteButtonActive: {
		backgroundColor: `${colors.primary.light}20`,
		borderColor: colors.primary.light
	} as ViewStyle,
	favoriteContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8
	} as ViewStyle,
	favoriteText: {
		fontSize: 16,
		color: colors.text.secondary
	} as TextStyle,
	favoriteTextActive: {
		color: colors.primary.light
	} as TextStyle
});
