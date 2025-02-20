import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { useEffect, useRef, useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { getCurrentUser } from '../../store/features/authSlice';
import Animated, { useAnimatedScrollHandler, useSharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const slides = [
	{
		id: 1,
		image: 'https://images.unsplash.com/photo-1532939163844-547f958e91b4?w=800',
		title: 'Rotanızı Kolayca Planlayın',
		description: 'Sürüş deneyiminizi optimize edin, zamandan tasarruf edin'
	},
	{
		id: 2,
		image: 'https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?w=800',
		title: 'Favori Rotalarınızı Kaydedin',
		description: 'Sık kullandığınız rotaları tek dokunuşla erişin'
	},
	{
		id: 3,
		image: 'https://images.unsplash.com/photo-1581262177000-8139a463e531?w=800',
		title: 'Gerçek Zamanlı Takip',
		description: 'Rotanızı canlı olarak takip edin ve güncellemelerden haberdar olun'
	}
];

const features = [
	{
		icon: 'map-outline',
		title: 'Akıllı Rota Optimizasyonu',
		description: 'En verimli rotayı otomatik olarak hesaplar'
	},
	{
		icon: 'time-outline',
		title: 'Zaman Tahmini',
		description: 'Varış sürenizi hassas şekilde hesaplar'
	},
	{
		icon: 'location-outline',
		title: 'Çoklu Durak',
		description: 'Birden fazla durağı optimize eder'
	},
	{
		icon: 'notifications-outline',
		title: 'Anlık Bildirimler',
		description: 'Trafik ve rota güncellemelerini alın'
	}
];

const SlideItem = ({ item, index, scrollX }: { item: any; index: number; scrollX: any }) => {
	const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

	const animatedStyle = useAnimatedStyle(() => {
		const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8]);
		const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5]);

		return {
			transform: [{ scale }],
			opacity
		};
	});

	return (
		<View style={styles.slideItem}>
			<Animated.View style={[styles.slideImageContainer, animatedStyle]}>
				<Image source={{ uri: item.image }} style={styles.slideImage} />
				<LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.slideGradient}>
					<Text style={styles.slideTitle}>{item.title}</Text>
					<Text style={styles.slideDescription}>{item.description}</Text>
				</LinearGradient>
			</Animated.View>
		</View>
	);
};

