import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: { backgroundColor: '#fff' },
				tabBarActiveTintColor: '#6366F1',
				tabBarInactiveTintColor: '#999',
				headerShown: false
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Ana Sayfa',
					tabBarIcon: ({ color, size }) => <Ionicons name='home-outline' size={size} color={color} />
				}}
			/>
			<Tabs.Screen
				name='routes'
				options={{
					title: 'Rotalar',
					tabBarIcon: ({ color, size }) => <Ionicons name='map-outline' size={size} color={color} />
				}}
			/>
			<Tabs.Screen
				name='address-book'
				options={{
					title: 'Adres Defteri',
					tabBarIcon: ({ color, size }) => <Ionicons name='book-outline' size={size} color={color} />
				}}
			/>
			<Tabs.Screen
				name='settings'
				options={{
					title: 'Ayarlar',
					tabBarIcon: ({ color, size }) => <Ionicons name='settings-outline' size={size} color={color} />
				}}
			/>
		</Tabs>
	);
}
