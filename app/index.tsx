import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { checkFirstLaunch, setFirstLaunch } from '../utils/routeUtils';

const { width, height } = Dimensions.get('window');

// Animation constants
const ANIMATION_DURATION = 1000;
const BUTTON_SCALE = 0.95;

export default function OnboardingScreen() {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(50)).current;
	const [isPressed, setIsPressed] = useState(false);
	const scaleAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		checkFirstLaunch();
		startAnimations();
	}, []);

	const startAnimations = () => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: ANIMATION_DURATION,
				useNativeDriver: true
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: ANIMATION_DURATION,
				useNativeDriver: true
			})
		]).start();
	};

	const handlePressIn = () => {
		setIsPressed(true);
		Animated.spring(scaleAnim, {
			toValue: BUTTON_SCALE,
			useNativeDriver: true
		}).start();
	};

	const handlePressOut = () => {
		setIsPressed(false);
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true
		}).start();
	};

	const handleComplete = async () => {
		const success = await setFirstLaunch();
		if (success) {
			router.replace('/tabs');
		}
	};

	return (
		<View style={styles.container}>
			<Animated.View
				style={[
					styles.content,
					{
						opacity: fadeAnim,
						transform: [{ translateY: slideAnim }]
					}
				]}
			>
				<View style={styles.iconContainer}>
					<Ionicons name='map' size={100} color='#007AFF' />
				</View>
				<Text style={styles.title}>Hoş Geldiniz</Text>
				<Text style={styles.description}>Rota planlama uygulamasına hoş geldiniz. Hızlı ve kolay bir şekilde rotalarınızı planlayın.</Text>

				<Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
					<TouchableOpacity style={styles.buttonWrapper} onPress={handleComplete} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1}>
						<LinearGradient
							colors={['#4C47DB', '#6366F1']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={[styles.button, isPressed && styles.buttonPressed]}
						>
							<View style={styles.buttonContent}>
								<Text style={styles.buttonText}>Keşfetmeye Başla</Text>
								<View style={styles.iconWrapper}>
									<Ionicons name='arrow-forward' size={22} color='#fff' />
								</View>
							</View>
						</LinearGradient>
					</TouchableOpacity>
				</Animated.View>

				<View style={styles.features}>
					<View style={styles.featureItem}>
						<Ionicons name='navigate-circle-outline' size={24} color='#6366F1' />
						<Text style={styles.featureText}>Kolay Rota Planlama</Text>
					</View>
					<View style={styles.featureItem}>
						<Ionicons name='time-outline' size={24} color='#6366F1' />
						<Text style={styles.featureText}>Zaman Tasarrufu</Text>
					</View>
					<View style={styles.featureItem}>
						<Ionicons name='location-outline' size={24} color='#6366F1' />
						<Text style={styles.featureText}>Adres Kaydetme</Text>
					</View>
				</View>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 20,
		justifyContent: 'center'
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		maxHeight: height * 0.8,
		paddingVertical: height * 0.05
	},
	iconContainer: {
		marginBottom: height * 0.03,
		padding: 20,
		borderRadius: 30,
		backgroundColor: 'rgba(99, 102, 241, 0.1)'
	},
	title: {
		fontSize: Math.min(32, width * 0.08),
		fontWeight: 'bold',
		marginBottom: height * 0.02,
		textAlign: 'center',
		color: '#1a1a1a'
	},
	description: {
		fontSize: Math.min(16, width * 0.04),
		textAlign: 'center',
		color: '#666',
		marginBottom: height * 0.03,
		lineHeight: 24,
		paddingHorizontal: width * 0.05
	},
	features: {
		width: '100%',
		marginTop: height * 0.03
	},
	featureItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: height * 0.015,
		backgroundColor: 'rgba(99, 102, 241, 0.05)',
		padding: 15,
		borderRadius: 12
	},
	featureText: {
		marginLeft: 15,
		fontSize: Math.min(16, width * 0.04),
		color: '#333'
	},
	buttonContainer: {
		width: '100%',
		marginTop: height * 0.03
	},
	buttonWrapper: {
		borderRadius: 16,
		overflow: 'hidden',
		...Platform.select({
			ios: {
				shadowColor: '#6366F1',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.3,
				shadowRadius: 8
			},
			android: {
				elevation: 8
			}
		})
	},
	button: {
		borderRadius: 16,
		paddingVertical: Math.min(18, height * 0.025)
	},
	buttonPressed: {
		opacity: 0.9
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20
	},
	buttonText: {
		color: '#fff',
		fontSize: Math.min(18, width * 0.045),
		fontWeight: '600',
		marginRight: 8
	},
	iconWrapper: {
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		borderRadius: 12,
		padding: 4,
		marginLeft: 8
	}
});
