import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { checkFirstLaunch, setFirstLaunch } from '../utils/routeUtils';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../lib/theme';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
	useEffect(() => {
		checkFirstLaunch();
	}, []);

	const handleStart = () => {
		router.replace('/tabs');
		setFirstLaunch();
	};

	return (
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
			<View style={styles.header}>
				<LinearGradient colors={[colors.primary.light, colors.primary.dark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGradient}>
					<Animated.View entering={FadeInDown.delay(200).duration(1000)} style={styles.logoContainer}>
						<Ionicons name='map' size={80} color='#fff' />
						<Text style={styles.appName}>Route Master</Text>
						<Text style={styles.appSlogan}>Rotanı planla, yolculuğunu kolaylaştır</Text>
					</Animated.View>
				</LinearGradient>
			</View>

			<View style={styles.content}>
				<Animated.View entering={FadeInDown.delay(400).duration(1000)} style={styles.section}>
					<View style={styles.sectionHeader}>
						<Ionicons name='flash-outline' size={32} color={colors.primary.light} />
						<Text style={styles.sectionTitle}>Hızlı ve Kolay</Text>
					</View>
					<Text style={styles.sectionDescription}>Saniyeler içinde rotanızı planlayın, adreslerinizi kaydedin ve en verimli güzergahı bulun.</Text>
				</Animated.View>

				<Animated.View entering={FadeInDown.delay(600).duration(1000)} style={styles.section}>
					<View style={styles.sectionHeader}>
						<Ionicons name='bookmark-outline' size={32} color={colors.primary.light} />
						<Text style={styles.sectionTitle}>Favori Adresler</Text>
					</View>
					<Text style={styles.sectionDescription}>Sık kullandığınız adresleri kaydedin, favorilerinize ekleyin ve hızlıca erişin.</Text>
				</Animated.View>

				<Animated.View entering={FadeInDown.delay(800).duration(1000)} style={styles.section}>
					<View style={styles.sectionHeader}>
						<Ionicons name='shield-checkmark-outline' size={32} color={colors.primary.light} />
						<Text style={styles.sectionTitle}>Güvenli ve Özel</Text>
					</View>
					<Text style={styles.sectionDescription}>Verileriniz güvenle saklanır, kişisel bilgileriniz şifrelenir ve sadece size özel kalır.</Text>
				</Animated.View>

				<Animated.View entering={FadeInDown.delay(1000).duration(1000)} style={styles.section}>
					<View style={styles.sectionHeader}>
						<Ionicons name='sync-outline' size={32} color={colors.primary.light} />
						<Text style={styles.sectionTitle}>Otomatik Senkronizasyon</Text>
					</View>
					<Text style={styles.sectionDescription}>Tüm cihazlarınızda güncel verilerinize erişin, kesintisiz deneyim yaşayın.</Text>
				</Animated.View>

				<Animated.View entering={FadeInDown.delay(1200).duration(1000)} style={styles.ctaContainer}>
					<TouchableOpacity style={styles.startButton} onPress={handleStart}>
						<LinearGradient
							colors={[colors.primary.light, colors.primary.dark]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={styles.buttonGradient}
						>
							<Text style={styles.buttonText}>Hemen Başla</Text>
							<Ionicons name='arrow-forward' size={24} color='#fff' />
						</LinearGradient>
					</TouchableOpacity>
					<Text style={styles.disclaimer}>Devam ederek kullanım koşullarını ve gizlilik politikasını kabul etmiş olursunuz.</Text>
				</Animated.View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	header: {
		height: height * 0.4,
		backgroundColor: colors.primary.light
	},
	headerGradient: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	logoContainer: {
		alignItems: 'center'
	},
	appName: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#fff',
		marginTop: 16
	},
	appSlogan: {
		fontSize: 16,
		color: 'rgba(255, 255, 255, 0.9)',
		marginTop: 8,
		textAlign: 'center'
	},
	content: {
		padding: 24,
		paddingTop: 32
	},
	section: {
		marginBottom: 32,
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 20,
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
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
		gap: 12
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
		color: colors.text.primary
	},
	sectionDescription: {
		fontSize: 16,
		lineHeight: 24,
		color: colors.text.secondary
	},
	ctaContainer: {
		alignItems: 'center',
		marginTop: 8,
		marginBottom: 32
	},
	startButton: {
		width: '100%',
		borderRadius: 16,
		overflow: 'hidden',
		marginBottom: 16,
		...Platform.select({
			ios: {
				shadowColor: colors.primary.dark,
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.2,
				shadowRadius: 8
			},
			android: {
				elevation: 8
			}
		})
	},
	buttonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 20,
		gap: 8
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600'
	},
	disclaimer: {
		fontSize: 13,
		color: colors.text.secondary,
		textAlign: 'center'
	}
});
