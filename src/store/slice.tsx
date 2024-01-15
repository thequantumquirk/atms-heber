// userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string;
  id: string;
  power: number;
}

const initialState: UserState = {
  name: "",
  id: "",
  power: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
