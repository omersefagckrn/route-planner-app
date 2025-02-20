export default {
	name: 'routing-app',
	slug: 'routing-app',
	version: '1.0.0',
	orientation: 'portrait',
	userInterfaceStyle: 'light',
	scheme: 'routing-app',
	newArchEnabled: true,
	assetBundlePatterns: ['**/*'],
	ios: {
		supportsTablet: true
	},
	android: {
		adaptiveIcon: {
			backgroundColor: '#ffffff'
		}
	},
	web: {
		favicon: './assets/favicon.png'
	},
	plugins: ['expo-router'],
	experiments: {
		typedRoutes: true,
		tsconfigPaths: true
	},
	extra: {
		supabaseUrl: process.env.SUPABASE_URL,
		supabaseAnonKey: process.env.SUPABASE_ANON_KEY
	}
};
