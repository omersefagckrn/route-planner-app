import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://hkdraijmcipvvjwtaupm.supabase.co';
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZHJhaWptY2lwdnZqd3RhdXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNzkxOTMsImV4cCI6MjA1NDc1NTE5M30.3Q7EfvrieXqtSoT7Q5j2G4l4qYQfPnfSWHkc80XYt-8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		flowType: 'pkce',
		autoRefreshToken: true,
		persistSession: true,
		storage: AsyncStorage
	}
});
