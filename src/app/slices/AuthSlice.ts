import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authInitialState {
  userInfo:
    | undefined
    | {
        uid: string;
        email: string;
        name: string;
        imageUrl: string | undefined;
      };
  isDarkTheme: boolean;
}

const initialState: authInitialState = {
  userInfo: undefined,
  isDarkTheme: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.isDarkTheme = action.payload.isDarkTheme;
    },
    setUser: (
      state,
      action: PayloadAction<{
        uid: string;
        email: string;
        name: string;
        imageUrl: string | undefined;
      }>
    ) => {
      state.userInfo = action.payload;
    },
    updateUserProfileImage: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      // Assuming imageUrl is a string in your user info
      if (state.userInfo) {
        state.userInfo.imageUrl = action.payload;
      }
    },
  },
});

export const { setUser, changeTheme } = authSlice.actions;
