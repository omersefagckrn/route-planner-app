import { View, Text, StyleSheet } from 'react-native';

export default function RoutesScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Rotalar</Text>
			<Text style={styles.subtitle}>Rotalarınızı buradan yönetin</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10
	},
	subtitle: {
		fontSize: 16,
		color: '#666'
	}
});
