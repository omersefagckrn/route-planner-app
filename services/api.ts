import { supabase } from '../lib/supabase';

export interface UserProfile {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	phone: string;
	created_at: string;
	updated_at: string;
}

export interface AuthResponse {
	user: UserProfile | null;
	error: Error | null;
}

class ApiService {
	async getCurrentUser(): Promise<AuthResponse> {
		try {
			const {
				data: { user },
				error: authError
			} = await supabase.auth.getUser();

			if (authError) {
				return { user: null, error: authError };
			}

			if (!user) {
				return { user: null, error: new Error('Kullanıcı bulunamadı') };
			}

			const { data: profile, error: profileError } = await supabase
				.from('profiles')
				.select('id, email, first_name, last_name, phone, created_at, updated_at')
				.eq('id', user.id)
				.single();

			if (profileError) {
				console.error('Profile error:', profileError);
				return { user: null, error: profileError };
			}

			if (!profile) {
				console.error('No profile found');
				return { user: null, error: new Error('Profil bulunamadı') };
			}

			return {
				user: {
					id: profile.id,
					email: profile.email,
					first_name: profile.first_name,
					last_name: profile.last_name,
					phone: profile.phone,
					created_at: profile.created_at,
					updated_at: profile.updated_at
				},
				error: null
			};
		} catch (error: any) {
			console.error('getCurrentUser error:', error);
			return { user: null, error };
		}
	}

	async signIn(email: string, password: string): Promise<AuthResponse> {
		try {
			const {
				data: { user },
				error: authError
			} = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (authError) {
				return { user: null, error: authError };
			}

			if (!user) {
				return { user: null, error: new Error('Kullanıcı bulunamadı') };
			}

			const { data: profile, error: profileError } = await supabase
				.from('profiles')
				.select('id, email, first_name, last_name, phone, created_at, updated_at')
				.eq('id', user.id)
				.single();

			if (profileError) {
				return { user: null, error: profileError };
			}

			if (!profile) {
				return { user: null, error: new Error('Profil bulunamadı') };
			}

			return {
				user: {
					id: profile.id,
					email: profile.email,
					first_name: profile.first_name,
					last_name: profile.last_name,
					phone: profile.phone,
					created_at: profile.created_at,
					updated_at: profile.updated_at
				},
				error: null
			};
		} catch (error: any) {
			return { user: null, error };
		}
	}

	async signUp(userData: { email: string; password: string; firstName: string; lastName: string; phone: string }): Promise<AuthResponse> {
		try {
			const {
				data: { user },
				error: authError
			} = await supabase.auth.signUp({
				email: userData.email,
				password: userData.password
			});

			if (authError) {
				return { user: null, error: authError };
			}

			if (!user) {
				return { user: null, error: new Error('Kullanıcı oluşturulamadı') };
			}

			const { data: profile, error: profileError } = await supabase
				.from('profiles')
				.insert([
					{
						id: user.id,
						email: userData.email,
						first_name: userData.firstName,
						last_name: userData.lastName,
						phone: userData.phone
					}
				])
				.select('id, email, first_name, last_name, phone, created_at, updated_at')
				.single();

			if (profileError) {
				return { user: null, error: profileError };
			}

			if (!profile) {
				return { user: null, error: new Error('Profil oluşturulamadı') };
			}

			return {
				user: {
					id: profile.id,
					email: profile.email,
					first_name: profile.first_name,
					last_name: profile.last_name,
					phone: profile.phone,
					created_at: profile.created_at,
					updated_at: profile.updated_at
				},
				error: null
			};
		} catch (error: any) {
			return { user: null, error };
		}
	}

	async signOut(): Promise<{ error: Error | null }> {
		try {
			const { error } = await supabase.auth.signOut();
			return { error };
		} catch (error: any) {
			return { error };
		}
	}

	async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<AuthResponse> {
		try {
			const mappedUpdates = {
				...(updates.first_name && { first_name: updates.first_name }),
				...(updates.last_name && { last_name: updates.last_name }),
				...(updates.phone && { phone: updates.phone })
			};

			const { data: profile, error } = await supabase
				.from('profiles')
				.update(mappedUpdates)
				.eq('id', userId)
				.select('id, email, first_name, last_name, phone, created_at, updated_at')
				.single();

			if (error) {
				console.error('Update profile error:', error);
				return { user: null, error };
			}

			if (!profile) {
				return { user: null, error: new Error('Profil güncellenemedi') };
			}

			return {
				user: {
					id: profile.id,
					email: profile.email,
					first_name: profile.first_name,
					last_name: profile.last_name,
					phone: profile.phone,
					created_at: profile.created_at,
					updated_at: profile.updated_at
				},
				error: null
			};
		} catch (error: any) {
			console.error('Update profile error:', error);
			return { user: null, error };
		}
	}

	async updatePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }): Promise<{ error: Error | null }> {
		try {
			// Önce mevcut şifreyle giriş yapmayı dene
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email: (await supabase.auth.getUser()).data.user?.email || '',
				password: currentPassword
			});

			if (signInError) {
				return { error: new Error('Mevcut şifre yanlış') };
			}

			// Şifreyi güncelle
			const { error } = await supabase.auth.updateUser({
				password: newPassword
			});

			if (error) {
				console.error('Password update error:', error);
				return { error: new Error('Şifre güncellenirken bir hata oluştu') };
			}

			return { error: null };
		} catch (error: any) {
			console.error('Password update error:', error);
			return { error };
		}
	}
}

export const apiService = new ApiService();
