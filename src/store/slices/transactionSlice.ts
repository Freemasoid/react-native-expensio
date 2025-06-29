import type {
  NewTransaction,
  PendingTransaction,
  Transaction,
  TransactionData,
} from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addTransactionOptimistic,
  clearTransactionsStorage,
  fetchAndStoreTransactions,
  loadTransactionsFromStorage,
} from "../thunks/transactionThunk";

interface TransactionState {
  transactions: TransactionData | null;
  pendingTransactions: PendingTransaction[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: TransactionState = {
  transactions: null,
  pendingTransactions: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransactionPending: (state, action: PayloadAction<NewTransaction>) => {
      const newTransaction = action.payload;
      const pendingTransaction: PendingTransaction = {
        ...newTransaction,
        tempId: `temp_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 11)}`,
        isPending: true,
        createdAt: new Date().toISOString(),
      };

      state.pendingTransactions.push(pendingTransaction);
    },

    removePendingTransaction: (state, action: PayloadAction<string>) => {
      const tempId = action.payload;
      state.pendingTransactions = state.pendingTransactions.filter(
        (transaction) => transaction.tempId !== tempId
      );
    },

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
              (transaction) => transaction._id !== transactionId
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
          ].find((transaction) => transaction._id === id);

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

    clearPendingTransactions: (state) => {
      state.pendingTransactions = [];
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
      })
      .addCase(addTransactionOptimistic.fulfilled, (state, action) => {
        const { tempId, serverTransaction } = action.payload;

        state.pendingTransactions = state.pendingTransactions.filter(
          (transaction) => transaction.tempId !== tempId
        );

        if (state.transactions && serverTransaction) {
          const date = new Date(serverTransaction.date);
          const year = date.getFullYear().toString();
          const month = (date.getMonth() + 1).toString().padStart(2, "0");

          if (!state.transactions.transactions[year]) {
            state.transactions.transactions[year] = {};
          }
          if (!state.transactions.transactions[year][month]) {
            state.transactions.transactions[year][month] = [];
          }

          state.transactions.transactions[year][month].push(serverTransaction);
        }
      })
      .addCase(addTransactionOptimistic.rejected, (state, action) => {
        const tempId = action.meta.arg.tempId;

        state.pendingTransactions = state.pendingTransactions.filter(
          (transaction) => transaction.tempId !== tempId
        );

        state.error = action.error.message || "Failed to add transaction";
      });
  },
});

export const {
  addTransactionPending,
  removePendingTransaction,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  clearError,
  setLoading,
  clearPendingTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
