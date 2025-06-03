import { createSlice } from "@reduxjs/toolkit";

interface Income {
  id: string;
  amount: number;
  date: string;
  description: string;
}

interface IncomeState {
  incomes: Income[];
}

const initialState: IncomeState = {
  incomes: [],
};

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    addIncome: (state, action) => {
      state.incomes.push(action.payload);
    },
  },
});

export const { addIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
