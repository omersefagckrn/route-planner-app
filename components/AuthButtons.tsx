import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const AuthButtons = () => {
	return (
		<View style={styles.container}>
			<Link href='/auth/login' asChild>
				<TouchableOpacity style={styles.loginButton}>
					<Ionicons name='log-in-outline' size={20} color='#1A1A1A' />
					<Text style={styles.loginButtonText}>Giriş Yap</Text>
				</TouchableOpacity>
			</Link>

			<Link href='/auth/register' asChild>
				<TouchableOpacity style={styles.registerButton}>
					<Ionicons name='person-add-outline' size={20} color='#fff' />
					<Text style={styles.registerButtonText}>Kayıt Ol</Text>
				</TouchableOpacity>
			</Link>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 12,
		padding: 20
	},
	loginButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#fff',
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#1A1A1A'
	},
	loginButtonText: {
		color: '#1A1A1A',
		fontSize: 14,
		fontWeight: '600'
	},
	registerButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#1A1A1A',
		paddingVertical: 12,
		borderRadius: 12
	},
	registerButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '600'
	}
});
