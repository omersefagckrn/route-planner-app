import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { updateProfile } from '../../store/features/authSlice';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import type { RootState, AppDispatch } from '@/store/store';

export default function EditProfileScreen() {
	const dispatch = useDispatch<AppDispatch>();
	const { user, isLoading } = useSelector((state: RootState) => state.auth);
	const userMetadata = user?.user_metadata;

	const [firstName, setFirstName] = useState(userMetadata?.first_name || '');
	const [lastName, setLastName] = useState(userMetadata?.last_name || '');
	const [error, setError] = useState('');

	const handleUpdateProfile = async () => {
		try {
			if (!firstName || !lastName) {
				setError('Ad ve soyad alanları zorunludur');
				return;
			}

			const updates: any = {};

			// Sadece değişen alanları güncelle
			if (firstName !== userMetadata?.first_name) {
				updates.first_name = firstName;
			}
			if (lastName !== userMetadata?.last_name) {
				updates.last_name = lastName;
			}

			// Eğer hiçbir değişiklik yoksa uyarı ver
			if (Object.keys(updates).length === 0) {
				setError('Değişiklik yapmadınız');
				return;
			}

			await dispatch(updateProfile(updates)).unwrap();
			router.back();
		} catch (err: any) {
			setError(err.message || 'Profil güncellenirken bir hata oluştu');
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
						<Ionicons name='close' size={24} color='#000' />
					</TouchableOpacity>
					<Text style={styles.title}>Profili Düzenle</Text>
					<TouchableOpacity
						style={[styles.saveButton, (!firstName || !lastName) && styles.saveButtonDisabled]}
						onPress={handleUpdateProfile}
						disabled={isLoading || !firstName || !lastName}
					>
						<Text style={[styles.saveButtonText, (!firstName || !lastName) && styles.saveButtonTextDisabled]}>Kaydet</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.form}>
					<View style={styles.inputContainer}>
						<Text style={styles.label}>Ad</Text>
						<TextInput
							style={styles.input}
							value={firstName}
							onChangeText={setFirstName}
							placeholder='Adınızı girin'
							placeholderTextColor='#9CA3AF'
							autoCapitalize='words'
							autoCorrect={false}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Soyad</Text>
						<TextInput
							style={styles.input}
							value={lastName}
							onChangeText={setLastName}
							placeholder='Soyadınızı girin'
							placeholderTextColor='#9CA3AF'
							autoCapitalize='words'
							autoCorrect={false}
						/>
					</View>

					<View style={styles.emailContainer}>
						<Text style={styles.label}>E-posta</Text>
						<View style={styles.emailOverlayContainer}>
							<Text style={styles.emailText}>{user?.email}</Text>
							<View style={styles.emailOverlay} />
						</View>
						<Text style={styles.emailNote}>E-posta adresi güvenlik nedeniyle değiştirilemez</Text>
					</View>

					{error ? <Text style={styles.errorText}>{error}</Text> : null}
				</View>

				<LoadingOverlay visible={isLoading} message='Profil güncelleniyor...' />
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
	},
	form: {
		padding: 20
	},
	inputContainer: {
		marginBottom: 24
	},
	label: {
		fontSize: 15,
		fontWeight: '500',
		marginBottom: 8,
		color: '#374151'
	},
	input: {
		borderWidth: 1,
		borderColor: '#E5E7EB',
		borderRadius: 10,
		padding: 14,
		fontSize: 16,
		backgroundColor: '#F9FAFB',
		color: '#111827'
	},
	errorText: {
		color: '#EF4444',
		fontSize: 14,
		marginTop: 8
	},
	emailContainer: {
		marginBottom: 24
	},
	emailOverlayContainer: {
		position: 'relative',
		borderRadius: 10,
		overflow: 'hidden'
	},
	emailText: {
		fontSize: 16,
		color: '#111827',
		backgroundColor: '#F9FAFB',
		padding: 14,
		borderWidth: 1,
		borderColor: '#E5E7EB',
		borderRadius: 10,
		opacity: 0.7
	},
	emailOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		zIndex: 1
	},
	emailNote: {
		fontSize: 12,
		color: '#DC2626',
		marginTop: 4,
		fontWeight: '500'
	}
});
