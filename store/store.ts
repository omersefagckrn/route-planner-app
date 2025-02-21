import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import addressReducer from './features/addressSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		address: addressReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
