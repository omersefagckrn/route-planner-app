import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Animated, ScrollView, ViewStyle, Linking, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { colors, shadows } from '../../lib/theme';
import { RootState } from '../../store/rootStore';
import { Address } from '../../types/address';
import { BtnAuth } from '../../components/BtnAuth';
import { fetchAddresses } from '../../store/features/addressSlice';
import { ModalAlert } from '../../components/ModalAlert';
import { InputField } from '../../components/InputField';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	} as ViewStyle,
	map: {
		flex: 1
	} as ViewStyle,
	markerContainer: {
		backgroundColor: '#1A1A1A',
		padding: 8,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.2,
				shadowRadius: 4
			},
			android: {
				elevation: 4
			}
		})
	},
	favoriteMarker: {
		backgroundColor: '#1A1A1A',
		padding: 8,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: '#FFD700',
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.25,
				shadowRadius: 4
			},
			android: {
				elevation: 5
			}
		})
	},
	calloutContainer: {
		backgroundColor: '#1A1A1A',
		padding: 10,
		borderRadius: 12,
		minWidth: 120,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.2,
				shadowRadius: 8
			},
			android: {
				elevation: 6
			}
		})
	},
	calloutTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: '#FFFFFF',
		textAlign: 'center',
		paddingVertical: 2
	},
	infoCard: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 60 : 30,
		left: 20,
		right: 20,
		zIndex: 1,
		backgroundColor: '#fff',
		borderRadius: 24,
		marginBottom: 24,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 8
			},
			android: {
				elevation: 4
			}
		})
	},
	infoCardContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16
	},
	infoItem: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	},
	infoIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 12,
		backgroundColor: `${colors.primary.light}10`,
		alignItems: 'center',
		justifyContent: 'center'
	},
	infoTextContainer: {
		flex: 1
	},
	infoValue: {
		fontSize: 20,
		fontWeight: '600',
		color: colors.text.primary,
		marginBottom: 2
	},
	infoLabel: {
		fontSize: 13,
		color: colors.text.secondary
	},
	divider: {
		width: 1,
		height: 40,
		backgroundColor: '#E5E7EB',
		marginHorizontal: 8
	},
	detailContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		maxHeight: height * 0.7,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		overflow: 'hidden',
		...shadows.large
	},
	detailContent: {
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: 12
	},
	detailHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.default
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
	},
	detailTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: colors.text.primary,
		marginRight: 8
	},
	favoriteIcon: {
		marginTop: 2
	},
	closeButton: {
		padding: 8
	},
	detailScroll: {
		padding: 20
	},
	addressCard: {
		backgroundColor: colors.background.primary,
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		...shadows.small
	},
	addressHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12
	},
	addressLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.text.primary,
		marginLeft: 8
	},
	addressText: {
		fontSize: 15,
		color: colors.text.primary,
		lineHeight: 22
	},
	coordinatesContainer: {
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 8,
		marginTop: 12
	},
	coordinatesText: {
		fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
		fontSize: 12,
		color: colors.text.secondary,
		textAlign: 'center'
	},
	dateCard: {
		backgroundColor: colors.background.primary,
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		gap: 12,
		...shadows.small
	},
	dateItem: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	dateTextContainer: {
		marginLeft: 12
	},
	dateLabel: {
		fontSize: 12,
		color: colors.text.secondary
	},
	dateText: {
		fontSize: 14,
		color: colors.text.primary,
		fontWeight: '500'
	},
	actionButtons: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: Platform.OS === 'ios' ? 34 : 20
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		borderRadius: 12,
		gap: 8,
		...shadows.small
	},
	editButton: {
		backgroundColor: colors.background.primary,
		borderWidth: 1,
		borderColor: colors.border.default
	},
	routeButton: {
		backgroundColor: colors.primary.light
	},
	actionButtonText: {
		fontSize: 15,
		fontWeight: '600',
		color: colors.text.primary
	},
	routeButtonText: {
		fontSize: 15,
		fontWeight: '600',
		color: '#fff'
	},
	welcomeContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#fff'
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
		...shadows.medium
	},
	welcomeTitle: {
		fontSize: 28,
		fontWeight: 'bold',
		color: colors.text.primary,
		marginBottom: 12,
		textAlign: 'center'
	},
	welcomeDescription: {
		fontSize: 16,
		color: colors.text.secondary,
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 32,
		paddingHorizontal: 20
	},
	authButtons: {
		width: '100%',
		gap: 12
	},
	authButton: {
		borderRadius: 16,
		overflow: 'hidden',
		...shadows.medium
	},
	authButtonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
		gap: 8
	},
	authButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600'
	},
	registerButton: {
		paddingVertical: 16,
		alignItems: 'center'
	},
	registerButtonText: {
		color: colors.primary.light,
		fontSize: 16,
		fontWeight: '600'
	},
	activeTab: {
		backgroundColor: '#1A1A1A'
	},
	activeTabText: {
		color: '#fff'
	},
	noAuthContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#fff'
	},
	noAuthContent: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#fff'
	},
	noAuthTitle: {
		fontSize: 28,
		fontWeight: 'bold',
		color: colors.text.primary,
		marginBottom: 12,
		textAlign: 'center'
	},
	noAuthDescription: {
		fontSize: 16,
		color: colors.text.secondary,
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 32,
		paddingHorizontal: 20
	},
	routeInfoCard: {
		backgroundColor: colors.background.primary,
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 12,
		...shadows.small
	},
	routeInfoItem: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	routeInfoText: {
		flex: 1
	},
	routeInfoLabel: {
		fontSize: 12,
		color: colors.text.secondary,
		marginBottom: 2
	},
	routeInfoValue: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.text.primary
	},
	searchContainer: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 130 : 100,
		left: 20,
		right: 20,
		zIndex: 1,
		marginTop: 20
	},
	searchInput: {
		backgroundColor: '#fff',
		borderRadius: 16,
		overflow: 'hidden',
		padding: 12,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.15,
				shadowRadius: 8
			},
			android: {
				elevation: 4
			}
		})
	},
	disabledInput: {
		backgroundColor: '#F5F5F5',
		opacity: 0.8
	},
	locationButton: {
		position: 'absolute',
		bottom: Platform.OS === 'ios' ? 40 : 30,
		right: 20,
		borderRadius: 12,
		overflow: 'hidden',
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.15,
				shadowRadius: 8
			},
			android: {
				elevation: 4
			}
		})
	},
	locationButtonGradient: {
		width: 44,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center'
	},
	searchResults: {
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
		borderRadius: 12,
		marginTop: 4,
		maxHeight: height * 0.4,
		overflow: 'hidden',
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.15,
				shadowRadius: 8
			},
			android: {
				elevation: 4
			}
		})
	},
	resultsList: {
		padding: 8,
		backgroundColor: '#fff'
	},
	resultItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 8,
		backgroundColor: '#fff'
	},
	resultIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#F3F4F6',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12
	},
	resultInfo: {
		flex: 1,
		marginRight: 8
	},
	resultTitle: {
		fontSize: 15,
		fontWeight: '600',
		color: colors.text.primary
	},
	resultAddress: {
		fontSize: 13,
		color: colors.text.secondary
	},
	searchMessage: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		gap: 8
	},
	messageText: {
		fontSize: 14,
		color: colors.text.secondary
	}
});

