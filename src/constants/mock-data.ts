import { TransactionData } from "@/types/types";

const transactionData: TransactionData = {
  totalSpend: 0,
  totalIncome: 0,
  transactions: {
    "2025": {
      "06": [
        {
          _id: "1",
          title: "Grocery Store",
          category: "food",
          amount: 85.5,
          type: "expense",
          date: "2025-06-20T14:30:00Z",
          description: "Groceries for the week",
        },
        {
          _id: "2",
          title: "Uber Ride",
          category: "transport",
          amount: 12.0,
          type: "expense",
          date: "2025-06-20T10:15:00Z",
          description: "Uber ride to the office",
        },
        {
          _id: "3",
          title: "Netflix Subscription",
          category: "entertainment",
          amount: 15.99,
          type: "expense",
          date: "2025-06-19T18:00:00Z",
          description: "Netflix subscription",
        },
        {
          _id: "4",
          title: "Salary",
          category: "income",
          amount: 3500.0,
          type: "income",
          date: "2025-06-01T09:00:00Z",
          description: "Monthly salary",
        },
        {
          _id: "5",
          title: "Starbucks Coffee",
          category: "coffee",
          amount: 4.95,
          type: "expense",
          date: "2025-06-20T08:45:00Z",
          description: "Starbucks coffee",
        },
        {
          _id: "6",
          title: "PlayStation Plus",
          category: "gaming",
          amount: 59.99,
          type: "expense",
          date: "2025-06-19T15:20:00Z",
          description: "PlayStation Plus subscription",
        },
        {
          _id: "7",
          title: "Flight to Paris",
          category: "travel",
          amount: 450.0,
          type: "expense",
          date: "2025-06-18T11:30:00Z",
          description: "Flight to Paris",
        },
        {
          _id: "8",
          title: "Doctor Visit",
          category: "health",
          amount: 120.0,
          type: "expense",
          date: "2025-06-17T14:00:00Z",
          description: "Doctor visit",
        },
        {
          _id: "9",
          title: "Zara Shopping",
          category: "shopping",
          amount: 129.99,
          type: "expense",
          date: "2025-06-16T16:45:00Z",
          description: "Zara shopping",
        },
        {
          _id: "10",
          title: "Rent Payment",
          category: "home",
          amount: 1200.0,
          type: "expense",
          date: "2025-06-15T09:00:00Z",
          description: "Rent payment",
        },
        {
          _id: "11",
          title: "Freelance Project",
          category: "income",
          amount: 800.0,
          type: "income",
          date: "2025-06-14T17:30:00Z",
          description: "Freelance project",
        },
        {
          _id: "12",
          title: "Dental Checkup",
          category: "health",
          amount: 85.0,
          type: "expense",
          date: "2025-06-13T10:00:00Z",
          description: "Dental checkup",
        },
        {
          _id: "13",
          title: "Restaurant Dinner",
          category: "food",
          amount: 65.0,
          type: "expense",
          date: "2025-06-19T20:00:00Z",
          description: "Dinner at Italian restaurant",
        },
        {
          _id: "14",
          title: "Train Ticket",
          category: "transport",
          amount: 25.0,
          type: "expense",
          date: "2025-06-18T08:30:00Z",
          description: "Train ticket to city center",
        },
        {
          _id: "15",
          title: "Movie Tickets",
          category: "entertainment",
          amount: 24.0,
          type: "expense",
          date: "2025-06-17T19:00:00Z",
          description: "Movie tickets for two",
        },
        {
          _id: "16",
          title: "Local Cafe",
          category: "coffee",
          amount: 3.5,
          type: "expense",
          date: "2025-06-19T09:15:00Z",
          description: "Morning coffee at local cafe",
        },
        {
          _id: "17",
          title: "Xbox Game",
          category: "gaming",
          amount: 49.99,
          type: "expense",
          date: "2025-06-16T14:00:00Z",
          description: "New Xbox game purchase",
        },
        {
          _id: "18",
          title: "Hotel Booking",
          category: "travel",
          amount: 200.0,
          type: "expense",
          date: "2025-06-15T12:00:00Z",
          description: "Hotel booking for weekend trip",
        },
        {
          _id: "19",
          title: "H&M Shopping",
          category: "shopping",
          amount: 89.99,
          type: "expense",
          date: "2025-06-14T15:30:00Z",
          description: "Clothes shopping at H&M",
        },
        {
          _id: "20",
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
        yearlySpend: 150.5,
        monthlyBreakdown: {
          "01": {
            amount: 142.5,
            transactionCount: 3,
            lastUpdated: "2025-01-20T14:30:00Z",
          },
          "02": {
            amount: 138.75,
            transactionCount: 2,
            lastUpdated: "2025-02-20T14:30:00Z",
          },
          "03": {
            amount: 145.25,
            transactionCount: 3,
            lastUpdated: "2025-03-20T14:30:00Z",
          },
          "04": {
            amount: 135.0,
            transactionCount: 2,
            lastUpdated: "2025-04-20T14:30:00Z",
          },
          "05": {
            amount: 148.5,
            transactionCount: 3,
            lastUpdated: "2025-05-20T14:30:00Z",
          },
          "06": {
            amount: 150.5,
            transactionCount: 2,
            lastUpdated: "2025-06-20T14:30:00Z",
          },
        },
      },
      transport: {
        yearlySpend: 37.0,
        monthlyBreakdown: {
          "01": {
            amount: 35.5,
            transactionCount: 3,
            lastUpdated: "2025-01-20T10:15:00Z",
          },
          "02": {
            amount: 32.75,
            transactionCount: 2,
            lastUpdated: "2025-02-20T10:15:00Z",
          },
          "03": {
            amount: 38.25,
            transactionCount: 3,
            lastUpdated: "2025-03-20T10:15:00Z",
          },
          "04": {
            amount: 34.0,
            transactionCount: 2,
            lastUpdated: "2025-04-20T10:15:00Z",
          },
          "05": {
            amount: 36.5,
            transactionCount: 3,
            lastUpdated: "2025-05-20T10:15:00Z",
          },
          "06": {
            amount: 37.0,
            transactionCount: 2,
            lastUpdated: "2025-06-20T10:15:00Z",
          },
        },
      },
      entertainment: {
        yearlySpend: 39.99,
        monthlyBreakdown: {
          "01": {
            amount: 42.99,
            transactionCount: 3,
            lastUpdated: "2025-01-19T18:00:00Z",
          },
          "02": {
            amount: 38.99,
            transactionCount: 2,
            lastUpdated: "2025-02-19T18:00:00Z",
          },
          "03": {
            amount: 41.99,
            transactionCount: 3,
            lastUpdated: "2025-03-19T18:00:00Z",
          },
          "04": {
            amount: 37.99,
            transactionCount: 2,
            lastUpdated: "2025-04-19T18:00:00Z",
          },
          "05": {
            amount: 40.99,
            transactionCount: 3,
            lastUpdated: "2025-05-19T18:00:00Z",
          },
          "06": {
            amount: 39.99,
            transactionCount: 2,
            lastUpdated: "2025-06-19T18:00:00Z",
          },
        },
      },
      income: {
        yearlySpend: 4300.0,
        monthlyBreakdown: {
          "01": {
            amount: 4200.0,
            transactionCount: 2,
            lastUpdated: "2025-01-14T17:30:00Z",
          },
          "02": {
            amount: 4250.0,
            transactionCount: 2,
            lastUpdated: "2025-02-14T17:30:00Z",
          },
          "03": {
            amount: 4280.0,
            transactionCount: 2,
            lastUpdated: "2025-03-14T17:30:00Z",
          },
          "04": {
            amount: 4260.0,
            transactionCount: 2,
            lastUpdated: "2025-04-14T17:30:00Z",
          },
          "05": {
            amount: 4290.0,
            transactionCount: 2,
            lastUpdated: "2025-05-14T17:30:00Z",
          },
          "06": {
            amount: 4300.0,
            transactionCount: 2,
            lastUpdated: "2025-06-14T17:30:00Z",
          },
        },
      },
      coffee: {
        yearlySpend: 8.45,
        monthlyBreakdown: {
          "01": {
            amount: 7.95,
            transactionCount: 3,
            lastUpdated: "2025-01-19T09:15:00Z",
          },
          "02": {
            amount: 7.45,
            transactionCount: 2,
            lastUpdated: "2025-02-19T09:15:00Z",
          },
          "03": {
            amount: 8.25,
            transactionCount: 3,
            lastUpdated: "2025-03-19T09:15:00Z",
          },
          "04": {
            amount: 7.75,
            transactionCount: 2,
            lastUpdated: "2025-04-19T09:15:00Z",
          },
          "05": {
            amount: 8.15,
            transactionCount: 3,
            lastUpdated: "2025-05-19T09:15:00Z",
          },
          "06": {
            amount: 8.45,
            transactionCount: 2,
            lastUpdated: "2025-06-19T09:15:00Z",
          },
        },
      },
      gaming: {
        yearlySpend: 19.99,
        monthlyBreakdown: {
          "01": {
            amount: 18.99,
            transactionCount: 3,
            lastUpdated: "2025-01-18T12:00:00Z",
          },
          "02": {
            amount: 17.99,
            transactionCount: 2,
            lastUpdated: "2025-02-18T12:00:00Z",
          },
          "03": {
            amount: 19.49,
            transactionCount: 3,
            lastUpdated: "2025-03-18T12:00:00Z",
          },
          "04": {
            amount: 18.49,
            transactionCount: 2,
            lastUpdated: "2025-04-18T12:00:00Z",
          },
          "05": {
            amount: 19.25,
            transactionCount: 3,
            lastUpdated: "2025-05-18T12:00:00Z",
          },
          "06": {
            amount: 19.99,
            transactionCount: 2,
            lastUpdated: "2025-06-18T12:00:00Z",
          },
        },
      },
      travel: {
        yearlySpend: 475.0,
        monthlyBreakdown: {
          "01": {
            amount: 450.0,
            transactionCount: 3,
            lastUpdated: "2025-01-17T16:45:00Z",
          },
          "02": {
            amount: 425.0,
            transactionCount: 2,
            lastUpdated: "2025-02-17T16:45:00Z",
          },
          "03": {
            amount: 462.5,
            transactionCount: 3,
            lastUpdated: "2025-03-17T16:45:00Z",
          },
          "04": {
            amount: 437.5,
            transactionCount: 2,
            lastUpdated: "2025-04-17T16:45:00Z",
          },
          "05": {
            amount: 468.75,
            transactionCount: 3,
            lastUpdated: "2025-05-17T16:45:00Z",
          },
          "06": {
            amount: 475.0,
            transactionCount: 2,
            lastUpdated: "2025-06-17T16:45:00Z",
          },
        },
      },
      health: {
        yearlySpend: 85.0,
        monthlyBreakdown: {
          "01": {
            amount: 80.0,
            transactionCount: 3,
            lastUpdated: "2025-01-16T11:15:00Z",
          },
          "02": {
            amount: 75.0,
            transactionCount: 2,
            lastUpdated: "2025-02-16T11:15:00Z",
          },
          "03": {
            amount: 82.5,
            transactionCount: 3,
            lastUpdated: "2025-03-16T11:15:00Z",
          },
          "04": {
            amount: 77.5,
            transactionCount: 2,
            lastUpdated: "2025-04-16T11:15:00Z",
          },
          "05": {
            amount: 83.75,
            transactionCount: 3,
            lastUpdated: "2025-05-16T11:15:00Z",
          },
          "06": {
            amount: 85.0,
            transactionCount: 2,
            lastUpdated: "2025-06-16T11:15:00Z",
          },
        },
      },
      shopping: {
        yearlySpend: 138.0,
        monthlyBreakdown: {
          "01": {
            amount: 130.0,
            transactionCount: 3,
            lastUpdated: "2025-01-15T13:45:00Z",
          },
          "02": {
            amount: 125.0,
            transactionCount: 2,
            lastUpdated: "2025-02-15T13:45:00Z",
          },
          "03": {
            amount: 135.0,
            transactionCount: 3,
            lastUpdated: "2025-03-15T13:45:00Z",
          },
          "04": {
            amount: 128.0,
            transactionCount: 2,
            lastUpdated: "2025-04-15T13:45:00Z",
          },
          "05": {
            amount: 136.5,
            transactionCount: 3,
            lastUpdated: "2025-05-15T13:45:00Z",
          },
          "06": {
            amount: 138.0,
            transactionCount: 2,
            lastUpdated: "2025-06-15T13:45:00Z",
          },
        },
      },
      home: {
        yearlySpend: 195.0,
        monthlyBreakdown: {
          "01": {
            amount: 185.0,
            transactionCount: 3,
            lastUpdated: "2025-01-14T14:20:00Z",
          },
          "02": {
            amount: 175.0,
            transactionCount: 2,
            lastUpdated: "2025-02-14T14:20:00Z",
          },
          "03": {
            amount: 190.0,
            transactionCount: 3,
            lastUpdated: "2025-03-14T14:20:00Z",
          },
          "04": {
            amount: 180.0,
            transactionCount: 2,
            lastUpdated: "2025-04-14T14:20:00Z",
          },
          "05": {
            amount: 192.5,
            transactionCount: 3,
            lastUpdated: "2025-05-14T14:20:00Z",
          },
          "06": {
            amount: 195.0,
            transactionCount: 2,
            lastUpdated: "2025-06-14T14:20:00Z",
          },
        },
      },
    },
  },
};

export { transactionData };
