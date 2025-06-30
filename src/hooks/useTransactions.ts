import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addTransactionPending } from "@/store/slices/transactionSlice";
import {
  addTransactionOptimistic,
  clearTransactionsStorage,
  fetchAndStoreTransactions,
  loadTransactionsFromStorage,
  savePendingTransaction,
} from "@/store/thunks/transactionThunk";
import { NewTransaction, Transaction } from "@/types/types";
import { USER_ID } from "@env";
import { useEffect, useMemo } from "react";

interface UseTransactionsOptions {
  year?: string;
  month?: string;
  autoFetch?: boolean;
}

export const useTransactions = (options: UseTransactionsOptions = {}) => {
  const dispatch = useAppDispatch();
  const { transactions, pendingTransactions, isLoading, error, lastFetched } =
    useAppSelector((state) => state.transaction);

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

  const addTransactionOptimistically = async (
    newTransaction: NewTransaction
  ) => {
    try {
      dispatch(addTransactionPending(newTransaction));

      const pendingTransaction = {
        ...newTransaction,
        tempId: `temp_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 11)}`,
        isPending: true as const,
        createdAt: new Date().toISOString(),
      };

      await savePendingTransaction(pendingTransaction);

      await dispatch(
        addTransactionOptimistic({
          clerkId: USER_ID,
          transactionData: newTransaction,
          tempId: pendingTransaction.tempId,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to add transaction optimistically:", error);
      throw error;
    }
  };

  const getMonthlyIncome = (targetYear: string, targetMonth: string) => {
    const storedIncome =
      transactions?.categorySummaries?.[targetYear]?.income?.monthlyBreakdown?.[
        targetMonth
      ]?.amount || 0;

    const pendingIncome = pendingTransactions
      .filter((pending) => {
        const pendingDate = new Date(pending.date);
        const pendingYear = pendingDate.getFullYear().toString();
        const pendingMonth = (pendingDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        return (
          pendingYear === targetYear &&
          pendingMonth === targetMonth &&
          pending.type === "income"
        );
      })
      .reduce((sum, pending) => sum + pending.amount, 0);

    return storedIncome + pendingIncome;
  };

  const getMonthlyExpenses = (targetYear: string, targetMonth: string) => {
    const categorySummaries = transactions?.categorySummaries?.[targetYear];

    const storedExpenses = categorySummaries
      ? Object.entries(categorySummaries)
          .filter(([categoryName]) => categoryName !== "income")
          .reduce((sum, [_, categoryData]: [string, any]) => {
            const monthlyAmount =
              categoryData.monthlyBreakdown?.[targetMonth]?.amount || 0;
            return sum + monthlyAmount;
          }, 0)
      : 0;

    const pendingExpenses = pendingTransactions
      .filter((pending) => {
        const pendingDate = new Date(pending.date);
        const pendingYear = pendingDate.getFullYear().toString();
        const pendingMonth = (pendingDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        return (
          pendingYear === targetYear &&
          pendingMonth === targetMonth &&
          pending.type === "expense"
        );
      })
      .reduce((sum, pending) => sum + pending.amount, 0);

    return storedExpenses + pendingExpenses;
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

  const getCombinedMonthTransactions = useMemo(() => {
    return (targetYear: string, targetMonth: string): Transaction[] => {
      const realTransactions = getMonthTransactions(targetYear, targetMonth);

      const relevantPendingTransactions = pendingTransactions
        .filter((pending) => {
          const pendingDate = new Date(pending.date);
          const pendingYear = pendingDate.getFullYear().toString();
          const pendingMonth = (pendingDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          return pendingYear === targetYear && pendingMonth === targetMonth;
        })
        .map((pending) => ({
          ...pending,
          _id: pending.tempId,
          createdAt: pending.createdAt,
          updatedAt: pending.createdAt,
        })) as Transaction[];

      const combined = [...realTransactions, ...relevantPendingTransactions];
      return combined.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    };
  }, [transactions, pendingTransactions]);

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
    pendingTransactions,
    isLoading,
    error,
    lastFetched,

    // Actions
    initializeTransactions,
    refreshTransactions,
    clearData,
    addTransactionOptimistically,

    // Helper functions
    getMonthlyIncome,
    getMonthlyExpenses,
    getExpenseCategories,
    getMonthTransactions,
    getCombinedMonthTransactions,
    getTotalBalance,

    // Utilities
    isDataStale,
  };
};
