import { Platform } from 'react-native';

export const colors = {
	primary: {
		light: '#333333',
		dark: '#1A1A1A'
	},
	secondary: {
		light: '#666666',
		dark: '#4D4D4D'
	},
	danger: {
		light: '#FF3B30',
		dark: '#D70015'
	},
	text: {
		primary: '#1A1A1A',
		secondary: '#666666',
		error: '#FF3B30'
	},
	background: {
		primary: '#F8F8F8',
		error: '#FFF5F5'
	},
	border: {
		default: '#E6E6E6',
		error: '#FF3B30'
	}
};

export const gradients = {
	primary: ['#1A1A1A', '#333333'],
	secondary: ['#666666', '#4D4D4D'],
	danger: ['#FF3B30', '#D70015']
};

export const shadows = {
	small: Platform.select({
		ios: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.1,
			shadowRadius: 2
		},
		android: {
			elevation: 2
		}
	}),
	medium: Platform.select({
		ios: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 3 },
			shadowOpacity: 0.15,
			shadowRadius: 6
		},
		android: {
			elevation: 4
		}
	}),
	large: Platform.select({
		ios: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 6 },
			shadowOpacity: 0.2,
			shadowRadius: 8
		},
		android: {
			elevation: 8
		}
	})
};
