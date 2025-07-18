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
  deleteTransactionOptimistic,
  fetchAndStoreTransactions,
  loadTransactionsFromStorage,
  updateTransactionOptimistic,
} from "../thunks/transactionThunk";

/**
 * Redux state for transaction management
 *
 * Manages hierarchical transaction data organized by year/month,
 * pending transactions for optimistic updates, and async operation states.
 *
 * @interface TransactionState
 * @property {TransactionData | null} transactions - Hierarchical transaction data organized by year/month
 * @property {PendingTransaction[]} pendingTransactions - Transactions awaiting server confirmation
 * @property {boolean} isLoading - Loading state for async operations
 * @property {string | null} error - Error message from failed operations
 * @property {number | null} lastFetched - Timestamp of last successful data fetch
 */

interface TransactionState {
  transactions: TransactionData | null;
  pendingTransactions: PendingTransaction[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

/**
 * Initial state for transaction management
 *
 * @property {TransactionData | null} transactions - Hierarchical transaction data organized by year/month
 * @property {PendingTransaction[]} pendingTransactions - Transactions awaiting server confirmation
 * @property {boolean} isLoading - Loading state for async operations
 * @property {string | null} error - Error message from failed operations
 * @property {number | null} lastFetched - Timestamp of last successful data fetch
 */
const initialState: TransactionState = {
  transactions: null,
  pendingTransactions: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

// * HELPER FUNCTIONS

/**
 * Extracts year and month from a date string or Date object
 * @param date - Date string (ISO format) or Date object
 * @returns Object containing year and month as zero-padded strings
 */
const extractDateParts = (date: string | Date) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear().toString();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  return { year, month };
};

const generateUniqueId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

/**
 * Ensures the nested transaction structure exists for a given year/month
 * @param transactions - Transactions data to modify
 * @param year - Year as string, e.g. "2025"
 * @param month - Month as zero-padded string, e.g. "01"
 */
const ensureTransactionStructureExists = (
  transactions: TransactionData,
  year: string,
  month: string
) => {
  if (!transactions.transactions[year]) {
    transactions.transactions[year] = {};
  }
  if (!transactions.transactions[year][month]) {
    transactions.transactions[year][month] = [];
  }
};

/**
 * Adds a transaction to the appropriate year/month bucket
 * @param state - Current transaction state
 * @param transaction - Transaction to add
 */
const addTransactionToYearMonthBucket = (
  state: TransactionState,
  transaction: Transaction
) => {
  if (!state.transactions) return;

  const { year, month } = extractDateParts(transaction.date);
  ensureTransactionStructureExists(state.transactions, year, month);
  state.transactions.transactions[year][month].push(transaction);
};

/**
 * Removes a transaction from all year/month buckets
 * @param state - Current transaction state
 * @param transactionId - ID of transaction to remove
 */
const removeTransactionFromAllBuckets = (
  state: TransactionState,
  transactionId: string
) => {
  if (!state.transactions) return;

  Object.keys(state.transactions.transactions).forEach((year) => {
    Object.keys(state.transactions!.transactions[year]).forEach((month) => {
      state.transactions!.transactions[year][month] =
        state.transactions!.transactions[year][month].filter(
          (transaction) => transaction._id !== transactionId
        );
    });
  });
};

// * REDUX SLICE DEFINITION

/**
 * Redux slice for managing transaction state
 *
 * Handles local transaction CRUD operations, optimistic updates,
 * pending transaction management, and async operation states.
 */
const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    /**
     * Adds a new transaction to pending list for optimistic updates
     */
    addTransactionPending: (state, action: PayloadAction<NewTransaction>) => {
      const pendingTransaction: PendingTransaction = {
        ...action.payload,
        tempId: generateUniqueId(),
        isPending: true,
        createdAt: new Date().toISOString(),
      };

      state.pendingTransactions.push(pendingTransaction);
    },

    /**
     * Removes a pending transaction by temporary ID
     */
    removePendingTransaction: (state, action: PayloadAction<string>) => {
      state.pendingTransactions = state.pendingTransactions.filter(
        (transaction) => transaction.tempId !== action.payload
      );
    },

    addTransaction: (state, action: PayloadAction<Transaction>) => {
      addTransactionToYearMonthBucket(state, action.payload);
    },

    deleteTransaction: (state, action: PayloadAction<string>) => {
      removeTransactionFromAllBuckets(state, action.payload);
    },

    /**
     * Updates a transaction, handling potential date changes that
     * requires moving transaction between year/month buckets
     */
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const updatedTransaction = action.payload;

      // Remove from old location
      removeTransactionFromAllBuckets(state, updatedTransaction._id);

      // Add to new location based on current date
      addTransactionToYearMonthBucket(state, updatedTransaction);
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
    // * LOAD FROM STORAGE
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
      });

    // * FETCH AND STORE
    builder
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
      });

    // * CLEAR STORAGE
    builder.addCase(clearTransactionsStorage.fulfilled, (state) => {
      state.transactions = null;
      state.lastFetched = null;
    });

    // * ADD TRANSACTION OPTIMISTICALLY
    builder
      .addCase(addTransactionOptimistic.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTransactionOptimistic.fulfilled, (state, action) => {
        state.isLoading = false;

        const { tempId, serverTransaction } = action.payload;

        // Remove pending transaction after server confirmation
        state.pendingTransactions = state.pendingTransactions.filter(
          (transaction) => transaction.tempId !== tempId
        );

        // Add confirmed transaction from server
        if (serverTransaction) {
          addTransactionToYearMonthBucket(state, serverTransaction);
        }
      })
      .addCase(addTransactionOptimistic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to add transaction";

        // Clean up pending transaction on failure
        const tempId = action.meta.arg.tempId;
        state.pendingTransactions = state.pendingTransactions.filter(
          (transaction) => transaction.tempId !== tempId
        );
      });

    // * UPDATE TRANSACTION OPTIMISTICALLY
    builder
      .addCase(updateTransactionOptimistic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTransactionOptimistic.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.transactions) {
          const updatedTransaction = action.payload.transaction;
          transactionSlice.caseReducers.updateTransaction(state, {
            type: "updateTransaction",
            payload: updatedTransaction,
          });
        }
      })
      .addCase(updateTransactionOptimistic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update transaction";
      })

      // * DELETE TRANSACTION OPTIMISTICALLY
      .addCase(deleteTransactionOptimistic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTransactionOptimistic.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteTransactionOptimistic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete transaction";
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
