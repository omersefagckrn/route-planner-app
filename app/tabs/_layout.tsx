import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: '#fff',
					borderTopWidth: 1,
					borderTopColor: '#E5E7EB',
					height: Platform.OS === 'ios' ? 85 : 65,
					paddingBottom: Platform.OS === 'ios' ? 30 : 10,
					paddingTop: 10
				},
				tabBarActiveTintColor: '#1A1A1A',
				tabBarInactiveTintColor: '#9CA3AF'
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Ana Sayfa',
					tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
				}}
			/>
			<Tabs.Screen
				name='routes'
				options={{
					title: 'Rotalar',
					tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? 'map' : 'map-outline'} size={24} color={color} />
				}}
			/>
			<Tabs.Screen
				name='address-book'
				options={{
					title: 'Adresler',
					tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} size={24} color={color} />
				}}
			/>
			<Tabs.Screen
				name='settings'
				options={{
					title: 'Ayarlar',
					tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
				}}
			/>
		</Tabs>
	);
}
