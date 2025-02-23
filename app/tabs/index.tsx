import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Dimensions, Image, Pressable, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedScrollHandler, useSharedValue, interpolate, useAnimatedStyle, withSpring, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../store/features/authSlice';
import { OverlayLoading } from '../../components/OverlayLoading';
import type { RootState, AppDispatch } from '@/store/rootStore';

const { width, height } = Dimensions.get('window');

const slides = [
	{
		id: 1,
		image: 'https://images.unsplash.com/photo-1532939163844-547f958e91b4?w=800',
		title: 'Rotanızı Kolayca Planlayın',
		description: 'Sürüş deneyiminizi optimize edin'
	},
	{
		id: 2,
		image: 'https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?w=800',
		title: 'Favori Rotalarınızı Kaydedin',
		description: 'Sık kullandığınız rotalara hızlıca erişin'
	},
	{
		id: 3,
		image: 'https://images.unsplash.com/photo-1581262177000-8139a463e531?w=800',
		title: 'Gerçek Zamanlı Takip',
		description: 'Rotanızı canlı olarak takip edin'
	}
];

const features = [
	{
		icon: 'map-outline',
		title: 'Akıllı Rota',
		description: 'En verimli rotayı otomatik hesaplar',
		color: '#4F46E5'
	},
	{
		icon: 'time-outline',
		title: 'Zaman Tahmini',
		description: 'Varış sürenizi hassas hesaplar',
		color: '#7C3AED'
	},
	{
		icon: 'location-outline',
		title: 'Çoklu Durak',
		description: 'Birden fazla durağı optimize eder',
		color: '#EC4899'
	},
	{
		icon: 'analytics-outline',
		title: 'İstatistikler',
		description: 'Detaylı rota analizleri sunar',
		color: '#F59E0B'
	}
];

const stats = [
	{ title: 'Aktif Kullanıcı', value: '10K+', icon: 'people-outline', color: '#4F46E5' },
	{ title: 'Günlük Rota', value: '50K+', icon: 'map-outline', color: '#7C3AED' },
	{ title: 'Kayıtlı Adres', value: '100K+', icon: 'location-outline', color: '#EC4899' },
	{ title: 'Mutlu Müşteri', value: '95%', icon: 'happy-outline', color: '#F59E0B' }
];

const benefits = [
	{
		title: 'Zaman Tasarrufu',
		description: "Optimum rotalar ile %30'a varan zaman tasarrufu",
		icon: 'timer-outline',
		color: '#4F46E5'
	},
	{
		title: 'Yakıt Tasarrufu',
		description: 'Akıllı rota planlaması ile yakıt tasarrufu',
		icon: 'leaf-outline',
		color: '#7C3AED'
	},
	{
		title: 'Kolay Kullanım',
		description: 'Sezgisel arayüz ile hızlı öğrenme',
		icon: 'hand-left-outline',
		color: '#EC4899'
	}
];

interface Feature {
	icon: string;
	title: string;
	description: string;
	color: string;
}

interface Stat {
	title: string;
	value: string;
	icon: string;
	color: string;
}

interface Benefit {
	title: string;
	description: string;
	icon: string;
	color: string;
}

interface Section {
	type: 'header' | 'slider' | 'features' | 'stats' | 'benefits';
	data: any[];
}

const UserHeader = React.memo(({ user, onCreateRoute }: any) => {
	const userInitials = useMemo(() => {
		if (!user?.user_metadata?.first_name && !user?.user_metadata?.last_name) return '??';
		const firstInitial = user.user_metadata.first_name?.[0] || '';
		const lastInitial = user.user_metadata.last_name?.[0] || '';
		return `${firstInitial}${lastInitial}`.toUpperCase();
	}, [user?.user_metadata?.first_name, user?.user_metadata?.last_name]);

	const userName = useMemo(() => {
		return user?.user_metadata?.first_name || 'Kullanıcı';
	}, [user?.user_metadata?.first_name]);

	const fullName = useMemo(() => {
		const firstName = user?.user_metadata?.first_name || '';
		const lastName = user?.user_metadata?.last_name || '';
		return `${firstName} ${lastName}`.trim();
	}, [user?.user_metadata?.first_name, user?.user_metadata?.last_name]);

	return (
		<LinearGradient colors={['#1A1A1A', '#333333']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.userHeader}>
			<View style={styles.userInfo}>
				<View style={styles.userAvatar}>
					<Text style={styles.userInitials}>{userInitials}</Text>
				</View>
				<View style={styles.userDetails}>
					<Text style={styles.welcomeText}>Hoş Geldin, {userName}</Text>
					<Text style={styles.nameText}>{fullName}</Text>
				</View>
			</View>

			<TouchableOpacity onPress={onCreateRoute} style={styles.createRouteButton}>
				<Ionicons name='add-circle-outline' size={24} color='#fff' />
				<Text style={styles.createRouteText}>Yeni Rota Oluştur</Text>
			</TouchableOpacity>
		</LinearGradient>
	);
});

