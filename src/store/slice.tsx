import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    email: string | null;
}

const initialState: AuthState = {
    email: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string | null>) => {
            state.email = action.payload;
        },
    },
});

export const { setEmail } = authSlice.actions;
export default authSlice.reducer;
