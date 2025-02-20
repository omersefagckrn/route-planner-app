import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { apiService, UserProfile } from '../../services/api';
import { supabase } from '../../lib/supabase';
// Async Thunks
export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }: { email: string; password: string }, { dispatch }) => {
	const { user, error } = await apiService.signIn(email, password);
	if (error) throw error;

	await AsyncStorage.setItem('hasLaunched', 'true');

	Toast.show({
		type: 'success',
		text1: 'Başarılı',
		text2: 'Giriş yapıldı',
		position: 'top',
		visibilityTime: 2000
	});

	router.replace('/tabs');
	return user;
});

export const signUp = createAsyncThunk('auth/signUp', async (userData: { email: string; password: string; firstName: string; lastName: string; phone: string }) => {
	const { user, error } = await apiService.signUp(userData);
	if (error) throw error;

	await AsyncStorage.setItem('hasLaunched', 'true');

	Toast.show({
		type: 'success',
		text1: 'Başarılı',
		text2: 'Kayıt işlemi tamamlandı',
		position: 'top',
		visibilityTime: 2000
	});

	router.replace('/tabs');
	return user;
});

export const signOut = createAsyncThunk('auth/signOut', async (_, { dispatch }) => {
	const { error } = await apiService.signOut();
	if (error) throw error;

	Toast.show({
		type: 'success',
		text1: 'Başarılı',
		text2: 'Çıkış yapıldı',
		position: 'top',
		visibilityTime: 2000
	});

	router.replace('/tabs');
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async ({ userId, updates }: { userId: string; updates: Partial<UserProfile> }, { dispatch }) => {
	const { user, error } = await apiService.updateProfile(userId, updates);
	if (error) throw error;

	Toast.show({
		type: 'success',
		text1: 'Başarılı',
		text2: 'Profil güncellendi',
		position: 'top',
		visibilityTime: 2000
	});

	// Önce router.back() çağrısını yap, sonra kullanıcı bilgilerini güncelle
	router.back();
	await dispatch(getCurrentUser());
	return user;
});

export const updatePassword = createAsyncThunk('auth/updatePassword', async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, { dispatch }) => {
	const { error } = await apiService.updatePassword({ currentPassword, newPassword });
	if (error) throw error;

	Toast.show({
		type: 'success',
		text1: 'Başarılı',
		text2: 'Şifre güncellendi',
		position: 'top',
		visibilityTime: 2000
	});

	// Şifre değiştikten sonra kullanıcı bilgilerini yeniden al
	dispatch(getCurrentUser());
	router.back();
});

export const resetApp = createAsyncThunk('auth/resetApp', async () => {
	try {
		await AsyncStorage.removeItem('hasLaunched');
		Toast.show({
			type: 'success',
			text1: 'Başarılı',
			text2: 'Uygulama sıfırlandı',
			position: 'top',
			visibilityTime: 2000
		});
		router.replace('/');
	} catch (error: any) {
		Toast.show({
			type: 'error',
			text1: 'Hata',
			text2: 'Uygulama sıfırlanırken bir hata oluştu',
			position: 'top',
			visibilityTime: 2000
		});
		throw error;
	}
});

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
	try {
		const {
			data: { user: currentUser }
		} = await supabase.auth.getUser();

		if (!currentUser) {
			return rejectWithValue(null); // Sessiz hata - kullanıcı giriş yapmamış
		}

		const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();

		if (error) throw error;
		if (!profile) throw new Error('Profil bulunamadı');

		return profile;
	} catch (error: any) {
		throw new Error(error.message || 'Kullanıcı bilgileri alınamadı');
	}
});

interface AuthState {
	isLoading: boolean;
	error: string | null;
	user: UserProfile | null;
}

const initialState: AuthState = {
	isLoading: false,
	error: null,
	user: null
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
			state.isLoading = false;
			state.error = null;
		},
		clearError: (state) => {
			state.error = null;
		},
		resetState: () => initialState
	},
	extraReducers: (builder) => {
		builder
			// Get Current User
			.addCase(getCurrentUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getCurrentUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.user = action.payload;
			})
			.addCase(getCurrentUser.rejected, (state, action) => {
				state.isLoading = false;
				// Eğer payload null ise (kullanıcı giriş yapmamış), error mesajı gösterme
				if (action.payload === null) {
					state.error = null;
					state.user = null;
				} else {
					state.error = action.error.message || 'Kullanıcı bilgileri alınamadı';
				}
			})
			// Sign In
			.addCase(signIn.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(signIn.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.user = action.payload;
			})
			.addCase(signIn.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Giriş yapılırken bir hata oluştu';
			})
			// Sign Up
			.addCase(signUp.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(signUp.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.user = action.payload;
			})
			.addCase(signUp.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Kayıt olurken bir hata oluştu';
			})
			// Sign Out
			.addCase(signOut.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(signOut.fulfilled, (state) => {
				return initialState; // State'i tamamen sıfırla
			})
			.addCase(signOut.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Çıkış yapılırken bir hata oluştu';
			})
			// Update Profile
			.addCase(updateProfile.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.user = action.payload;
			})
			.addCase(updateProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Profil güncellenirken bir hata oluştu';
			})
			// Update Password
			.addCase(updatePassword.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updatePassword.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(updatePassword.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Şifre güncellenirken bir hata oluştu';
			})
			// Reset App
			.addCase(resetApp.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(resetApp.fulfilled, () => {
				return initialState; // State'i tamamen sıfırla
			})
			.addCase(resetApp.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Uygulama sıfırlanırken bir hata oluştu';
			});
	}
});

export const { setUser, clearError, resetState } = authSlice.actions;
export default authSlice.reducer;
