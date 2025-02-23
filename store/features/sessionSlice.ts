import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { Platform } from 'react-native';

interface AppSession {
	id: string;
	user_id: string;
	created_at: string;
	device_info: string;
	last_activity: string;
	is_current: boolean;
}

interface SessionState {
	sessions: AppSession[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: SessionState = {
	sessions: [],
	status: 'idle',
	error: null
};

export const fetchActiveSessions = createAsyncThunk('sessions/fetchActiveSessions', async (userId: string) => {
	try {
		const {
			data: { session },
			error: sessionError
		} = await supabase.auth.getSession();

		if (sessionError) throw sessionError;
		if (!session) return [];

		// Cihaz bilgisini hazırla
		let deviceInfo = 'Web Tarayıcı';
		if (Platform.OS === 'ios') {
			deviceInfo = `iPhone/iPad (iOS ${Platform.Version})`;
		} else if (Platform.OS === 'android') {
			deviceInfo = `Android Cihaz (v${Platform.Version})`;
		}

		// Son aktivite zamanını hesapla
		const sessionTime = new Date((session.expires_at || Date.now() / 1000) * 1000 - 3600000);
		const timeDiff = Math.floor((Date.now() - sessionTime.getTime()) / 1000 / 60);

		let lastActivity;
		if (timeDiff < 1) {
			lastActivity = 'Az önce';
		} else if (timeDiff < 60) {
			lastActivity = `${timeDiff} dakika önce`;
		} else if (timeDiff < 1440) {
			lastActivity = `${Math.floor(timeDiff / 60)} saat önce`;
		} else {
			lastActivity = sessionTime.toLocaleDateString('tr-TR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		}

		return [
			{
				id: session.access_token,
				user_id: userId,
				created_at: sessionTime.toISOString(),
				device_info: deviceInfo,
				last_activity: lastActivity,
				is_current: true
			}
		];
	} catch (error) {
		console.error('Oturum bilgileri alınırken hata:', error);
		throw error;
	}
});

export const terminateSession = createAsyncThunk('sessions/terminateSession', async (_, { dispatch }) => {
	try {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		dispatch({ type: 'auth/clearUser' });
		return null;
	} catch (error) {
		console.error('Oturum sonlandırılırken hata:', error);
		throw error;
	}
});

const sessionSlice = createSlice({
	name: 'sessions',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchActiveSessions.pending, (state) => {
			state.status = 'loading';
		})
			.addCase(fetchActiveSessions.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.sessions = action.payload;
				state.error = null;
			})
			.addCase(fetchActiveSessions.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Oturum bilgileri yüklenemedi';
			})
			.addCase(terminateSession.fulfilled, (state) => {
				state.sessions = [];
			});
	}
});

export default sessionSlice.reducer;
