import { Platform } from 'react-native';

export const colors = {
	primary: {
		light: '#6366F1',
		dark: '#4C47DB'
	},
	secondary: {
		light: '#4B5563',
		dark: '#374151'
	},
	danger: {
		light: '#EF4444',
		dark: '#DC2626'
	},
	text: {
		primary: '#1F2937',
		secondary: '#4B5563',
		error: '#EF4444'
	},
	background: {
		primary: '#F9FAFB',
		error: '#FEF2F2'
	},
	border: {
		default: '#E5E7EB',
		error: '#EF4444'
	}
};

export const gradients = {
	primary: [colors.primary.dark, colors.primary.light],
	secondary: [colors.secondary.light, colors.secondary.dark],
	danger: [colors.danger.light, colors.danger.dark]
};

export const shadows = {
	small: Platform.select({
		ios: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.05,
			shadowRadius: 2
		},
		android: {
			elevation: 1
		}
	}),
	medium: Platform.select({
		ios: {
			shadowColor: colors.primary.light,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.2,
			shadowRadius: 8
		},
		android: {
			elevation: 8
		}
	}),
	large: Platform.select({
		ios: {
			shadowColor: colors.primary.light,
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: 0.15,
			shadowRadius: 16
		},
		android: {
			elevation: 8
		}
	})
};
