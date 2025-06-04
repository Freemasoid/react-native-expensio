import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Expense {
  id: string;
  amount: number;
  date: string;
  description: string;
}

interface ExpenseState {
  expenses: Expense[];
}

const initialState: ExpenseState = {
  expenses: [],
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload);
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      );
    },
    updateExpense: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Expense> }>
    ) => {
      const { id, data } = action.payload;
      const existingExpense = state.expenses.find(
        (expense) => expense.id === id
      );
      if (existingExpense) {
        Object.assign(existingExpense, data);
      }
    },
  },
});

export const { addExpense, deleteExpense, updateExpense } =
  expenseSlice.actions;
export default expenseSlice.reducer;
