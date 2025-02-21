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

// State tipleri
export interface AddressState {
	addresses: Address[];
	favorites: Address[];
	loading: boolean;
	error: string | null;
}
