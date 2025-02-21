import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Address = Database['public']['Tables']['addresses']['Row'];
type AddressInsert = Database['public']['Tables']['addresses']['Insert'];
type AddressUpdate = Database['public']['Tables']['addresses']['Update'];

export const addressService = {
	// Tüm adresleri getir
	getAddresses: async (userId: string) => {
		const { data, error } = await supabase.from('addresses').select('*').eq('user_id', userId).order('created_at', { ascending: false });

		if (error) throw error;
		return data as Address[];
	},

	// Favori adresleri getir
	getFavoriteAddresses: async (userId: string) => {
		const { data, error } = await supabase.from('addresses').select('*').eq('user_id', userId).eq('is_favorite', true).order('created_at', { ascending: false });

		if (error) throw error;
		return data as Address[];
	},

	// Yeni adres ekle
	addAddress: async (address: AddressInsert) => {
		const { data, error } = await supabase.from('addresses').insert(address).select().single();

		if (error) throw error;
		return data as Address;
	},

	// Adres güncelle
	updateAddress: async (id: string, updates: AddressUpdate) => {
		try {
			// Sadece gerekli alanları içeren temiz bir güncelleme objesi oluştur
			const cleanUpdates: Partial<AddressUpdate> = {};

			if (updates.title !== undefined) cleanUpdates.title = updates.title;
			if (updates.address !== undefined) cleanUpdates.address = updates.address;
			if (updates.latitude !== undefined) cleanUpdates.latitude = updates.latitude;
			if (updates.longitude !== undefined) cleanUpdates.longitude = updates.longitude;
			if (updates.is_favorite !== undefined) cleanUpdates.is_favorite = updates.is_favorite;

			// Direkt güncelleme yap
			const { data, error } = await supabase.from('addresses').update(cleanUpdates).eq('id', id).select().single();

			if (error) {
				console.error('Update error:', error);
				throw error;
			}

			return data as Address;
		} catch (error) {
			console.error('Update operation failed:', error);
			throw error;
		}
	},

	// Adres sil
	deleteAddress: async (id: string) => {
		const { error } = await supabase.from('addresses').delete().eq('id', id);

		if (error) throw error;
	},

	// Favori durumunu değiştir
	toggleFavorite: async (id: string, isFavorite: boolean) => {
		try {
			// Direkt güncelleme yap
			const { data, error } = await supabase.from('addresses').update({ is_favorite: isFavorite }).eq('id', id).select().single();

			if (error) {
				console.error('Toggle favorite error:', error);
				throw error;
			}

			return data as Address;
		} catch (error) {
			console.error('Toggle favorite operation failed:', error);
			throw error;
		}
	}
};