const mapStyle = [
	{
		featureType: 'water',
		elementType: 'geometry',
		stylers: [{ color: '#E3F2FD' }]
	},
	{
		featureType: 'landscape',
		elementType: 'geometry',
		stylers: [{ color: '#FAFAFA' }]
	},
	{
		featureType: 'road',
		elementType: 'geometry',
		stylers: [{ color: '#FFFFFF' }]
	},
	{
		featureType: 'road',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#E0E0E0' }]
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry',
		stylers: [{ color: '#E0E0E0' }]
	},
	{
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [{ color: '#F5F5F5' }]
	},
	{
		featureType: 'poi.park',
		elementType: 'geometry',
		stylers: [{ color: '#E8F5E9' }]
	},
	{
		featureType: 'transit.station',
		elementType: 'geometry',
		stylers: [{ color: '#EEEEEE' }]
	},
	{
		featureType: 'administrative',
		elementType: 'geometry.stroke',
		stylers: [{ color: '#BDBDBD' }]
	},
	{
		featureType: 'road',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#757575' }]
	},
	{
		featureType: 'road',
		elementType: 'labels.text.stroke',
		stylers: [{ color: '#FFFFFF' }]
	},
	{
		featureType: 'poi',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#757575' }]
	},
	{
		featureType: 'water',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#90CAF9' }]
	}
];

