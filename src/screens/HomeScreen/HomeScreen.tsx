import { CategoryCard, SpendingChart, TransactionItem } from "@/components";
import type { IconName } from "@/components/ui/CategoryIcon/icon-map";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { transactionData } from "./mock-data";
import { styles } from "./styles";

const HomeScreen = () => {
  const { colors } = useTheme();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const insets = useSafeAreaInsets();
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] =
    useState(false);

  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  const currentMonthTransactions =
    transactionData.transactions[year]?.[month] || [];

  const monthlyIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [currentMonthTransactions]);

  const monthlyExpenses = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [currentMonthTransactions]);

  const totalBalance = useMemo(() => {
    return monthlyIncome - monthlyExpenses;
  }, [monthlyExpenses, monthlyIncome]);

  const expenseCategories = useMemo(() => {
    const currentYearCategories = transactionData.categorySummaries[year];
    if (!currentYearCategories) return [];

    const expenseCategories = Object.values(currentYearCategories).filter(
      (category) => category.name !== "income"
    );

    // Calculate total monthly spend across all expense categories
    const totalMonthlySpend = expenseCategories.reduce(
      (sum, category) =>
        sum + (category.monthlyBreakdown[month]?.monthlySpend || 0),
      0
    );

    return expenseCategories
      .map((category) => ({
        name: category.name,
        monthlySpend: category.monthlyBreakdown[month]?.monthlySpend || 0,
        totalSpend: totalMonthlySpend,
        transactionCount:
          category.monthlyBreakdown[month]?.transactionCount || 0,
      }))
      .sort((a, b) => b.monthlySpend - a.monthlySpend);
  }, [year, month]);

  return (
    <ScrollView style={styles(colors).container}>
      <LinearGradient
        colors={
          currentTheme === "primaryYellow"
            ? [colors.primary[300], colors.primary_accent[300]]
            : [colors.primary[500], colors.primary_accent[500]]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles(colors).header, { paddingTop: insets.top }]}
      >
        <View style={styles(colors).headerContent}>
          <View style={styles(colors).headerTop}>
            <View>
              <Text style={styles(colors).greeting}>Hello, John!</Text>
              <Text style={styles(colors).subtitle}>Track your expenses</Text>
            </View>

            <View>
              <View style={styles(colors).avatarContainer}>
                <User
                  size={24}
                  color="white"
                />
              </View>
            </View>
          </View>

          <BlurView
            intensity={20}
            style={styles(colors).balanceCard}
          >
            <Text style={styles(colors).balanceLabel}>Total Balance</Text>
            <Text style={styles(colors).balanceAmount}>
              {totalBalance.toFixed(2)} €
            </Text>
            <View style={styles(colors).balanceDetails}>
              <View>
                <Text style={styles(colors).balanceDetailLabel}>Income</Text>
                <Text style={styles(colors).incomeAmount}>
                  +{monthlyIncome.toFixed(2)} €
                </Text>
              </View>
              <View>
                <Text style={styles(colors).balanceDetailLabel}>Expenses</Text>
                <Text style={styles(colors).expenseAmount}>
                  -{monthlyExpenses.toFixed(2)} €
                </Text>
              </View>
            </View>
          </BlurView>
        </View>
      </LinearGradient>

      <View style={styles(colors).content}>
        {/* spending chart */}
        <View style={styles(colors).section}>
          <Text style={styles(colors).sectionTitle}>Weekly Spending</Text>
          <SpendingChart colors={colors} />
        </View>

        {/* categories */}
        <View style={styles(colors).section}>
          <Text style={styles(colors).sectionTitle}>Categories</Text>
          {expenseCategories.slice(0, 4).map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name as IconName}
              totalSpend={category.totalSpend}
              monthlySpend={category.monthlySpend}
              colors={colors}
            />
          ))}
        </View>

        {/* recent transactions */}
        <View style={styles(colors).section}>
          <View style={styles(colors).transactionsHeader}>
            <Text style={styles(colors).sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles(colors).seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles(colors).transactionsList}>
            {currentMonthTransactions
              .slice(0, 4)
              .map((transaction, index, array) => (
                <TransactionItem
                  key={transaction.id}
                  data={transaction}
                  colors={colors}
                  isLast={index === array.length - 1}
                />
              ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
