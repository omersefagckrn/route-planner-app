export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			addresses: {
				Row: {
					id: string;
					title: string;
					address: string;
					latitude: number;
					longitude: number;
					is_favorite: boolean;
					user_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					address: string;
					latitude: number;
					longitude: number;
					is_favorite?: boolean;
					user_id: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					address?: string;
					latitude?: number;
					longitude?: number;
					is_favorite?: boolean;
					user_id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
		};
	};
}
