import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeName =
  | "primaryGreen"
  | "primaryRed"
  | "primaryYellow"
  | "primaryBlue";

interface ThemeState {
  currentTheme: ThemeName;
}

const initialState: ThemeState = {
  currentTheme: "primaryGreen",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
