const categories = [
  { name: "Food", amount: 420.5, icon: "🍔", color: "bg-orange-500" },
  { name: "Transport", amount: 180.0, icon: "🚗", color: "bg-blue-500" },
  { name: "Shopping", amount: 320.8, icon: "🛒", color: "bg-pink-500" },
  {
    name: "Entertainment",
    amount: 150.2,
    icon: "🎬",
    color: "bg-purple-500",
  },
];

const recentTransactions = [
  {
    id: 1,
    title: "Grocery Store",
    category: "Food",
    amount: 85.5,
    date: "Today",
    time: "2:30 PM",
    isIncome: false,
  },
  {
    id: 2,
    title: "Uber Ride",
    category: "Transport",
    amount: 12.0,
    date: "Today",
    time: "10:15 AM",
    isIncome: false,
  },
  {
    id: 3,
    title: "Netflix Subscription",
    category: "Entertainment",
    amount: 15.99,
    date: "Yesterday",
    time: "6:00 PM",
    isIncome: false,
  },
  {
    id: 4,
    title: "Salary",
    category: "Income",
    amount: 3500.0,
    date: "Dec 1",
    time: "9:00 AM",
    isIncome: true,
  },
];
export { categories, recentTransactions };
