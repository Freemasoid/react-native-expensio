import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Available theme names for the application
 *
 * Defines the color schemes available for the user interface:
 * - primaryGreen: Default green theme for expense tracking focus
 * - primaryRed: Red theme for highlighting overspending or alerts
 * - primaryYellow: Yellow theme for a warm, optimistic feel
 * - primaryBlue: Blue theme for a professional, calming appearance
 */
export type ThemeName =
  | "primaryGreen"
  | "primaryRed"
  | "primaryYellow"
  | "primaryBlue";

/**
 * Redux state for application theme management
 *
 * Manages the current visual theme applied across the application,
 * allowing users to customize their visual experience.
 *
 * @interface ThemeState
 * @property {ThemeName} currentTheme - The currently active theme
 */
interface ThemeState {
  currentTheme: ThemeName;
}

/**
 * Initial state for theme management
 *
 * @property {ThemeName} currentTheme - The currently active theme, defaults to green
 */
const initialState: ThemeState = {
  currentTheme: "primaryGreen",
};

// * REDUX SLICE DEFINITION

/**
 * Redux slice for managing application theme state
 *
 * Handles theme selection and persistence, allowing users to customize
 * the visual appearance of the application with different color schemes.
 */
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    /**
     * Sets the active theme for the application
     *
     * Updates the current theme which triggers UI-wide color changes.
     * The theme change is applied immediately across all components.
     *
     * @param action.payload - The theme name to activate
     */
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
