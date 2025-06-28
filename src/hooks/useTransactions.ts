import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearTransactionsStorage,
  fetchAndStoreTransactions,
  loadTransactionsFromStorage,
} from "@/store/slices/transactionSlice";
import { USER_ID } from "@env";
import { useEffect } from "react";

interface UseTransactionsOptions {
  year?: string;
  month?: string;
  autoFetch?: boolean;
}

export const useTransactions = (options: UseTransactionsOptions = {}) => {
  const dispatch = useAppDispatch();
  const { transactions, isLoading, error, lastFetched } = useAppSelector(
    (state) => state.transaction
  );

  const { year, month, autoFetch = true } = options;

  useEffect(() => {
    if (autoFetch) {
      initializeTransactions();
    }
  }, [autoFetch]);

  const initializeTransactions = async () => {
    try {
      await dispatch(loadTransactionsFromStorage()).unwrap();

      await dispatch(
        fetchAndStoreTransactions({
          clerkId: USER_ID,
          options: { year, month },
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to initialize transactions:", error);
    }
  };

  const refreshTransactions = async () => {
    try {
      await dispatch(
        fetchAndStoreTransactions({
          clerkId: USER_ID,
          options: { year, month },
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to refresh transactions:", error);
      throw error;
    }
  };

  const clearData = async () => {
    try {
      await dispatch(clearTransactionsStorage()).unwrap();
    } catch (error) {
      console.error("Failed to clear transactions:", error);
      throw error;
    }
  };

  const getMonthlyIncome = (targetYear: string, targetMonth: string) => {
    return (
      transactions?.categorySummaries?.[targetYear]?.income?.monthlyBreakdown?.[
        targetMonth
      ]?.amount || 0
    );
  };

  const getMonthlyExpenses = (targetYear: string, targetMonth: string) => {
    const categorySummaries = transactions?.categorySummaries?.[targetYear];
    if (!categorySummaries) return 0;

    return Object.entries(categorySummaries)
      .filter(([categoryName]) => categoryName !== "income")
      .reduce((sum, [_, categoryData]: [string, any]) => {
        const monthlyAmount =
          categoryData.monthlyBreakdown?.[targetMonth]?.amount || 0;
        return sum + monthlyAmount;
      }, 0);
  };

  const getExpenseCategories = (targetYear: string, targetMonth: string) => {
    const categorySummaries = transactions?.categorySummaries?.[targetYear];
    if (!categorySummaries) return [];

    const categoryEntries = Object.entries(categorySummaries);
    const expenseCategories = categoryEntries.filter(
      ([categoryName]) => categoryName !== "income"
    );

    const totalMonthlySpend = expenseCategories.reduce(
      (sum, [_, categoryData]: [string, any]) =>
        sum + (categoryData.monthlyBreakdown?.[targetMonth]?.amount || 0),
      0
    );

    return expenseCategories
      .map(([categoryName, categoryData]: [string, any]) => ({
        name: categoryName,
        monthlySpend: categoryData.monthlyBreakdown?.[targetMonth]?.amount || 0,
        totalSpend: totalMonthlySpend,
        transactionCount:
          categoryData.monthlyBreakdown?.[targetMonth]?.transactionCount || 0,
      }))
      .sort((a, b) => b.monthlySpend - a.monthlySpend);
  };

  const getMonthTransactions = (targetYear: string, targetMonth: string) => {
    return transactions?.transactions?.[targetYear]?.[targetMonth] || [];
  };

  const getTotalBalance = (targetYear: string, targetMonth: string) => {
    const income = getMonthlyIncome(targetYear, targetMonth);
    const expenses = getMonthlyExpenses(targetYear, targetMonth);
    return income - expenses;
  };

  const isDataStale = () => {
    if (!lastFetched) return true;
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - lastFetched > fiveMinutes;
  };

  return {
    // Raw data
    transactions,
    isLoading,
    error,
    lastFetched,

    // Actions
    initializeTransactions,
    refreshTransactions,
    clearData,

    // Helper functions
    getMonthlyIncome,
    getMonthlyExpenses,
    getExpenseCategories,
    getMonthTransactions,
    getTotalBalance,

    // Utilities
    isDataStale,
  };
};
