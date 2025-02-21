import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Platform, ActivityIndicator, TextInput, ScrollView, Keyboard } from 'react-native';
import { useCallback, useRef, useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { colors, shadows } from '../../lib/theme';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const MAP_HEIGHT = height * 0.6;

const INITIAL_REGION = {
	latitude: 41.0082,
	longitude: 28.9784,
	latitudeDelta: 0.0922,
	longitudeDelta: 0.0421
};

export default function MapPickerModal() {
	const mapRef = useRef<MapView>(null);
	const inputRef = useRef<TextInput>(null);
	const params = useLocalSearchParams();
	const isEditMode = params.editMode === 'true';
	const addressId = params.id;
	const initialLatitude = params.currentLatitude ? parseFloat(params.currentLatitude as string) : undefined;
	const initialLongitude = params.currentLongitude ? parseFloat(params.currentLongitude as string) : undefined;
	const initialAddress = params.currentAddress as string | undefined;

	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<Location.LocationGeocodedAddress[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<{
		latitude: number;
		longitude: number;
		address?: string;
	} | null>(
		initialLatitude && initialLongitude
			? {
					latitude: initialLatitude,
					longitude: initialLongitude,
					address: initialAddress
			  }
			: null
	);

	const [loading, setLoading] = useState(false);
	const [addressLoading, setAddressLoading] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState('');

	useEffect(() => {
		const getInitialLocation = async () => {
			try {
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status === 'granted') {
					const location = await Location.getCurrentPositionAsync({
						accuracy: Location.Accuracy.Balanced
					});

					if (!initialLatitude && !initialLongitude) {
						const newRegion = {
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
							latitudeDelta: 0.01,
							longitudeDelta: 0.01
						};
						mapRef.current?.animateToRegion(newRegion, 1000);
					}
				}
			} catch (error) {
				console.error('Error getting location:', error);
			}
		};

		getInitialLocation();
	}, [initialLatitude, initialLongitude]);

	useEffect(() => {
		const searchAddress = async () => {
			if (searchQuery.trim().length < 3) {
				setSearchResults([]);
				return;
			}

			try {
				const results = await Location.geocodeAsync(searchQuery);
				if (results.length > 0) {
					const addresses = await Promise.all(
						results.slice(0, 5).map(async (result) => {
							const address = await Location.reverseGeocodeAsync({
								latitude: result.latitude,
								longitude: result.longitude
							});
							return address[0];
						})
					);
					setSearchResults(addresses.filter(Boolean));
				}
			} catch (error) {
				console.log('Error searching addresses:', error);
			}
		};

		const debounce = setTimeout(searchAddress, 500);
		return () => clearTimeout(debounce);
	}, [searchQuery]);

	const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
		try {
			setAddressLoading(true);
			setLoadingMessage('Adres bilgileri alınıyor...');
			const result = await Location.reverseGeocodeAsync({
				latitude,
				longitude
			});

			if (result && result.length > 0) {
				const address = result[0];
				const addressString = [address.street, address.streetNumber, address.district, address.subregion, address.city, address.country].filter(Boolean).join(', ');

				return addressString;
			}
			return '';
		} catch (error) {
			console.log('Error getting address:', error);
			return '';
		} finally {
			setAddressLoading(false);
			setLoadingMessage('');
		}
	};

	const updateLocationWithAddress = async (latitude: number, longitude: number) => {
		const address = await getAddressFromCoordinates(latitude, longitude);
		setSelectedLocation({
			latitude,
			longitude,
			address
		});
	};

	const animateToLocation = (latitude: number, longitude: number) => {
		mapRef.current?.animateToRegion(
			{
				latitude,
				longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01
			},
			500
		);
	};

	const getCurrentLocation = async () => {
		try {
			setLoading(true);
			setLoadingMessage('Konumunuz bulunuyor...');

			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setLoadingMessage('Konum izni reddedildi');
				setTimeout(() => setLoadingMessage(''), 2000);
				return;
			}

			const location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.High
			});

			setLoadingMessage('Adres bilgileri alınıyor...');
			await updateLocationWithAddress(location.coords.latitude, location.coords.longitude);
			animateToLocation(location.coords.latitude, location.coords.longitude);
		} catch (error) {
			console.log('Error getting location:', error);
			setLoadingMessage('Konum alınamadı');
			setTimeout(() => setLoadingMessage(''), 2000);
		} finally {
			setLoading(false);
		}
	};

	const handleMapPress = useCallback(async (event: any) => {
		const { coordinate } = event.nativeEvent;
		await updateLocationWithAddress(coordinate.latitude, coordinate.longitude);
		animateToLocation(coordinate.latitude, coordinate.longitude);
	}, []);

	const handleConfirm = () => {
		if (!selectedLocation) return;

		if (isEditMode) {
			router.push({
				pathname: '/(modals)/edit-address',
				params: {
					id: addressId,
					latitude: selectedLocation.latitude.toString(),
					longitude: selectedLocation.longitude.toString(),
					address: encodeURIComponent(selectedLocation.address || '')
				}
			});
		} else {
			router.push({
				pathname: '/(modals)/add-address',
				params: {
					latitude: selectedLocation.latitude.toString(),
					longitude: selectedLocation.longitude.toString(),
					address: encodeURIComponent(selectedLocation.address || '')
				}
			});
		}
	};

	const handleSelectSearchResult = async (address: Location.LocationGeocodedAddress) => {
		try {
			setLoading(true);
			setSearchResults([]);
			setSearchQuery('');
			Keyboard.dismiss();
			inputRef.current?.blur();

			const results = await Location.geocodeAsync([address.street, address.streetNumber, address.city, address.country].filter(Boolean).join(', '));

			if (results.length > 0) {
				const { latitude, longitude } = results[0];
				await updateLocationWithAddress(latitude, longitude);
				animateToLocation(latitude, longitude);
			}
		} catch (error) {
			console.log('Error selecting address:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name='close' size={24} color={colors.text.primary} />
				</TouchableOpacity>
				<Text style={styles.title}>{isEditMode ? 'Konumu Düzenle' : 'Konum Seç'}</Text>
				<View style={styles.backButton} />
			</View>

			<View style={styles.searchContainer}>
				<View style={styles.searchInputContainer}>
					<Ionicons name='search' size={20} color={colors.text.secondary} style={styles.searchIcon} />
					<TextInput
						ref={inputRef}
						style={styles.searchInput}
						placeholder='Adres ara...'
						value={searchQuery}
						onChangeText={setSearchQuery}
						placeholderTextColor={colors.text.secondary}
						returnKeyType='search'
						onSubmitEditing={() => {
							Keyboard.dismiss();
							inputRef.current?.blur();
						}}
						enablesReturnKeyAutomatically
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity
							style={styles.clearButton}
							onPress={() => {
								setSearchQuery('');
								Keyboard.dismiss();
								inputRef.current?.blur();
							}}
						>
							<Ionicons name='close-circle' size={20} color={colors.text.secondary} />
						</TouchableOpacity>
					)}
				</View>

				{searchResults.length > 0 && (
					<ScrollView
						style={styles.searchResults}
						keyboardShouldPersistTaps='never'
						keyboardDismissMode='on-drag'
						onScrollBeginDrag={() => {
							Keyboard.dismiss();
							inputRef.current?.blur();
						}}
					>
						{searchResults.map((result, index) => (
							<TouchableOpacity key={index} style={styles.searchResultItem} onPress={() => handleSelectSearchResult(result)}>
								<Ionicons name='location' size={20} color='#1A1A1A' style={styles.resultIcon} />
								<View style={styles.resultTextContainer}>
									<Text style={styles.resultTitle}>{[result.street, result.streetNumber].filter(Boolean).join(' ')}</Text>
									<Text style={styles.resultSubtitle}>
										{[result.district, result.city, result.country].filter(Boolean).join(', ')}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
				)}
			</View>

			<View style={styles.mapContainer}>
				<MapView
					ref={mapRef}
					style={styles.map}
					initialRegion={INITIAL_REGION}
					onPress={handleMapPress}
					showsUserLocation
					showsMyLocationButton={false}
					showsCompass={false}
					rotateEnabled={false}
				>
					{selectedLocation && <Marker coordinate={selectedLocation} pinColor='#1A1A1A' />}
				</MapView>

				<TouchableOpacity style={[styles.currentLocationButton, loading && styles.disabledButton]} onPress={getCurrentLocation} disabled={loading}>
					{loading ? <ActivityIndicator color={colors.primary.light} /> : <Ionicons name='locate' size={24} color='#1A1A1A' />}
				</TouchableOpacity>

				{loadingMessage && (
					<View style={styles.loadingContainer}>
						<Text style={styles.loadingText}>{loadingMessage}</Text>
					</View>
				)}
			</View>

			{selectedLocation && (
				<LinearGradient colors={['rgba(255,255,255,0.9)', '#fff']} style={styles.footer} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.5 }}>
					<View style={styles.locationInfo}>
						<View style={styles.addressContainer}>
							<Ionicons name='location' size={24} color='#1A1A1A' style={styles.addressIcon} />
							<View style={styles.addressTextContainer}>
								{selectedLocation.address && (
									<Text style={styles.addressText} numberOfLines={2}>
										{selectedLocation.address}
									</Text>
								)}
								<Text style={styles.coordinatesText}>
									{selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
								</Text>
							</View>
						</View>
						<TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
							<LinearGradient
								colors={[colors.primary.light, colors.primary.dark]}
								style={styles.confirmButtonGradient}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
							>
								<Text style={styles.confirmButtonText}>{isEditMode ? 'Konumu Güncelle' : 'Konumu Seç'}</Text>
								<Ionicons name='chevron-forward' size={24} color='#fff' />
							</LinearGradient>
						</TouchableOpacity>
					</View>
				</LinearGradient>
			)}
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
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.default,
		backgroundColor: '#fff',
		...shadows.small
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 20
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text.primary
	},
	searchContainer: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 100 : 80,
		left: 20,
		right: 20,
		zIndex: 1,
		marginBottom: 16,
		backgroundColor: 'transparent'
	},
	searchInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: colors.border.default,
		...shadows.medium
	},
	searchIcon: {
		marginLeft: 16
	},
	searchInput: {
		flex: 1,
		height: 50,
		paddingHorizontal: 12,
		fontSize: 16,
		color: colors.text.primary
	},
	clearButton: {
		padding: 12
	},
	searchResults: {
		maxHeight: 300,
		backgroundColor: '#fff',
		borderRadius: 16,
		marginTop: 8,
		borderWidth: 1,
		borderColor: colors.border.default,
		...shadows.medium,
		zIndex: 2
	},
	searchResultItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.default
	},
	resultIcon: {
		marginRight: 12
	},
	resultTextContainer: {
		flex: 1
	},
	resultTitle: {
		fontSize: 16,
		fontWeight: '500',
		color: colors.text.primary,
		marginBottom: 4
	},
	resultSubtitle: {
		fontSize: 14,
		color: colors.text.secondary
	},
	mapContainer: {
		height: MAP_HEIGHT,
		position: 'relative',
		marginTop: 12
	},
	map: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 24,
		margin: 20
	},
	currentLocationButton: {
		position: 'absolute',
		right: 16,
		bottom: 16,
		backgroundColor: '#fff',
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		...shadows.medium
	},
	disabledButton: {
		opacity: 0.7
	},
	loadingContainer: {
		position: 'absolute',
		top: 70,
		left: 20,
		right: 20,
		backgroundColor: colors.primary.light,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		...shadows.medium,
		zIndex: 3
	},
	loadingText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
		textAlign: 'center'
	},
	footer: {
		padding: 20,
		paddingTop: 24,
		backgroundColor: '#fff',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		...shadows.medium
	},
	locationInfo: {
		gap: 12
	},
	addressContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		backgroundColor: colors.background.primary,
		padding: 12,
		borderRadius: 12
	},
	addressIcon: {
		marginRight: 12,
		marginTop: 2
	},
	addressTextContainer: {
		flex: 1
	},
	addressText: {
		fontSize: 16,
		color: colors.text.primary,
		marginBottom: 4,
		fontWeight: '500'
	},
	coordinatesText: {
		color: colors.text.secondary,
		fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
		fontSize: 12
	},
	confirmButton: {
		borderRadius: 16,
		overflow: 'hidden',
		...shadows.medium
	},
	confirmButtonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
		paddingHorizontal: 24,
		backgroundColor: '#1A1A1A'
	},
	confirmButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
		marginRight: 8
	}
});
