type Transaction = {
  _id?: string;
  title: string;
  amount: number;
  type: "expense" | "income";
  category: string;
  date: string;
  newDate?: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  _v?: number;
};

type NewTransaction = Pick<
  Transaction,
  "title" | "amount" | "type" | "category" | "date" | "description"
>;

type PendingTransaction = NewTransaction & {
  tempId: string;
  isPending: true;
  createdAt: string;
};

type MonthlyTransactions = {
  [month: string]: Transaction[];
};

type YearlyTransactions = {
  [year: string]: MonthlyTransactions;
};

type CategorySummary = {
  amount: number;
  transactionCount: number;
  lastUpdated: string;
};

type YearlyCategorySummary = {
  [category: string]: {
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
  NewTransaction,
  PendingTransaction,
  Transaction,
  TransactionData,
  YearlyCategorySummary,
  YearlyTransactions,
};
