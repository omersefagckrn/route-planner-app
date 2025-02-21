import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { fetchAddresses, fetchFavorites, removeAddress, toggleAddressFavorite } from '../../store/features/addressSlice';
import { RootState } from '../../store/store';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { colors } from '../../lib/theme';
import { Address } from '../../types/address';
import { AppDispatch } from '../../store/store';
import { AuthButtons } from '../../components/AuthButtons';

export default function AddressBookScreen() {
	const dispatch = useDispatch<AppDispatch>();
	const { addresses, favorites, status } = useSelector((state: RootState) => state.address);
	const { user } = useSelector((state: RootState) => state.auth);
	const [refreshing, setRefreshing] = useState(false);
	const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (user?.id) {
			loadAddresses();
		}
	}, [user]);

	const loadAddresses = async () => {
		if (user?.id) {
			await dispatch(fetchAddresses(user.id));
			await dispatch(fetchFavorites(user.id));
		}
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		await loadAddresses();
		setRefreshing(false);
	};

	const handleDelete = async (id: string) => {
		try {
			setIsLoading(true);
			await dispatch(removeAddress(id));
			if (user?.id) {
				await dispatch(fetchAddresses(user.id));
				await dispatch(fetchFavorites(user.id));
			}
		} catch (error) {
			console.error('Error deleting address:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggleFavorite = async (address: Address) => {
		try {
			setIsLoading(true);
			await dispatch(toggleAddressFavorite(address));
			if (user?.id) {
				await dispatch(fetchAddresses(user.id));
				await dispatch(fetchFavorites(user.id));
			}
		} catch (error) {
			console.error('Error toggling favorite:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (address: Address) => {
		router.push({
			pathname: '/(modals)/edit-address',
			params: { id: address.id }
		});
	};

	const handleAddAddress = () => {
		if (!user?.id) {
			router.push('/auth/login');
			return;
		}
		router.push('/(modals)/add-address');
	};

	if (!user) {
		return (
			<SafeAreaView style={styles.container} edges={['top']}>
				<View style={styles.header}>
					<Text style={styles.title}>Adres Defteri</Text>
				</View>
				<ScrollView style={styles.scrollView} contentContainerStyle={styles.welcomeScrollContent} showsVerticalScrollIndicator={false} bounces={true}>
					<View style={styles.welcomeContainer}>
						<View style={styles.iconContainer}>
							<LinearGradient
								colors={[colors.primary.dark, colors.primary.light]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								style={styles.iconBackground}
							>
								<Ionicons name='location' size={48} color='#fff' />
							</LinearGradient>
						</View>
						<Text style={styles.welcomeTitle}>Adreslerinizi Yönetin</Text>
						<Text style={styles.welcomeDescription}>
							Sık kullandığınız adresleri kaydedin, düzenleyin ve rotalarınızı kolayca planlayın. Başlamak için giriş yapın veya yeni bir hesap
							oluşturun.
						</Text>
						<View style={styles.features}>
							<View style={styles.featureItem}>
								<Ionicons name='bookmark-outline' size={24} color={colors.primary.light} />
								<Text style={styles.featureText}>Adresleri Kaydedin</Text>
							</View>
							<View style={styles.featureItem}>
								<Ionicons name='star-outline' size={24} color={colors.primary.light} />
								<Text style={styles.featureText}>Favorilere Ekleyin</Text>
							</View>
							<View style={styles.featureItem}>
								<Ionicons name='map-outline' size={24} color={colors.primary.light} />
								<Text style={styles.featureText}>Rotaları Planlayın</Text>
							</View>
						</View>

						<AuthButtons />
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}

	const renderAddressCard = (address: Address) => {
		const formatDate = (dateString: string) => {
			const date = new Date(dateString);
			return date.toLocaleDateString('tr-TR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		};

		return (
			<TouchableOpacity
				key={address.id}
				style={styles.card}
				onPress={() =>
					router.push({
						pathname: '/tabs/routes',
						params: { addressId: address.id }
					})
				}
			>
				<View style={styles.cardHeader}>
					<Text style={styles.cardTitle}>{address.title}</Text>
					<View style={styles.cardActions}>
						<TouchableOpacity style={styles.actionButton} onPress={() => handleToggleFavorite(address)}>
							<Ionicons
								name={address.is_favorite ? 'star' : 'star-outline'}
								size={22}
								color={address.is_favorite ? colors.primary.light : colors.text.secondary}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(address)}>
							<Ionicons name='pencil' size={22} color={colors.text.secondary} />
						</TouchableOpacity>
						<TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(address.id)}>
							<Ionicons name='trash-outline' size={22} color={colors.danger.light} />
						</TouchableOpacity>
					</View>
				</View>
				<Text style={styles.addressText}>{address.address}</Text>
				<View style={styles.dateContainer}>
					<View style={styles.dateItem}>
						<Ionicons name='calendar-outline' size={16} color={colors.text.secondary} style={styles.dateIcon} />
						<Text style={styles.dateLabel}>Oluşturulma:</Text>
						<Text style={styles.dateText}>{formatDate(address.created_at)}</Text>
					</View>
					<View style={styles.dateItem}>
						<Ionicons name='time-outline' size={16} color={colors.text.secondary} style={styles.dateIcon} />
						<Text style={styles.dateLabel}>Düzenleme:</Text>
						<Text style={styles.dateText}>{formatDate(address.updated_at)}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.header}>
				<Text style={styles.title}>Adres Defteri</Text>
				<TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
					<LinearGradient colors={['#1A1A1A', '#333333']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addButtonGradient}>
						<Ionicons name='add' size={24} color='#fff' />
					</LinearGradient>
				</TouchableOpacity>
			</View>

			<View style={styles.tabContainer}>
				<TouchableOpacity style={[styles.tab, activeTab === 'all' && styles.activeTab]} onPress={() => setActiveTab('all')}>
					<Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Tüm Adresler</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.tab, activeTab === 'favorites' && styles.activeTab]} onPress={() => setActiveTab('favorites')}>
					<Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>Favoriler</Text>
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
				{activeTab === 'all' ? addresses.map(renderAddressCard) : favorites.map(renderAddressCard)}

				{((activeTab === 'all' && addresses.length === 0) || (activeTab === 'favorites' && favorites.length === 0)) && (
					<View style={styles.emptyContainer}>
						<Ionicons name={activeTab === 'all' ? 'location-outline' : 'star-outline'} size={48} color={colors.text.secondary} />
						<Text style={styles.emptyText}>{activeTab === 'all' ? 'Henüz adres eklenmemiş' : 'Favori adresiniz bulunmuyor'}</Text>
					</View>
				)}
			</ScrollView>

			{isLoading && <LoadingOverlay visible={true} />}
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
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 16
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: colors.text.primary
	},
	scrollView: {
		flex: 1,
		backgroundColor: '#fff'
	},
	welcomeScrollContent: {
		flexGrow: 1,
		paddingBottom: 24
	},
	welcomeContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	},
	iconContainer: {
		marginBottom: 24
	},
	iconBackground: {
		width: 96,
		height: 96,
		borderRadius: 48,
		alignItems: 'center',
		justifyContent: 'center',
		...Platform.select({
			ios: {
				shadowColor: colors.primary.light,
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.2,
				shadowRadius: 8
			},
			android: {
				elevation: 8
			}
		})
	},
	welcomeTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.text.primary,
		marginBottom: 12,
		textAlign: 'center'
	},
	welcomeDescription: {
		fontSize: 15,
		color: colors.text.secondary,
		textAlign: 'center',
		lineHeight: 22,
		marginBottom: 32,
		paddingHorizontal: 20
	},
	features: {
		width: '100%',
		gap: 12,
		marginBottom: 32
	},
	featureItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F9FAFB',
		padding: 16,
		borderRadius: 12,
		gap: 12
	},
	featureText: {
		fontSize: 15,
		color: colors.text.primary,
		fontWeight: '500'
	},
	addButton: {
		borderRadius: 12,
		overflow: 'hidden'
	},
	addButtonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		gap: 8,
		borderRadius: 12
	},
	addButtonText: {
		fontSize: 15,
		fontWeight: '600',
		color: '#fff'
	},
	tabContainer: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		marginBottom: 12,
		gap: 8
	},
	tab: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 12,
		backgroundColor: '#F3F4F6'
	},
	activeTab: {
		backgroundColor: colors.primary.light
	},
	tabText: {
		textAlign: 'center',
		fontSize: 15,
		color: colors.text.secondary,
		fontWeight: '600'
	},
	activeTabText: {
		color: '#fff'
	},
	content: {
		flex: 1,
		paddingHorizontal: 20
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#E5E7EB',
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4
			},
			android: {
				elevation: 3
			}
		})
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text.primary,
		flex: 1
	},
	cardActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4
	},
	actionButton: {
		padding: 8,
		borderRadius: 8
	},
	addressText: {
		fontSize: 14,
		color: colors.text.secondary,
		lineHeight: 20,
		marginBottom: 12
	},
	dateContainer: {
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#E5E7EB',
		gap: 8
	},
	dateItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6
	},
	dateIcon: {
		marginRight: 6
	},
	dateLabel: {
		fontSize: 12,
		color: colors.text.secondary,
		flex: 0.3
	},
	dateText: {
		fontSize: 12,
		color: colors.text.primary,
		flex: 0.7
	},
	emptyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 40,
		backgroundColor: '#F9FAFB',
		borderRadius: 16,
		marginTop: 12
	},
	emptyText: {
		marginTop: 12,
		fontSize: 15,
		color: colors.text.secondary,
		textAlign: 'center'
	}
});
