import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import addressReducer from './features/addressSlice';
import sessionReducer from './features/sessionSlice';

export const rootStore = configureStore({
	reducer: {
		auth: authReducer,
		address: addressReducer,
		sessions: sessionReducer
	}
});

export type RootState = ReturnType<typeof rootStore.getState>;
export type AppDispatch = typeof rootStore.dispatch;
