import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  membershipLevel: "basic" | "premium";
  joinedDate: string;
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
    darkMode: boolean;
  };
}

export interface UserStats {
  totalExpenses: number;
  monthlyBudget: number;
  savingsGoal: number;
  currentSavings: number;
  topCategories: string[];
  expenseStreak: number;
}

interface UserState {
  profile: UserProfile;
  stats: UserStats;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: {
    id: "user_001",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: undefined,
    phone: "+1 (555) 123-4567",
    membershipLevel: "basic",
    joinedDate: "2024-01-15",
    preferences: {
      currency: "EUR",
      language: "en",
      notifications: true,
      darkMode: false,
    },
  },
  stats: {
    totalExpenses: 2847.5,
    monthlyBudget: 3000.0,
    savingsGoal: 10000.0,
    currentSavings: 4250.0,
    topCategories: ["food", "transport", "shopping"],
    expenseStreak: 12,
  },
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<UserProfile["preferences"]>>
    ) => {
      state.profile.preferences = {
        ...state.profile.preferences,
        ...action.payload,
      };
    },
    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.profile.avatar = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetUser: (state) => {
      state.profile = initialState.profile;
      state.stats = initialState.stats;
      state.error = null;
    },
  },
});

export const {
  updateProfile,
  updatePreferences,
  updateStats,
  setAvatar,
  setLoading,
  setError,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
