import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "expense" | "income";
  category: string;
  date: Date;
  description: string;
}

interface TransactionState {
  transactions: YearlyTransactions;
}

interface MonthlyTransactions {
  [month: string]: Transaction[];
}

interface YearlyTransactions {
  [year: string]: MonthlyTransactions;
}

const initialState: TransactionState = {
  transactions: {},
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      const transaction = action.payload;
      const date = new Date(transaction.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");

      if (!state.transactions[year]) {
        state.transactions[year] = {};
      }
      if (!state.transactions[year][month]) {
        state.transactions[year][month] = [];
      }

      state.transactions[year][month].push(transaction);
    },

    deleteTransaction: (state, action: PayloadAction<string>) => {
      const transactionId = action.payload;

      Object.keys(state.transactions).forEach((year) => {
        Object.keys(state.transactions[year]).forEach((month) => {
          state.transactions[year][month] = state.transactions[year][
            month
          ].filter((transaction) => transaction.id !== transactionId);
        });
      });
    },

    updateTransaction: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Transaction> }>
    ) => {
      const { id, data } = action.payload;

      Object.keys(state.transactions).forEach((year) => {
        Object.keys(state.transactions[year]).forEach((month) => {
          const transaction = state.transactions[year][month].find(
            (transaction) => transaction.id === id
          );

          if (transaction) {
            Object.assign(transaction, data);
          }
        });
      });
    },
  },
});

export const { addTransaction, deleteTransaction, updateTransaction } =
  transactionSlice.actions;
export default transactionSlice.reducer;
