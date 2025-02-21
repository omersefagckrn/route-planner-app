import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
	user: User | null;
	isLoading: boolean;
	error: string | null;
}

export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }: { email: string; password: string }) => {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			if (error.message.includes('Invalid login credentials')) {
				throw new Error('E-posta adresi veya şifre hatalı');
			}
			throw error;
		}

		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();

		if (userError) throw userError;
		if (!user) throw new Error('Kullanıcı bulunamadı');

		return user;
	} catch (error: any) {
		throw new Error(error.message || 'Giriş yapılırken bir hata oluştu');
	}
});

export const signUp = createAsyncThunk('auth/signUp', async ({ email, password, firstName, lastName }: { email: string; password: string; firstName: string; lastName: string }) => {
	try {
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName
				}
			}
		});

		if (authError) {
			if (authError.message.includes('email')) {
				throw new Error('Bu e-posta adresi zaten kullanımda');
			}
			throw authError;
		}

		// Kayıt sonrası otomatik giriş yap
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) throw error;
		return data.user;
	} catch (error: any) {
		throw new Error(error.message || 'Kayıt olurken bir hata oluştu');
	}
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
});

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (error) throw error;
	if (!user) throw new Error('Kullanıcı bulunamadı');

	return user;
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (updates: { first_name?: string; last_name?: string }) => {
	try {
		// Önce auth user'ı güncelle
		const { data: userData, error: userError } = await supabase.auth.updateUser({
			data: {
				...(updates.first_name && { first_name: updates.first_name }),
				...(updates.last_name && { last_name: updates.last_name })
			}
		});

		if (userError) throw userError;
		if (!userData?.user) throw new Error('Kullanıcı bilgileri güncellenemedi');

		// Profiles tablosunu güncelle
		if (updates.first_name || updates.last_name) {
			const { data: profileData, error: profileError } = await supabase.rpc('update_user_profile', {
				user_id: userData.user.id,
				user_email: userData.user.email,
				user_first_name: updates.first_name || userData.user.user_metadata?.first_name,
				user_last_name: updates.last_name || userData.user.user_metadata?.last_name
			});

			if (profileError) {
				console.error('Profil güncelleme hatası:', profileError);
				throw new Error('Profil bilgileri güncellenirken bir hata oluştu');
			}

			console.log('Profil güncelleme sonucu:', profileData);
		}

		// Güncel kullanıcı bilgilerini al
		const {
			data: { user: updatedUser },
			error: getUserError
		} = await supabase.auth.getUser();

		if (getUserError) throw getUserError;
		if (!updatedUser) throw new Error('Güncel kullanıcı bilgileri alınamadı');

		return updatedUser;
	} catch (error: any) {
		console.error('Profil güncelleme hatası:', error);
		throw new Error(error.message || 'Profil güncellenirken bir hata oluştu');
	}
});

export const changePassword = createAsyncThunk('auth/changePassword', async ({ password }: { password: string }) => {
	const { data, error } = await supabase.auth.updateUser({
		password
	});

	if (error) throw error;

	return data.user;
});

const initialState: AuthState = {
	user: null,
	isLoading: false,
	error: null
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(signIn.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		})
			.addCase(signIn.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
			})
			.addCase(signIn.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Giriş yapılırken bir hata oluştu';
			})
			.addCase(signUp.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(signUp.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
			})
			.addCase(signUp.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Kayıt olurken bir hata oluştu';
			})
			.addCase(signOut.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(signOut.fulfilled, (state) => {
				state.isLoading = false;
				state.user = null;
			})
			.addCase(signOut.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Çıkış yapılırken bir hata oluştu';
			})
			.addCase(getCurrentUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getCurrentUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
			})
			.addCase(getCurrentUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Kullanıcı bilgileri alınırken bir hata oluştu';
			})
			.addCase(updateProfile.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
			})
			.addCase(updateProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Profil güncellenirken bir hata oluştu';
			})
			.addCase(changePassword.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(changePassword.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
			})
			.addCase(changePassword.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Şifre değiştirilirken bir hata oluştu';
			});
	}
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
