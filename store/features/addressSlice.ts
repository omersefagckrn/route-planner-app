import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { Address } from '../../types/address';

interface AddressState {
	addresses: Address[];
	favorites: Address[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

export const fetchAddresses = createAsyncThunk('address/fetchAddresses', async (userId: string) => {
	const { data, error } = await supabase.from('addresses').select('*').eq('user_id', userId);
	if (error) throw error;
	return data as Address[];
});

export const fetchFavorites = createAsyncThunk('address/fetchFavorites', async (userId: string) => {
	const { data, error } = await supabase.from('addresses').select('*').eq('user_id', userId).eq('is_favorite', true);
	if (error) throw error;
	return data as Address[];
});

export const addNewAddress = createAsyncThunk('address/addNewAddress', async (address: Omit<Address, 'id' | 'created_at' | 'updated_at'>) => {
	const { data, error } = await supabase.from('addresses').insert([address]).select().single();
	if (error) throw error;
	return data as Address;
});

export const updateExistingAddress = createAsyncThunk('address/updateExistingAddress', async ({ id, updates }: { id: string; updates: Partial<Address> }) => {
	const { data, error } = await supabase.from('addresses').update(updates).eq('id', id).select().single();
	if (error) throw error;
	return data as Address;
});

export const removeAddress = createAsyncThunk('address/removeAddress', async (id: string) => {
	const { error } = await supabase.from('addresses').delete().eq('id', id);
	if (error) throw error;
	return id;
});

export const toggleAddressFavorite = createAsyncThunk('address/toggleFavorite', async (address: Address) => {
	const { data, error } = await supabase.from('addresses').update({ is_favorite: !address.is_favorite }).eq('id', address.id).select().single();
	if (error) throw error;
	return data as Address;
});

const initialState: AddressState = {
	addresses: [],
	favorites: [],
	status: 'idle',
	error: null
};

const addressSlice = createSlice({
	name: 'address',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchAddresses.pending, (state) => {
			state.status = 'loading';
		})
			.addCase(fetchAddresses.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.addresses = action.payload;
			})
			.addCase(fetchAddresses.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Adresler yüklenirken bir hata oluştu';
			})
			.addCase(fetchFavorites.fulfilled, (state, action) => {
				state.favorites = action.payload;
			})
			.addCase(addNewAddress.fulfilled, (state, action) => {
				state.addresses.push(action.payload);
				if (action.payload.is_favorite) {
					state.favorites.push(action.payload);
				}
			})
			.addCase(updateExistingAddress.fulfilled, (state, action) => {
				const index = state.addresses.findIndex((address) => address.id === action.payload.id);
				if (index !== -1) {
					state.addresses[index] = action.payload;
				}
				const favoriteIndex = state.favorites.findIndex((address) => address.id === action.payload.id);
				if (action.payload.is_favorite && favoriteIndex === -1) {
					state.favorites.push(action.payload);
				} else if (!action.payload.is_favorite && favoriteIndex !== -1) {
					state.favorites.splice(favoriteIndex, 1);
				}
			})
			.addCase(removeAddress.fulfilled, (state, action) => {
				state.addresses = state.addresses.filter((address) => address.id !== action.payload);
				state.favorites = state.favorites.filter((address) => address.id !== action.payload);
			})
			.addCase(toggleAddressFavorite.fulfilled, (state, action) => {
				const index = state.addresses.findIndex((address) => address.id === action.payload.id);
				if (index !== -1) {
					state.addresses[index] = action.payload;
				}
				const favoriteIndex = state.favorites.findIndex((address) => address.id === action.payload.id);
				if (action.payload.is_favorite && favoriteIndex === -1) {
					state.favorites.push(action.payload);
				} else if (!action.payload.is_favorite && favoriteIndex !== -1) {
					state.favorites.splice(favoriteIndex, 1);
				}
			});
	}
});

export default addressSlice.reducer;