// Memoize edilmiş marker komponenti
const MapMarker = memo(({ address, onPress }: { address: Address; onPress: (address: Address) => void }) => (
	<Marker
		key={address.id}
		coordinate={{
			latitude: address.latitude,
			longitude: address.longitude
		}}
		onPress={() => onPress(address)}
	>
		<View style={[styles.markerContainer, address.is_favorite && styles.favoriteMarker]}>
			<Ionicons name={address.is_favorite ? 'star' : 'location'} size={18} color='#FFFFFF' />
		</View>
		<Callout tooltip>
			<View style={styles.calloutContainer}>
				<Text style={styles.calloutTitle}>{address.title}</Text>
			</View>
		</Callout>
	</Marker>
));

// Memoize edilmiş info card komponenti
const InfoCard = memo(({ addresses }: { addresses: Address[] }) => {
	const favoriteCount = useMemo(() => addresses.filter((addr) => addr.is_favorite).length, [addresses]);

	return (
		<View style={styles.infoCard}>
			<View style={styles.infoCardContent}>
				<View style={styles.infoItem}>
					<View style={styles.infoIconContainer}>
						<Ionicons name='location' size={20} color={colors.primary.light} />
					</View>
					<View style={styles.infoTextContainer}>
						<Text style={styles.infoValue}>{addresses.length}</Text>
						<Text style={styles.infoLabel}>Toplam Adres</Text>
					</View>
				</View>
				<View style={styles.divider} />
				<View style={styles.infoItem}>
					<View style={styles.infoIconContainer}>
						<Ionicons name='star' size={20} color={colors.primary.light} />
					</View>
					<View style={styles.infoTextContainer}>
						<Text style={styles.infoValue}>{favoriteCount}</Text>
						<Text style={styles.infoLabel}>Favori Adresler</Text>
					</View>
				</View>
			</View>
		</View>
	);
});

// Memoize edilmiş route info komponenti
const RouteInfo = memo(({ routeInfo }: { routeInfo: { distance: string; duration: string } }) => (
	<View style={styles.routeInfoCard}>
		<View style={styles.routeInfoItem}>
			<Ionicons name='navigate-outline' size={24} color={colors.primary.light} />
			<View style={styles.routeInfoText}>
				<Text style={styles.routeInfoLabel}>Mesafe</Text>
				<Text style={styles.routeInfoValue}>{routeInfo.distance}</Text>
			</View>
		</View>
		<View style={styles.routeInfoItem}>
			<Ionicons name='time-outline' size={24} color={colors.primary.light} />
			<View style={styles.routeInfoText}>
				<Text style={styles.routeInfoLabel}>Tahmini Süre</Text>
				<Text style={styles.routeInfoValue}>{routeInfo.duration}</Text>
			</View>
		</View>
	</View>
));