const SlideItem = React.memo(({ item, index, scrollX }: any) => {
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
				<Image source={{ uri: item.image }} style={styles.slideImage} resizeMode='cover' />
				<LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.slideGradient} pointerEvents='none'>
					<Text style={styles.slideTitle}>{item.title}</Text>
					<Text style={styles.slideDescription}>{item.description}</Text>
				</LinearGradient>
			</Animated.View>
		</View>
	);
});

const FeatureCard = React.memo(({ item }: any) => {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }]
	}));

	const handlePressIn = useCallback(() => {
		scale.value = withSpring(0.95);
	}, []);

	const handlePressOut = useCallback(() => {
		scale.value = withSpring(1);
	}, []);

	return (
		<Animated.View style={[styles.featureCard, animatedStyle]}>
			<Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={[styles.featureCardContent, { backgroundColor: `${item.color}10` }]}>
				<View style={[styles.featureIconContainer, { backgroundColor: `${item.color}20` }]}>
					<Ionicons name={item.icon as any} size={24} color={item.color} />
				</View>
				<Text style={styles.featureTitle}>{item.title}</Text>
				<Text style={styles.featureDescription}>{item.description}</Text>
			</Pressable>
		</Animated.View>
	);
});

const StatCard = React.memo(({ item }: any) => {
	return (
		<Animated.View style={[styles.statCard, { backgroundColor: `${item.color}10` }]}>
			<View style={[styles.statIconContainer, { backgroundColor: `${item.color}20` }]}>
				<Ionicons name={item.icon as any} size={24} color={item.color} />
			</View>
			<Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
			<Text style={styles.statTitle}>{item.title}</Text>
		</Animated.View>
	);
});

