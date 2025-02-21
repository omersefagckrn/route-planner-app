import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Linking } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootState, AppDispatch } from '@/store/rootStore';
import { getCurrentUser, signOut } from '../../store/features/authSlice';
import { OverlayLoading } from '../../components/OverlayLoading';
import { BtnAuth } from '../../components/BtnAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
	const dispatch = useDispatch<AppDispatch>();
	const { user, isLoading } = useSelector((state: RootState) => state.auth);
	const [locationPermission, setLocationPermission] = useState<string | null>(null);

	const userInitials = useMemo(() => {
		if (!user?.user_metadata?.first_name && !user?.user_metadata?.last_name) return '??';
		const firstInitial = user.user_metadata.first_name?.[0] || '';
		const lastInitial = user.user_metadata.last_name?.[0] || '';
		return `${firstInitial}${lastInitial}`.toUpperCase();
	}, [user]);

	useEffect(() => {
		const loadUserData = async () => {
			await dispatch(getCurrentUser());
			checkLocationPermission();
		};
		loadUserData();
	}, [dispatch]);

	const checkLocationPermission = async () => {
		const locationStatus = await Location.getForegroundPermissionsAsync();
		setLocationPermission(locationStatus.status);
	};

	const requestLocationPermission = async () => {
		const { status } = await Location.requestForegroundPermissionsAsync();
		setLocationPermission(status);
		if (status !== 'granted') {
			Linking.openSettings();
		}
	};

	const handleSignOut = () => {
		dispatch(signOut());
	};

	const handleChangePassword = () => {
		router.push('/(modals)/change-password');
	};

	if (isLoading) {
		return (
			<View style={styles.container}>
				<OverlayLoading visible={true} message='Yükleniyor...' />
			</View>
		);
	}

	// Kullanıcı giriş yapmamışsa
	if (!user) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>Kişiselleştirme</Text>
					<Text style={styles.subtitle}>Daha iyi bir deneyim için hesabınızı kişiselleştirin</Text>
				</View>

				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					<View style={styles.featureList}>
						<View style={styles.featureItem}>
							<View style={styles.featureIcon}>
								<Ionicons name='person-circle-outline' size={24} color='#1A1A1A' />
							</View>
							<View style={styles.featureText}>
								<Text style={styles.featureTitle}>Kişisel Profil</Text>
								<Text style={styles.featureDescription}>Profilinizi özelleştirin ve tercihlerinizi kaydedin</Text>
							</View>
						</View>

						<View style={styles.featureItem}>
							<View style={styles.featureIcon}>
								<Ionicons name='star-outline' size={24} color='#1A1A1A' />
							</View>
							<View style={styles.featureText}>
								<Text style={styles.featureTitle}>Favori Rotalar</Text>
								<Text style={styles.featureDescription}>Sık kullandığınız rotaları kaydedin ve hızlıca erişin</Text>
							</View>
						</View>

						<View style={styles.featureItem}>
							<View style={styles.featureIcon}>
								<Ionicons name='sync-outline' size={24} color='#1A1A1A' />
							</View>
							<View style={styles.featureText}>
								<Text style={styles.featureTitle}>Otomatik Senkronizasyon</Text>
								<Text style={styles.featureDescription}>Verileriniz tüm cihazlarınızda güncel kalsın</Text>
							</View>
						</View>
					</View>

					<View style={styles.authButtonsContainer}>
						<BtnAuth />
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<LinearGradient colors={['#1A1A1A', '#333333']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
					<View style={styles.profileContainer}>
						<View style={styles.userAvatar}>
							<Text style={styles.userInitials}>{userInitials}</Text>
						</View>
						<View style={styles.userDetails}>
							<Text style={styles.userName}>
								{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
							</Text>
							<Text style={styles.userEmail}>{user?.email}</Text>
						</View>
					</View>
				</LinearGradient>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>İzinler</Text>
					<TouchableOpacity style={styles.menuItem} onPress={locationPermission === 'granted' ? undefined : requestLocationPermission}>
						<View style={styles.menuItemLeft}>
							<Ionicons name='location-outline' size={24} color={locationPermission === 'granted' ? '#4CAF50' : '#1A1A1A'} />
							<View style={styles.permissionInfo}>
								<Text style={styles.menuItemText}>Konum İzni</Text>
								<Text style={[styles.permissionStatus, { color: locationPermission === 'granted' ? '#4CAF50' : '#FF3B30' }]}>
									{locationPermission === 'granted' ? 'İzin Verildi' : 'İzin Verilmedi'}
								</Text>
							</View>
						</View>
						{locationPermission !== 'granted' && <Ionicons name='chevron-forward' size={24} color='#1A1A1A' />}
					</TouchableOpacity>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Hesap</Text>
					<Link href='/(modals)/edit-profile' asChild>
						<TouchableOpacity style={styles.menuItem}>
							<View style={styles.menuItemLeft}>
								<Ionicons name='person-outline' size={24} color='#1A1A1A' />
								<Text style={styles.menuItemText}>Profili Düzenle</Text>
							</View>
							<Ionicons name='chevron-forward' size={24} color='#1A1A1A' />
						</TouchableOpacity>
					</Link>

					<TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
						<View style={styles.menuItemLeft}>
							<Ionicons name='key-outline' size={24} color='#1A1A1A' />
							<Text style={styles.menuItemText}>Şifre Değiştir</Text>
						</View>
						<Ionicons name='chevron-forward' size={24} color='#1A1A1A' />
					</TouchableOpacity>
				</View>

				{__DEV__ && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Geliştirici</Text>
						<TouchableOpacity
							style={styles.menuItem}
							onPress={async () => {
								try {
									await AsyncStorage.removeItem('hasLaunched');
									await AsyncStorage.removeItem('user-preferences');
									router.replace('/');
								} catch (error) {
									console.error('Storage temizlenirken hata:', error);
									alert('Bir hata oluştu');
								}
							}}
						>
							<View style={styles.menuItemLeft}>
								<Ionicons name='refresh-outline' size={24} color='#1A1A1A' />
								<Text style={styles.menuItemText}>Onboarding Sıfırla</Text>
							</View>
							<Ionicons name='chevron-forward' size={24} color='#1A1A1A' />
						</TouchableOpacity>
					</View>
				)}

				<TouchableOpacity style={[styles.signOutButton, { marginTop: 12 }]} onPress={handleSignOut}>
					<Ionicons name='log-out-outline' size={24} color='#FF3B30' />
					<Text style={styles.signOutText}>Çıkış Yap</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	content: {
		flex: 1
	},
	header: {
		padding: 24,
		marginBottom: 8,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.15,
				shadowRadius: 12
			},
			android: {
				elevation: 8
			}
		})
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1A1A1A',
		marginBottom: 8
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		lineHeight: 22
	},
	profileContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	userAvatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
		borderWidth: 2,
		borderColor: 'rgba(255, 255, 255, 0.3)'
	},
	userInitials: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff'
	},
	userDetails: {
		flex: 1
	},
	userName: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 4
	},
	userEmail: {
		fontSize: 14,
		color: 'rgba(255, 255, 255, 0.8)'
	},
	editButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 12
	},
	featureList: {
		padding: 20,
		gap: 16
	},
	featureItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		backgroundColor: '#F9FAFB',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E5E7EB'
	},
	featureIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4
			},
			android: {
				elevation: 2
			}
		})
	},
	featureText: {
		flex: 1
	},
	featureTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1A1A1A',
		marginBottom: 4
	},
	featureDescription: {
		fontSize: 14,
		color: '#666',
		lineHeight: 20
	},
	section: {
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 8
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1F2937',
		marginBottom: 16
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 20,
		backgroundColor: '#F8FAFC',
		borderRadius: 12,
		marginBottom: 8,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4
			},
			android: {
				elevation: 2
			}
		})
	},
	menuItemLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		gap: 12
	},
	menuItemText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1A1A1A'
	},
	permissionInfo: {
		flex: 1
	},
	permissionStatus: {
		fontSize: 13,
		marginTop: 2,
		fontWeight: '600'
	},
	signOutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		marginHorizontal: 20,
		marginVertical: 24,
		padding: 16,
		backgroundColor: '#FEF2F2',
		borderRadius: 12
	},
	signOutText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FF3B30'
	},
	authButtonsContainer: {
		padding: 20,
		marginTop: 'auto'
	}
});
