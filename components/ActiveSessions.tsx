import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/lib/theme';
import { AppDispatch, RootState } from '@/store/rootStore';
import { fetchActiveSessions, terminateSession } from '@/store/features/sessionSlice';
import { router } from 'expo-router';

export function ActiveSessions({ userId }: { userId: string }) {
	const dispatch = useDispatch<AppDispatch>();
	const { sessions, status } = useSelector((state: RootState) => state.sessions);

	useEffect(() => {
		if (userId) {
			dispatch(fetchActiveSessions(userId));
		}
	}, [userId]);

	const handleTerminateSession = async () => {
		Alert.alert('Oturumu Sonlandır', 'Oturumunuzu sonlandırmak istediğinize emin misiniz? Bu işlem sizi uygulamadan çıkaracaktır.', [
			{ text: 'İptal', style: 'cancel' },
			{
				text: 'Sonlandır',
				style: 'destructive',
				onPress: async () => {
					try {
						await dispatch(terminateSession()).unwrap();
						router.replace('/');
					} catch (error) {
						console.error('Oturum sonlandırma hatası:', error);
						Alert.alert('Hata', 'Oturum sonlandırılırken bir hata oluştu');
					}
				}
			}
		]);
	};

	if (status === 'loading') {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator color={colors.primary.light} size='small' />
				<Text style={styles.loadingText}>Oturum bilgileri yükleniyor...</Text>
			</View>
		);
	}

	const currentSession = sessions[0];

	if (!currentSession) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.sectionTitle}>Aktif Oturum</Text>
			<View style={styles.sessionCard}>
				<View style={styles.sessionInfo}>
					<View style={styles.sessionHeader}>
						<View style={styles.deviceInfo}>
							<Ionicons
								name={currentSession.device_info.toLowerCase().includes('web') ? 'desktop' : 'phone-portrait'}
								size={20}
								color={colors.text.primary}
							/>
							<Text style={styles.deviceText}>{currentSession.device_info}</Text>
						</View>
						<TouchableOpacity style={styles.terminateButton} onPress={handleTerminateSession}>
							<Text style={styles.terminateButtonText}>Sonlandır</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.sessionDetails}>
						<View style={styles.detailItem}>
							<Ionicons name='time-outline' size={16} color={colors.text.secondary} />
							<Text style={styles.detailText}>Son aktivite: {currentSession.last_activity}</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 8
	},
	loadingContainer: {
		padding: 20,
		alignItems: 'center',
		gap: 8
	},
	loadingText: {
		color: colors.text.secondary,
		fontSize: 14
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1F2937',
		marginBottom: 16
	},
	sessionCard: {
		backgroundColor: colors.background.primary,
		borderRadius: 12,
		padding: 16,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: colors.border.default
	},
	sessionInfo: {
		gap: 12
	},
	sessionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	deviceInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	deviceText: {
		fontSize: 15,
		fontWeight: '500',
		color: colors.text.primary
	},
	sessionDetails: {
		gap: 8
	},
	detailItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	detailText: {
		fontSize: 14,
		color: colors.text.secondary
	},
	terminateButton: {
		backgroundColor: colors.danger.light,
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 6
	},
	terminateButtonText: {
		color: '#fff',
		fontSize: 13,
		fontWeight: '500'
	}
});
