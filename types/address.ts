import { InferType } from 'yup';
import { addressSchema } from '../schemas/address';
import { Database } from './database';

// Supabase tipleri
export type Address = Database['public']['Tables']['addresses']['Row'];
export type AddressInsert = Database['public']['Tables']['addresses']['Insert'];
export type AddressUpdate = Database['public']['Tables']['addresses']['Update'];

// Form ve validasyon tipleri
export type AddressFormData = InferType<typeof addressSchema>;

// Koordinat tipi
export type Coordinates = {
	latitude: number;
	longitude: number;
};

// API response tipleri
export type AddressResponse = {
	success: boolean;
	data?: Address;
	error?: string;
};

export type AddressListResponse = {
	success: boolean;
	data?: Address[];
	error?: string;
};

// State tipleri
export interface AddressState {
	addresses: Address[];
	favorites: Address[];
	loading: boolean;
	error: string | null;
}

// Action tipleri
export type AddressAction =
	| { type: 'FETCH_ADDRESSES_REQUEST' }
	| { type: 'FETCH_ADDRESSES_SUCCESS'; payload: Address[] }
	| { type: 'FETCH_ADDRESSES_FAILURE'; payload: string }
	| { type: 'ADD_ADDRESS_SUCCESS'; payload: Address }
	| { type: 'UPDATE_ADDRESS_SUCCESS'; payload: Address }
	| { type: 'DELETE_ADDRESS_SUCCESS'; payload: string }
	| { type: 'TOGGLE_FAVORITE_SUCCESS'; payload: Address }
	| { type: 'CLEAR_ERROR' };