export default function RoutesScreen() {
	const dispatch = useDispatch();
	const { addresses, status } = useSelector((state: RootState) => state.address);
	const { user } = useSelector((state: RootState) => state.auth);
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
	const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
	const [isMapReady, setIsMapReady] = useState(false);
	const [initialRegion, setInitialRegion] = useState({
		latitude: 41.0082,
		longitude: 28.9784,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01
	});
	const mapRef = useRef<MapView>(null);
	const scrollViewRef = useRef<ScrollView>(null);
	const params = useLocalSearchParams();
	const slideAnim = useRef(new Animated.Value(height)).current;
	const [showNavigationAlert, setShowNavigationAlert] = useState(false);
	const [navigationDestination, setNavigationDestination] = useState<{ latitude: number; longitude: number } | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredAddresses, setFilteredAddresses] = useState<Address[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showSearchResults, setShowSearchResults] = useState(false);

	// Memoize edilmiş hesaplamalar
	const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
		const R = 6371;
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return (R * c).toFixed(1);
	}, []);

	const calculateRoute = useCallback(
		async (destination: { latitude: number; longitude: number }) => {
			if (!userLocation) return;

			try {
				const distance = calculateDistance(userLocation.coords.latitude, userLocation.coords.longitude, destination.latitude, destination.longitude);

				const duration = ((parseFloat(distance) / 50) * 60).toFixed(0);

				setRouteInfo({
					distance: `${distance} km`,
					duration: `${duration} dakika`
				});
			} catch (error) {
				console.error('Error calculating route:', error);
			}
		},
		[userLocation, calculateDistance]
	);

	const handleMarkerPress = useCallback(
		async (address: Address) => {
			setSelectedAddress(address);
			if (userLocation) {
				await calculateRoute({
					latitude: address.latitude,
					longitude: address.longitude
				});
			}

			mapRef.current?.animateToRegion(
				{
					latitude: address.latitude,
					longitude: address.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01
				},
				500
			);

			Animated.spring(slideAnim, {
				toValue: 0,
				useNativeDriver: true,
				tension: 40,
				friction: 8
			}).start();
		},
		[userLocation, calculateRoute, slideAnim]
	);

	const handleCloseDetail = useCallback(() => {
		Animated.spring(slideAnim, {
			toValue: height,
			useNativeDriver: true
		}).start(() => setSelectedAddress(null));
	}, [slideAnim]);

	const formatDate = useCallback((dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('tr-TR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}, []);

	// Konum izni ve kullanıcı konumu alma - güncellenmiş versiyon
	useEffect(() => {
		let isMounted = true;

		const getLocation = async () => {
			try {
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status === 'granted' && isMounted) {
					const location = await Location.getCurrentPositionAsync({
						accuracy: Location.Accuracy.Balanced
					});
					if (isMounted) {
						setUserLocation(location);
						const newRegion = {
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
							latitudeDelta: 0.01,
							longitudeDelta: 0.01
						};
						setInitialRegion(newRegion);

						// Harita hazırsa konuma git
						if (mapRef.current && isMapReady) {
							mapRef.current.animateToRegion(newRegion, 1000);
						}
					}
				}
			} catch (error) {
				console.error('Error getting location:', error);
			}
		};

		getLocation();

		return () => {
			isMounted = false;
		};
	}, [isMapReady]);

	// URL parametresi ile adres seçimi
	useEffect(() => {
		if (params.addressId) {
			const address = addresses.find((addr) => addr.id === params.addressId);
			if (address) {
				handleMarkerPress(address);
			}
		}
	}, [params.addressId, addresses, handleMarkerPress]);

	// Adresleri yükle - optimize edilmiş versiyon
	useEffect(() => {
		let isMounted = true;

		const loadAddresses = async () => {
			if (user?.id && status === 'idle') {
				try {
					await dispatch(fetchAddresses(user.id) as any);
				} catch (error) {
					console.error('Error loading addresses:', error);
				}
			}
		};

		if (isMounted) {
			loadAddresses();
		}

		return () => {
			isMounted = false;
		};
	}, [dispatch, user, status]);

	// Harita hazır olduğunda çağrılacak
	const onMapReady = useCallback(() => {
		setIsMapReady(true);
		if (userLocation) {
			mapRef.current?.animateToRegion(
				{
					latitude: userLocation.coords.latitude,
					longitude: userLocation.coords.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01
				},
				1000
			);
		}
	}, [userLocation]);

	// Memoize edilmiş marker listesi
	const markers = useMemo(() => {
		if (!isMapReady || !addresses.length) return [];
		return addresses.map((address) => <MapMarker key={address.id} address={address} onPress={handleMarkerPress} />);
	}, [addresses, isMapReady, handleMarkerPress]);

	// Bildirim izinlerini kontrol et
	useEffect(() => {
		const requestNotificationPermissions = async () => {
			try {
				const { status: existingStatus } = await Notifications.getPermissionsAsync();
				let finalStatus = existingStatus;

				if (existingStatus !== 'granted') {
					const { status } = await Notifications.requestPermissionsAsync();
					finalStatus = status;
				}

				if (finalStatus !== 'granted') {
					console.log('Bildirim izni alınamadı!');
				}
			} catch (error) {
				console.error('Bildirim izni alınırken hata:', error);
			}
		};

		requestNotificationPermissions();
	}, []);

	const handleNavigate = useCallback(
		async (destination: { latitude: number; longitude: number }) => {
			if (!userLocation) {
				setShowNavigationAlert(true);
				return;
			}

			setNavigationDestination(destination);
			setShowNavigationAlert(true);
		},
		[userLocation]
	);

	const handleNavigateToMaps = useCallback(
		(mapType: 'apple' | 'google') => {
			if (!userLocation || !navigationDestination) return;

			const { latitude, longitude } = navigationDestination;
			const { latitude: startLat, longitude: startLon } = userLocation.coords;

			const scheme = Platform.select({
				ios: 'maps:',
				android: 'geo:'
			});

			const url = Platform.select({
				ios: `${scheme}?saddr=${startLat},${startLon}&daddr=${latitude},${longitude}`,
				android: `${scheme}?q=${latitude},${longitude}&mode=d`
			});

			const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLon}&destination=${latitude},${longitude}`;

			if (mapType === 'apple') {
				Linking.openURL(url as string);
			} else {
				Linking.openURL(googleMapsUrl);
			}
		},
		[userLocation, navigationDestination]
	);

	// Arama fonksiyonu - geliştirilmiş versiyon
	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query);

			if (!query.trim()) {
				setFilteredAddresses([]);
				setShowSearchResults(false);
				return;
			}

			setIsSearching(true);
			const searchText = query.toLowerCase().trim();

			// Arama işlemi için timeout ekle
			setTimeout(() => {
				const filtered = addresses.filter((address) => address.title.toLowerCase().includes(searchText) || address.address.toLowerCase().includes(searchText));

				setFilteredAddresses(filtered);
				setShowSearchResults(true);
				setIsSearching(false);
			}, 300);
		},
		[addresses]
	);

	// Adrese git fonksiyonu
	const handleAddressSelect = useCallback(
		(address: Address) => {
			setShowSearchResults(false);
			setSearchQuery('');
			handleMarkerPress(address);

			mapRef.current?.animateToRegion(
				{
					latitude: address.latitude,
					longitude: address.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01
				},
				1000
			);
		},
		[handleMarkerPress]
	);

	// Konuma git fonksiyonu
	const goToCurrentLocation = useCallback(async () => {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Konum İzni Gerekli', 'Konumunuza gitmek için konum iznine ihtiyacımız var.', [{ text: 'Tamam' }]);
				return;
			}

			const location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced
			});

			mapRef.current?.animateToRegion(
				{
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01
				},
				1000
			);
		} catch (error) {
			console.error('Konum alınırken hata:', error);
			Alert.alert('Hata', 'Konumunuz alınamadı. Lütfen tekrar deneyin.');
		}
	}, []);

	if (!user) {
		return (
			<View style={styles.container}>
				<View style={styles.noAuthContainer}>
					<View style={styles.noAuthContent}>
						<View style={styles.iconContainer}>
							<LinearGradient colors={['#1A1A1A', '#333333']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.iconBackground}>
								<Ionicons name='map' size={48} color='#fff' />
							</LinearGradient>
						</View>
						<Text style={styles.noAuthTitle}>Rotalarınızı Planlayın</Text>
						<Text style={styles.noAuthDescription}>Rotalarınızı planlamak ve kaydetmek için giriş yapın veya yeni bir hesap oluşturun.</Text>
					</View>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={initialRegion}
				showsUserLocation
				showsMyLocationButton={false}
				showsCompass={false}
				customMapStyle={mapStyle}
				onMapReady={onMapReady}
			>
				{markers}
			</MapView>

			<TouchableOpacity style={styles.locationButton} onPress={goToCurrentLocation}>
				<LinearGradient colors={['#1A1A1A', '#333333']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.locationButtonGradient}>
					<Ionicons name='locate' size={24} color='#fff' />
				</LinearGradient>
			</TouchableOpacity>

			<View style={styles.searchContainer}>
				<InputField
					placeholder={addresses.length === 0 ? 'Önce adres eklemelisiniz' : 'Adres ara...'}
					value={searchQuery}
					onChangeText={handleSearch}
					leftIcon={<Ionicons name='search' size={20} color={addresses.length === 0 ? '#999' : '#666666'} />}
					containerStyle={{
						...styles.searchInput,
						...(addresses.length === 0 ? styles.disabledInput : {})
					}}
					autoCapitalize='none'
					autoCorrect={false}
					editable={addresses.length > 0}
				/>

				{showSearchResults && (
					<View style={styles.searchResults}>
						{isSearching ? (
							<View style={styles.searchMessage}>
								<ActivityIndicator size='small' color={colors.primary.light} />
								<Text style={styles.messageText}>Aranıyor...</Text>
							</View>
						) : filteredAddresses.length === 0 ? (
							<View style={styles.searchMessage}>
								<Ionicons name='alert-circle-outline' size={20} color={colors.text.secondary} />
								<Text style={styles.messageText}>Adres bulunamadı</Text>
							</View>
						) : (
							<ScrollView style={styles.resultsList} keyboardShouldPersistTaps='handled'>
								{filteredAddresses.map((address) => (
									<TouchableOpacity key={address.id} style={styles.resultItem} onPress={() => handleAddressSelect(address)}>
										<View style={styles.resultIcon}>
											<Ionicons
												name={address.is_favorite ? 'star' : 'location'}
												size={20}
												color={address.is_favorite ? colors.primary.light : colors.text.secondary}
											/>
										</View>
										<View style={styles.resultInfo}>
											<Text style={styles.resultTitle}>{address.title}</Text>
											<Text style={styles.resultAddress} numberOfLines={1}>
												{address.address}
											</Text>
										</View>
										<Ionicons name='chevron-forward' size={20} color={colors.text.secondary} />
									</TouchableOpacity>
								))}
							</ScrollView>
						)}
					</View>
				)}
			</View>

			<InfoCard addresses={addresses} />

			{selectedAddress && (
				<Animated.View style={[styles.detailContainer, { transform: [{ translateY: slideAnim }] }]}>
					<LinearGradient colors={['rgba(255,255,255,0.95)', '#fff']} style={styles.detailContent} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.5 }}>
						<View style={styles.detailHeader}>
							<View style={styles.titleContainer}>
								<Text style={styles.detailTitle}>{selectedAddress.title}</Text>
								{selectedAddress.is_favorite && (
									<Ionicons name='star' size={20} color={colors.primary.light} style={styles.favoriteIcon} />
								)}
							</View>
							<TouchableOpacity onPress={handleCloseDetail} style={styles.closeButton}>
								<Ionicons name='close' size={24} color={colors.text.secondary} />
							</TouchableOpacity>
						</View>

						<ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
							{routeInfo && (
								<View style={styles.routeInfoCard}>
									<View style={styles.routeInfoItem}>
										<Ionicons name='navigate-outline' size={24} color={colors.primary.light} />
										<View style={styles.routeInfoText}>
											<Text style={styles.routeInfoLabel}>Mesafe</Text>
											<Text style={styles.routeInfoValue}>{routeInfo.distance}</Text>
										</View>
									</View>
									<View style={styles.routeInfoItem}>
										<Ionicons name='time-outline' size={24} color={colors.primary.light} />
										<View style={styles.routeInfoText}>
											<Text style={styles.routeInfoLabel}>Tahmini Süre</Text>
											<Text style={styles.routeInfoValue}>{routeInfo.duration}</Text>
										</View>
									</View>
								</View>
							)}

							<View style={styles.addressCard}>
								<View style={styles.addressHeader}>
									<Ionicons name='location' size={24} color={colors.primary.light} />
									<Text style={styles.addressLabel}>Adres Bilgileri</Text>
								</View>
								<Text style={styles.addressText}>{selectedAddress.address}</Text>
								<View style={styles.coordinatesContainer}>
									<Text style={styles.coordinatesText}>
										{selectedAddress.latitude.toFixed(6)}, {selectedAddress.longitude.toFixed(6)}
									</Text>
								</View>
							</View>

							<View style={styles.dateCard}>
								<View style={styles.dateItem}>
									<Ionicons name='calendar-outline' size={20} color={colors.text.secondary} />
									<View style={styles.dateTextContainer}>
										<Text style={styles.dateLabel}>Oluşturulma</Text>
										<Text style={styles.dateText}>{formatDate(selectedAddress.created_at)}</Text>
									</View>
								</View>
								<View style={styles.dateItem}>
									<Ionicons name='time-outline' size={20} color={colors.text.secondary} />
									<View style={styles.dateTextContainer}>
										<Text style={styles.dateLabel}>Son Güncelleme</Text>
										<Text style={styles.dateText}>{formatDate(selectedAddress.updated_at)}</Text>
									</View>
								</View>
							</View>

							<View style={styles.actionButtons}>
								<TouchableOpacity
									style={[styles.actionButton, styles.editButton]}
									onPress={() =>
										router.push({
											pathname: '/(modals)/edit-address',
											params: { id: selectedAddress.id }
										})
									}
								>
									<Ionicons name='pencil' size={20} color={colors.text.primary} />
									<Text style={styles.actionButtonText}>Düzenle</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.actionButton, styles.routeButton]}
									onPress={() => {
										if (selectedAddress) {
											handleNavigate({
												latitude: selectedAddress.latitude,
												longitude: selectedAddress.longitude
											});
										}
									}}
								>
									<Ionicons name='navigate' size={20} color='#fff' />
									<Text style={styles.routeButtonText}>Rota Planla</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</LinearGradient>
				</Animated.View>
			)}

			<ModalAlert
				visible={showNavigationAlert}
				title={userLocation ? 'Harita Seçin' : 'Hata'}
				message={userLocation ? 'Hangi harita uygulamasını kullanmak istersiniz?' : 'Konumunuz alınamadı. Lütfen konum izinlerini kontrol edin.'}
				buttons={
					userLocation
						? [
								{
									text: 'Apple Maps',
									icon: 'map',
									style: 'default',
									onPress: () => handleNavigateToMaps('apple')
								},
								{
									text: 'Google Maps',
									icon: 'navigate',
									style: 'primary',
									onPress: () => handleNavigateToMaps('google')
								},
								{
									text: 'İptal',
									style: 'cancel',
									onPress: () => {}
								}
						  ]
						: [
								{
									text: 'Tamam',
									style: 'cancel',
									onPress: () => {}
								}
						  ]
				}
				onClose={() => setShowNavigationAlert(false)}
			/>
		</View>
	);
}