const BenefitCard = React.memo(({ item }: any) => {
	return (
		<View style={styles.benefitCard}>
			<LinearGradient colors={[`${item.color}20`, `${item.color}10`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.benefitGradient}>
				<View style={[styles.benefitIconContainer, { backgroundColor: `${item.color}30` }]}>
					<Ionicons name={item.icon as any} size={32} color={item.color} />
				</View>
				<Text style={styles.benefitTitle}>{item.title}</Text>
				<Text style={styles.benefitDescription}>{item.description}</Text>
			</LinearGradient>
		</View>
	);
});

export default function HomeScreen() {
	const dispatch = useDispatch<AppDispatch>();
	const { user, isLoading } = useSelector((state: RootState) => state.auth);
	const scrollX = useSharedValue(0);
	const flatListRef = useRef(null);
	const router = useRouter();

	const handleCreateRoute = useCallback(() => {
		router.push('/tabs/address-book');
	}, [router]);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = event.contentOffset.x;
		}
	});

	useEffect(() => {
		dispatch(getCurrentUser());
	}, [dispatch]);

	const sections = useMemo(
		() => [
			{ type: 'header', data: [user] },
			{ type: 'slider', data: slides },
			{ type: 'features', data: features },
			{ type: 'stats', data: stats },
			{ type: 'benefits', data: benefits }
		],
		[user]
	);

	const renderItem = useCallback(
		({ item }: { item: Section }) => {
			switch (item.type) {
				case 'header':
					return item.data[0] && <UserHeader user={item.data[0]} onCreateRoute={handleCreateRoute} />;
				case 'slider':
					return (
						<View style={styles.sliderContainer}>
							<Animated.FlatList
								horizontal
								data={item.data}
								renderItem={({ item: slideItem, index: slideIndex }) => (
									<SlideItem item={slideItem} index={slideIndex} scrollX={scrollX} />
								)}
								keyExtractor={(slideItem) => slideItem.id.toString()}
								pagingEnabled
								showsHorizontalScrollIndicator={false}
								onScroll={scrollHandler}
								scrollEventThrottle={16}
								removeClippedSubviews={true}
								initialNumToRender={1}
								maxToRenderPerBatch={2}
								windowSize={2}
								getItemLayout={(_, index) => ({
									length: width,
									offset: width * index,
									index
								})}
							/>
							<View style={styles.paginationContainer}>
								{item.data.map((_, index) => {
									const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
									const dotWidth = interpolate(scrollX.value, inputRange, [8, 16, 8]);
									const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3]);
									return (
										<Animated.View
											key={index}
											style={[
												styles.paginationDot,
												{
													width: dotWidth,
													opacity
												}
											]}
										/>
									);
								})}
							</View>
						</View>
					);
				case 'features':
					return (
						<View style={styles.featuresContainer}>
							<Animated.Text entering={FadeIn} style={styles.sectionTitle}>
								Özellikler
							</Animated.Text>
							<View style={styles.featuresGrid}>
								{item.data.map((feature: Feature) => (
									<FeatureCard key={feature.title} item={feature} />
								))}
							</View>
						</View>
					);
				case 'stats':
					return (
						<View style={styles.statsContainer}>
							<Animated.Text entering={FadeIn} style={styles.sectionTitle}>
								Rakamlarla Biz
							</Animated.Text>
							<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
								{item.data.map((stat: Stat) => (
									<StatCard key={stat.title} item={stat} />
								))}
							</ScrollView>
						</View>
					);
				case 'benefits':
					return (
						<View style={styles.benefitsContainer}>
							<Animated.Text entering={FadeIn} style={styles.sectionTitle}>
								Avantajlar
							</Animated.Text>
							<View style={styles.benefitsGrid}>
								{item.data.map((benefit: Benefit) => (
									<BenefitCard key={benefit.title} item={benefit} />
								))}
							</View>
						</View>
					);
				default:
					return null;
			}
		},
		[handleCreateRoute, scrollHandler, scrollX]
	);

	if (isLoading) {
		return (
			<SafeAreaView edges={['top']} style={styles.container}>
				<OverlayLoading visible={true} message='Yükleniyor...' />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView edges={['top']} style={styles.container}>
			<FlatList
				data={sections as any}
				renderItem={renderItem}
				keyExtractor={(item) => item.type}
				showsVerticalScrollIndicator={false}
				removeClippedSubviews={true}
				scrollEventThrottle={16}
			/>
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
	nameText: {
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
		marginTop: 15
	},
	slideItem: {
		width,
		height: 250
	},
	slideImageContainer: {
		flex: 1,
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
	featuresContainer: {
		paddingBottom: 20,
		paddingRight: 20,
		paddingLeft: 20
	},
	featuresGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: 16,
		marginTop: 16
	},
	featureCard: {
		width: (width - 56) / 2
	},
	featureCardContent: {
		padding: 20,
		borderRadius: 20,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.1,
				shadowRadius: 8
			},
			android: {
				elevation: 4
			}
		})
	},
	featureIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16
	},
	featureTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1F2937',
		marginBottom: 8
	},
	featureDescription: {
		fontSize: 14,
		color: '#6B7280',
		lineHeight: 20
	},
	statsContainer: {
		paddingVertical: 32,
		paddingHorizontal: 20
	},
	statsScroll: {
		gap: 16,
		paddingRight: 20
	},
	statCard: {
		padding: 20,
		borderRadius: 20,
		alignItems: 'center',
		width: width * 0.4,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.1,
				shadowRadius: 8
			},
			android: {
				elevation: 4
			}
		})
	},
	statIconContainer: {
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12
	},
	statValue: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 4
	},
	statTitle: {
		fontSize: 14,
		color: '#6B7280',
		textAlign: 'center'
	},
	benefitsContainer: {
		padding: 20,
		paddingTop: 0
	},
	benefitsGrid: {
		gap: 16,
		marginTop: 16
	},
	benefitCard: {
		borderRadius: 20,
		overflow: 'hidden',
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.1,
				shadowRadius: 8
			},
			android: {
				elevation: 4
			}
		})
	},
	benefitGradient: {
		padding: 24
	},
	benefitIconContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16
	},
	benefitTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#1F2937',
		marginBottom: 8
	},
	benefitDescription: {
		fontSize: 16,
		color: '#6B7280',
		lineHeight: 24
	},
	ctaContainer: {
		margin: 20,
		marginTop: 32,
		borderRadius: 24,
		overflow: 'hidden'
	},
	ctaGradient: {
		padding: 32,
		alignItems: 'center'
	},
	ctaTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 12
	},
	ctaDescription: {
		fontSize: 16,
		color: 'rgba(255, 255, 255, 0.9)',
		textAlign: 'center',
		lineHeight: 24
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1F2937',
		marginBottom: 8
	},
	sliderContentContainer: {
		padding: 10
	},
	paginationContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		marginTop: -32,
		height: 32
	},
	paginationDot: {
		height: 8,
		backgroundColor: '#fff',
		borderRadius: 4
	}
});
