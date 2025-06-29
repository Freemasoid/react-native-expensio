import { NewTransaction, PendingTransaction } from "@/types/types";
import { createTransaction, getUserTransactions } from "@/utils/calls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

const TRANSACTIONS_STORAGE_KEY = "userTransactions";
const PENDING_TRANSACTIONS_KEY = "pendingTransactions";

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
      await AsyncStorage.removeItem(PENDING_TRANSACTIONS_KEY);
    } catch (error) {
      console.error("Failed to clear transactions storage:", error);
    }
  }
);

// Optimistic transaction creation
export const addTransactionOptimistic = createAsyncThunk(
  "transactions/addTransactionOptimistic",
  async ({
    clerkId,
    transactionData,
    tempId,
  }: {
    clerkId: string;
    transactionData: NewTransaction;
    tempId: string;
  }) => {
    try {
      const response = await createTransaction(clerkId, transactionData);

      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      const serverTransaction = response.data;

      const pendingTransactions = await AsyncStorage.getItem(
        PENDING_TRANSACTIONS_KEY
      );
      let pending: PendingTransaction[] = pendingTransactions
        ? JSON.parse(pendingTransactions)
        : [];

      pending = pending.filter((t) => t.tempId !== tempId);
      await AsyncStorage.setItem(
        PENDING_TRANSACTIONS_KEY,
        JSON.stringify(pending)
      );

      return {
        tempId,
        serverTransaction,
      };
    } catch (error) {
      console.error("Failed to add new transaction:", error);
      throw error;
    }
  }
);

export const savePendingTransaction = async (
  pendingTransaction: PendingTransaction
) => {
  try {
    const storedPending = await AsyncStorage.getItem(PENDING_TRANSACTIONS_KEY);
    const pendingTransactions: PendingTransaction[] = storedPending
      ? JSON.parse(storedPending)
      : [];

    pendingTransactions.push(pendingTransaction);
    await AsyncStorage.setItem(
      PENDING_TRANSACTIONS_KEY,
      JSON.stringify(pendingTransactions)
    );
  } catch (error) {
    console.error("Failed to save pending transaction:", error);
  }
};

export const loadPendingTransactions = async (): Promise<
  PendingTransaction[]
> => {
  try {
    const storedPending = await AsyncStorage.getItem(PENDING_TRANSACTIONS_KEY);
    return storedPending ? JSON.parse(storedPending) : [];
  } catch (error) {
    console.error("Failed to load pending transactions:", error);
    return [];
  }
};