export default function HomeScreen() {
	const dispatch = useDispatch<AppDispatch>();
	const { user, isLoading } = useSelector((state: RootState) => state.auth);
	const [activeSlide, setActiveSlide] = useState(0);
	const scrollX = useSharedValue(0);
	const flatListRef = useRef(null);

	useEffect(() => {
		dispatch(getCurrentUser());
	}, [dispatch]);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = event.contentOffset.x;
		}
	});

	const renderSlideItem = useCallback(({ item, index }: { item: any; index: number }) => <SlideItem item={item} index={index} scrollX={scrollX} />, [scrollX]);

	if (isLoading) {
		return (
			<SafeAreaView edges={['top']} style={styles.container}>
				<LoadingOverlay visible={true} message='Yükleniyor...' />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView edges={['top']} style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				{user ? (
					<View>
						<LinearGradient colors={['#4C47DB', '#6366F1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.userHeader}>
							<View style={styles.userInfo}>
								<View style={styles.userAvatar}>
									<Text style={styles.userInitials}>
										{user.first_name[0]}
										{user.last_name[0]}
									</Text>
								</View>
								<View style={styles.userDetails}>
									<Text style={styles.welcomeText}>Hoş geldin,</Text>
									<Text style={styles.userName}>
										{user.first_name} {user.last_name}
									</Text>
								</View>
							</View>

							<TouchableOpacity style={styles.createRouteButton}>
								<Ionicons name='add-circle-outline' size={24} color='#fff' />
								<Text style={styles.createRouteText}>Yeni Rota Oluştur</Text>
							</TouchableOpacity>
						</LinearGradient>
					</View>
				) : null}

				{/* Slider Bölümü */}
				<View style={styles.sliderContainer}>
					<Animated.FlatList
						ref={flatListRef}
						data={slides}
						renderItem={renderSlideItem}
						keyExtractor={(item) => item.id.toString()}
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						onScroll={scrollHandler}
						onMomentumScrollEnd={(event) => {
							const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
							setActiveSlide(newIndex);
						}}
					/>

					<View style={styles.paginationContainer}>
						{slides.map((_, index) => (
							<View
								key={index}
								style={[
									styles.paginationDot,
									{
										backgroundColor: activeSlide === index ? '#6366F1' : '#E5E7EB',
										width: activeSlide === index ? 24 : 8
									}
								]}
							/>
						))}
					</View>
				</View>

				{/* Özellikler Grid */}
				<View style={styles.featuresContainer}>
					<Text style={styles.sectionTitle}>Özellikler</Text>
					<View style={styles.featuresGrid}>
						{features.map((feature, index) => (
							<View key={index} style={styles.featureCard}>
								<View style={styles.featureIconContainer}>
									<Ionicons name={feature.icon as any} size={24} color='#6366F1' />
								</View>
								<Text style={styles.featureTitle}>{feature.title}</Text>
								<Text style={styles.featureDescription}>{feature.description}</Text>
							</View>
						))}
					</View>
				</View>

				{/* FAQ Bölümü */}
				<View style={styles.faqContainer}>
					<Text style={styles.sectionTitle}>Sıkça Sorulan Sorular</Text>
					<View style={styles.faqList}>
						<TouchableOpacity style={styles.faqItem}>
							<View style={styles.faqHeader}>
								<View style={styles.faqIcon}>
									<Ionicons name='map-outline' size={24} color='#6366F1' />
								</View>
								<View style={styles.faqText}>
									<Text style={styles.faqQuestion}>Rota nasıl oluşturabilirim?</Text>
									<Text style={styles.faqAnswer}>
										Rotalar sekmesine giderek yeni rota oluştur butonuna tıklayın ve varış noktalarını belirleyin.
									</Text>
								</View>
							</View>
						</TouchableOpacity>

						<TouchableOpacity style={styles.faqItem}>
							<View style={styles.faqHeader}>
								<View style={styles.faqIcon}>
									<Ionicons name='bookmark-outline' size={24} color='#6366F1' />
								</View>
								<View style={styles.faqText}>
									<Text style={styles.faqQuestion}>Adreslerimi nasıl kaydedebilirim?</Text>
									<Text style={styles.faqAnswer}>
										Adres defteri sekmesinden sık kullandığınız adresleri kolayca ekleyebilir ve düzenleyebilirsiniz.
									</Text>
								</View>
							</View>
						</TouchableOpacity>

						<TouchableOpacity style={styles.faqItem}>
							<View style={styles.faqHeader}>
								<View style={styles.faqIcon}>
									<Ionicons name='time-outline' size={24} color='#6366F1' />
								</View>
								<View style={styles.faqText}>
									<Text style={styles.faqQuestion}>Teslimat süresini nasıl hesaplayabilirim?</Text>
									<Text style={styles.faqAnswer}>
										Rota oluştururken sistem otomatik olarak tahmini varış sürelerini hesaplar ve size en optimize
										rotayı sunar.
									</Text>
								</View>
							</View>
						</TouchableOpacity>

						<TouchableOpacity style={styles.faqItem}>
							<View style={styles.faqHeader}>
								<View style={styles.faqIcon}>
									<Ionicons name='notifications-outline' size={24} color='#6366F1' />
								</View>
								<View style={styles.faqText}>
									<Text style={styles.faqQuestion}>Bildirimler nasıl çalışır?</Text>
									<Text style={styles.faqAnswer}>
										Rota güncellemeleri, trafik durumu ve önemli değişiklikler hakkında anlık bildirimler alırsınız.
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	scrollView: {
		flex: 1
	},
	userHeader: {
		padding: 20
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20
	},
	userAvatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16
	},
	userInitials: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff'
	},
	userDetails: {
		flex: 1
	},
	welcomeText: {
		fontSize: 14,
		color: 'rgba(255, 255, 255, 0.9)'
	},
	userName: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff'
	},
	createRouteButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		padding: 12,
		borderRadius: 12,
		gap: 8
	},
	createRouteText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600'
	},
	sliderContainer: {
		height: 300,
		marginTop: 20
	},
	slideItem: {
		width,
		height: 250
	},
	slideImageContainer: {
		flex: 1,
		margin: 10,
		borderRadius: 20,
		overflow: 'hidden'
	},
	slideImage: {
		width: '100%',
		height: '100%'
	},
	slideGradient: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 20
	},
	slideTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 8
	},
	slideDescription: {
		fontSize: 16,
		color: 'rgba(255, 255, 255, 0.9)'
	},
	paginationContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 16
	},
	paginationDot: {
		height: 8,
		borderRadius: 4,
		marginHorizontal: 4,
		backgroundColor: '#E5E7EB'
	},
	featuresContainer: {
		padding: 20
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#1F2937',
		marginBottom: 16
	},
	featuresGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16
	},
	featureCard: {
		width: (width - 56) / 2,
		backgroundColor: '#F8FAFC',
		padding: 16,
		borderRadius: 16,
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
	featureIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(99, 102, 241, 0.1)',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12
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
	faqContainer: {
		padding: 20,
		paddingBottom: 40
	},
	faqList: {
		gap: 12
	},
	faqItem: {
		backgroundColor: '#F8FAFC',
		borderRadius: 16,
		padding: 16,
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
	faqHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 12
	},
	faqIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(99, 102, 241, 0.1)',
		alignItems: 'center',
		justifyContent: 'center'
	},
	faqText: {
		flex: 1
	},
	faqQuestion: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1F2937',
		marginBottom: 4
	},
	faqAnswer: {
		fontSize: 14,
		color: '#6B7280',
		lineHeight: 20
	}
});
