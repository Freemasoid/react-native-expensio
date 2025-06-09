type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "expense" | "income";
  category: string;
  date: string;
  description: string;
};

type MonthlyTransactions = {
  [month: string]: Transaction[];
};

type YearlyTransactions = {
  [year: string]: MonthlyTransactions;
};

type CategorySummary = {
  name: string;
  monthlySpend: number;
  transactionCount: number;
  lastUpdated: string;
};

type YearlyCategorySummary = {
  [category: string]: {
    name: string;
    yearlySpend: number;
    monthlyBreakdown: {
      [month: string]: CategorySummary;
    };
  };
};

type TransactionData = {
  totalSpend: number;
  totalIncome: number;
  transactions: YearlyTransactions;
  categorySummaries: {
    [year: string]: YearlyCategorySummary;
  };
};

export {
  CategorySummary,
  MonthlyTransactions,
  Transaction,
  TransactionData,
  YearlyCategorySummary,
  YearlyTransactions,
};
