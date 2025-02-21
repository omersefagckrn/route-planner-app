import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import addressReducer from './features/addressSlice';

export const rootStore = configureStore({
	reducer: {
		auth: authReducer,
		address: addressReducer
	}
});

export type RootState = ReturnType<typeof rootStore.getState>;
export type AppDispatch = typeof rootStore.dispatch;
