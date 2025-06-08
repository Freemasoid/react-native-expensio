interface Transaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  type: "expense" | "income";
  date: string;
  description: string;
}

interface MonthlyTransactions {
  [month: string]: Transaction[];
}

interface YearlyTransactions {
  [year: string]: MonthlyTransactions;
}

interface CategorySummary {
  name: string;
  monthlySpend: number;
  transactionCount: number;
  lastUpdated: string;
}

interface YearlyCategorySummary {
  [category: string]: {
    name: string;
    yearlySpend: number;
    monthlyBreakdown: {
      [month: string]: CategorySummary;
    };
  };
}

interface TransactionData {
  totalSpend: number;
  totalIncome: number;
  transactions: YearlyTransactions;
  categorySummaries: {
    [year: string]: YearlyCategorySummary;
  };
}

const transactionData: TransactionData = {
  totalSpend: 0,
  totalIncome: 0,
  transactions: {
    "2025": {
      "06": [
        {
          id: 1,
          title: "Grocery Store",
          category: "food",
          amount: 85.5,
          type: "expense",
          date: "2025-06-20T14:30:00Z",
          description: "Groceries for the week",
        },
        {
          id: 2,
          title: "Uber Ride",
          category: "transport",
          amount: 12.0,
          type: "expense",
          date: "2025-06-20T10:15:00Z",
          description: "Uber ride to the office",
        },
        {
          id: 3,
          title: "Netflix Subscription",
          category: "entertainment",
          amount: 15.99,
          type: "expense",
          date: "2025-06-19T18:00:00Z",
          description: "Netflix subscription",
        },
        {
          id: 4,
          title: "Salary",
          category: "income",
          amount: 3500.0,
          type: "income",
          date: "2025-06-01T09:00:00Z",
          description: "Monthly salary",
        },
        {
          id: 5,
          title: "Starbucks Coffee",
          category: "coffee",
          amount: 4.95,
          type: "expense",
          date: "2025-06-20T08:45:00Z",
          description: "Starbucks coffee",
        },
        {
          id: 6,
          title: "PlayStation Plus",
          category: "gaming",
          amount: 59.99,
          type: "expense",
          date: "2025-06-19T15:20:00Z",
          description: "PlayStation Plus subscription",
        },
        {
          id: 7,
          title: "Flight to Paris",
          category: "travel",
          amount: 450.0,
          type: "expense",
          date: "2025-06-18T11:30:00Z",
          description: "Flight to Paris",
        },
        {
          id: 8,
          title: "Doctor Visit",
          category: "health",
          amount: 120.0,
          type: "expense",
          date: "2025-06-17T14:00:00Z",
          description: "Doctor visit",
        },
        {
          id: 9,
          title: "Zara Shopping",
          category: "shopping",
          amount: 129.99,
          type: "expense",
          date: "2025-06-16T16:45:00Z",
          description: "Zara shopping",
        },
        {
          id: 10,
          title: "Rent Payment",
          category: "home",
          amount: 1200.0,
          type: "expense",
          date: "2025-06-15T09:00:00Z",
          description: "Rent payment",
        },
        {
          id: 11,
          title: "Freelance Project",
          category: "income",
          amount: 800.0,
          type: "income",
          date: "2025-06-14T17:30:00Z",
          description: "Freelance project",
        },
        {
          id: 12,
          title: "Dental Checkup",
          category: "health",
          amount: 85.0,
          type: "expense",
          date: "2025-06-13T10:00:00Z",
          description: "Dental checkup",
        },
        {
          id: 13,
          title: "Restaurant Dinner",
          category: "food",
          amount: 65.0,
          type: "expense",
          date: "2025-06-19T20:00:00Z",
          description: "Dinner at Italian restaurant",
        },
        {
          id: 14,
          title: "Train Ticket",
          category: "transport",
          amount: 25.0,
          type: "expense",
          date: "2025-06-18T08:30:00Z",
          description: "Train ticket to city center",
        },
        {
          id: 15,
          title: "Movie Tickets",
          category: "entertainment",
          amount: 24.0,
          type: "expense",
          date: "2025-06-17T19:00:00Z",
          description: "Movie tickets for two",
        },
        {
          id: 16,
          title: "Local Cafe",
          category: "coffee",
          amount: 3.5,
          type: "expense",
          date: "2025-06-19T09:15:00Z",
          description: "Morning coffee at local cafe",
        },
        {
          id: 17,
          title: "Xbox Game",
          category: "gaming",
          amount: 49.99,
          type: "expense",
          date: "2025-06-16T14:00:00Z",
          description: "New Xbox game purchase",
        },
        {
          id: 18,
          title: "Hotel Booking",
          category: "travel",
          amount: 200.0,
          type: "expense",
          date: "2025-06-15T12:00:00Z",
          description: "Hotel booking for weekend trip",
        },
        {
          id: 19,
          title: "H&M Shopping",
          category: "shopping",
          amount: 89.99,
          type: "expense",
          date: "2025-06-14T15:30:00Z",
          description: "Clothes shopping at H&M",
        },
        {
          id: 20,
          title: "Electricity Bill",
          category: "home",
          amount: 85.0,
          type: "expense",
          date: "2025-06-13T10:00:00Z",
          description: "Monthly electricity bill",
        },
      ],
    },
  },
  categorySummaries: {
    "2025": {
      food: {
        name: "food",
        yearlySpend: 150.5,
        monthlyBreakdown: {
          "06": {
            name: "food",
            monthlySpend: 150.5,
            transactionCount: 2,
            lastUpdated: "2025-06-20T14:30:00Z",
          },
        },
      },
      transport: {
        name: "transport",
        yearlySpend: 37.0,
        monthlyBreakdown: {
          "06": {
            name: "transport",
            monthlySpend: 37.0,
            transactionCount: 2,
            lastUpdated: "2025-06-20T10:15:00Z",
          },
        },
      },
      entertainment: {
        name: "entertainment",
        yearlySpend: 39.99,
        monthlyBreakdown: {
          "06": {
            name: "entertainment",
            monthlySpend: 39.99,
            transactionCount: 2,
            lastUpdated: "2025-06-19T18:00:00Z",
          },
        },
      },
      income: {
        name: "income",
        yearlySpend: 4300.0,
        monthlyBreakdown: {
          "06": {
            name: "income",
            monthlySpend: 4300.0,
            transactionCount: 2,
            lastUpdated: "2025-06-14T17:30:00Z",
          },
        },
      },
      coffee: {
        name: "coffee",
        yearlySpend: 8.45,
        monthlyBreakdown: {
          "06": {
            name: "coffee",
            monthlySpend: 8.45,
            transactionCount: 2,
            lastUpdated: "2025-06-19T09:15:00Z",
          },
        },
      },
      gaming: {
        name: "gaming",
        yearlySpend: 109.98,
        monthlyBreakdown: {
          "06": {
            name: "gaming",
            monthlySpend: 109.98,
            transactionCount: 2,
            lastUpdated: "2025-06-16T14:00:00Z",
          },
        },
      },
      travel: {
        name: "travel",
        yearlySpend: 650.0,
        monthlyBreakdown: {
          "06": {
            name: "travel",
            monthlySpend: 650.0,
            transactionCount: 2,
            lastUpdated: "2025-06-15T12:00:00Z",
          },
        },
      },
      health: {
        name: "health",
        yearlySpend: 205.0,
        monthlyBreakdown: {
          "06": {
            name: "health",
            monthlySpend: 205.0,
            transactionCount: 2,
            lastUpdated: "2025-06-17T14:00:00Z",
          },
        },
      },
      shopping: {
        name: "shopping",
        yearlySpend: 219.98,
        monthlyBreakdown: {
          "06": {
            name: "shopping",
            monthlySpend: 219.98,
            transactionCount: 2,
            lastUpdated: "2025-06-16T16:45:00Z",
          },
        },
      },
      home: {
        name: "home",
        yearlySpend: 1285.0,
        monthlyBreakdown: {
          "06": {
            name: "home",
            monthlySpend: 1285.0,
            transactionCount: 2,
            lastUpdated: "2025-06-15T09:00:00Z",
          },
        },
      },
    },
  },
};

export { transactionData };
