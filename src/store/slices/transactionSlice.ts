import type { Transaction, TransactionData } from "@/types/types";
import { getUserTransactions } from "@/utils/calls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const TRANSACTIONS_STORAGE_KEY = "userTransactions";

interface TransactionState {
  transactions: TransactionData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: TransactionState = {
  transactions: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const loadTransactionsFromStorage = createAsyncThunk(
  "transactions/loadFromStorage",
  async () => {
    try {
      const storedData = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error("Failed to load transactions from storage:", error);
      return null;
    }
  }
);

export const fetchAndStoreTransactions = createAsyncThunk(
  "transactions/fetchAndStore",
  async ({
    clerkId,
    options,
  }: {
    clerkId: string;
    options?: { year?: string; month?: string };
  }) => {
    try {
      const response = await getUserTransactions(clerkId, options);
      const transactionsData = response.data;

      await AsyncStorage.setItem(
        TRANSACTIONS_STORAGE_KEY,
        JSON.stringify(transactionsData)
      );

      return transactionsData;
    } catch (error) {
      console.error("Failed to fetch and store transactions:", error);
      throw error;
    }
  }
);

export const clearTransactionsStorage = createAsyncThunk(
  "transactions/clearStorage",
  async () => {
    try {
      await AsyncStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear transactions storage:", error);
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      if (!state.transactions) return;

      const transaction = action.payload;
      const date = new Date(transaction.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");

      if (!state.transactions.transactions[year]) {
        state.transactions.transactions[year] = {};
      }
      if (!state.transactions.transactions[year][month]) {
        state.transactions.transactions[year][month] = [];
      }

      state.transactions.transactions[year][month].push(transaction);
    },

    deleteTransaction: (state, action: PayloadAction<string>) => {
      if (!state.transactions) return;

      const transactionId = action.payload;

      Object.keys(state.transactions.transactions).forEach((year) => {
        Object.keys(state.transactions!.transactions[year]).forEach((month) => {
          state.transactions!.transactions[year][month] =
            state.transactions!.transactions[year][month].filter(
              (transaction) => transaction.id !== transactionId
            );
        });
      });
    },

    updateTransaction: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Transaction> }>
    ) => {
      if (!state.transactions) return;

      const { id, data } = action.payload;

      Object.keys(state.transactions.transactions).forEach((year) => {
        Object.keys(state.transactions!.transactions[year]).forEach((month) => {
          const transaction = state.transactions!.transactions[year][
            month
          ].find((transaction) => transaction.id === id);

          if (transaction) {
            Object.assign(transaction, data);
          }
        });
      });
    },

    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTransactionsFromStorage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadTransactionsFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.transactions = action.payload;
        }
      })
      .addCase(loadTransactionsFromStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load from storage";
      })
      .addCase(fetchAndStoreTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAndStoreTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAndStoreTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      })
      .addCase(clearTransactionsStorage.fulfilled, (state) => {
        state.transactions = null;
        state.lastFetched = null;
      });
  },
});

export const {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  clearError,
  setLoading,
} = transactionSlice.actions;

export default transactionSlice.reducer;
