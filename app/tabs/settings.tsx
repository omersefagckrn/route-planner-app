import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import type { RootState, AppDispatch } from '@/store/store';
import { getCurrentUser, signOut } from '../../store/features/authSlice';
import { LoadingOverlay } from '../../components/LoadingOverlay';

export default function SettingsScreen() {
	const dispatch = useDispatch<AppDispatch>();
	const { user, isLoading } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		dispatch(getCurrentUser());
	}, [dispatch]);

	const handleSignOut = () => {
		dispatch(signOut());
	};

	const handleChangePassword = () => {
		router.push('/(modals)/change-password');
	};

	if (isLoading) {
		return (
			<View style={styles.container}>
				<LoadingOverlay visible={true} message='Yükleniyor...' />
			</View>
		);
	}

	// Kullanıcı giriş yapmamışsa
	if (!user) {
		return (
			<View style={styles.container}>
				<LinearGradient colors={['#4C47DB', '#6366F1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
					<View style={styles.headerIcon}>
						<Ionicons name='settings-outline' size={40} color='#fff' />
					</View>
					<Text style={styles.title}>Kişiselleştirme</Text>
					<Text style={styles.description}>Daha iyi bir deneyim için hesap oluşturun ve uygulamayı kişiselleştirin</Text>
				</LinearGradient>

				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					<View style={styles.featureList}>
						<View style={styles.featureItem}>
							<View style={styles.featureIcon}>
								<Ionicons name='person-circle-outline' size={24} color='#6366F1' />
							</View>
							<View style={styles.featureText}>
								<Text style={styles.featureTitle}>Kişisel Profil</Text>
								<Text style={styles.featureDescription}>Profilinizi özelleştirin ve tercihlerinizi kaydedin</Text>
							</View>
						</View>

						<View style={styles.featureItem}>
							<View style={styles.featureIcon}>
								<Ionicons name='star-outline' size={24} color='#6366F1' />
							</View>
							<View style={styles.featureText}>
								<Text style={styles.featureTitle}>Favori Rotalar</Text>
								<Text style={styles.featureDescription}>Sık kullandığınız rotaları kaydedin ve hızlıca erişin</Text>
							</View>
						</View>

						<View style={styles.featureItem}>
							<View style={styles.featureIcon}>
								<Ionicons name='sync-outline' size={24} color='#6366F1' />
							</View>
							<View style={styles.featureText}>
								<Text style={styles.featureTitle}>Otomatik Senkronizasyon</Text>
								<Text style={styles.featureDescription}>Verileriniz tüm cihazlarınızda güncel kalsın</Text>
							</View>
						</View>
					</View>

					<View style={styles.authButtons}>
						<Link href='/auth/login' asChild>
							<TouchableOpacity style={styles.loginButton}>
								<Ionicons name='log-in-outline' size={20} color='#6366F1' />
								<Text style={styles.loginButtonText}>Giriş Yap</Text>
							</TouchableOpacity>
						</Link>

						<Link href='/auth/register' asChild>
							<TouchableOpacity style={styles.registerButton}>
								<Ionicons name='person-add-outline' size={20} color='#fff' />
								<Text style={styles.registerButtonText}>Hesap Oluştur</Text>
							</TouchableOpacity>
						</Link>
					</View>
				</ScrollView>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<LinearGradient colors={['#4C47DB', '#6366F1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
				<View style={styles.userInfo}>
					<View style={styles.userAvatar}>
						<Text style={styles.userInitials}>
							{user.first_name[0]}
							{user.last_name[0]}
						</Text>
					</View>
					<View style={styles.userDetails}>
						<Text style={styles.userName}>
							{user.first_name} {user.last_name}
						</Text>
						<Text style={styles.userEmail}>{user.email}</Text>
					</View>
				</View>
			</LinearGradient>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Hesap</Text>
					<Link href='/(modals)/edit-profile' asChild>
						<TouchableOpacity style={styles.menuItem}>
							<View style={styles.menuItemLeft}>
								<Ionicons name='person-outline' size={24} color='#6366F1' />
								<Text style={styles.menuItemText}>Profili Düzenle</Text>
							</View>
							<Ionicons name='chevron-forward' size={24} color='#6366F1' />
						</TouchableOpacity>
					</Link>

					<TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
						<View style={styles.menuItemLeft}>
							<Ionicons name='key-outline' size={24} color='#6366F1' />
							<Text style={styles.menuItemText}>Şifre Değiştir</Text>
						</View>
						<Ionicons name='chevron-forward' size={24} color='#6366F1' />
					</TouchableOpacity>
				</View>

				<TouchableOpacity style={[styles.signOutButton, { marginTop: 12 }]} onPress={handleSignOut}>
					<Ionicons name='log-out-outline' size={24} color='#FF3B30' />
					<Text style={styles.signOutText}>Çıkış Yap</Text>
				</TouchableOpacity>
			</ScrollView>
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
	headerIcon: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20
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
		flex: 1
	},
	featureList: {
		padding: 20,
		gap: 16
	},
	featureItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F8FAFC',
		padding: 16,
		borderRadius: 12,
		...Platform.select({
			ios: {
				shadowColor: '#6366F1',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4
			},
			android: {
				elevation: 2
			}
		})
	},
	featureIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: 'rgba(99, 102, 241, 0.1)',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16
	},
	featureText: {
		flex: 1
	},
	featureTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1F2937',
		marginBottom: 4
	},
	featureDescription: {
		fontSize: 14,
		color: '#6B7280'
	},
	authButtons: {
		padding: 20,
		gap: 12
	},
	loginButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#fff',
		paddingVertical: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#6366F1'
	},
	loginButtonText: {
		color: '#6366F1',
		fontSize: 16,
		fontWeight: '600'
	},
	registerButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#6366F1',
		paddingVertical: 16,
		borderRadius: 12
	},
	registerButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600'
	},
	userInfo: {
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
		marginRight: 16
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
		color: 'rgba(255, 255, 255, 0.9)'
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
		backgroundColor: '#F8FAFC',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12
	},
	menuItemLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	},
	menuItemText: {
		fontSize: 16,
		color: '#1F2937'
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
	}
});
