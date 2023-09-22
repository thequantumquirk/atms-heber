import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        // more reducers here
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
