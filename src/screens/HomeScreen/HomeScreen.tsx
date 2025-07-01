import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryCard, SpendingChart, TransactionItem } from "@/components";
import { AddTransactionModal } from "@/components/modals";
import type { IconName } from "@/components/ui/CategoryIcon/icon-map";
import { useModal } from "@/contexts";
import { useTheme } from "@/hooks/useTheme";
import { useTransactions } from "@/hooks/useTransactions";
import { useAppSelector } from "@/store/hooks";
import { styles } from "./styles";

const HomeScreen = () => {
  const { colors } = useTheme();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const insets = useSafeAreaInsets();
  const { isAddTransactionModalVisible, closeAddTransactionModal } = useModal();

  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  const {
    transactions,
    isLoading,
    error,
    getMonthlyIncome,
    getMonthlyExpenses,
    getTotalBalance,
    getExpenseCategories,
    getCombinedMonthTransactions,
  } = useTransactions({ year, month });

  const monthlyIncome = getMonthlyIncome(year, month);
  const monthlyExpenses = getMonthlyExpenses(year, month);
  const totalBalance = getTotalBalance();
  const expenseCategories = getExpenseCategories(year, month);
  const currentMonthTransactions = getCombinedMonthTransactions(year, month);

  if (isLoading && !transactions) {
    return (
      <View
        style={[
          styles(colors).container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles(colors).sectionTitle}>Loading transactions...</Text>
      </View>
    );
  }

  if (error && !transactions) {
    return (
      <View
        style={[
          styles(colors).container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles(colors).sectionTitle}>
          Failed to load transactions
        </Text>
        <Text style={styles(colors).subtitle}>{error}</Text>
      </View>
    );
  }

  return (
    <>
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
              </Text>{" "}
              <View style={styles(colors).balanceDetails}>
                <View>
                  <Text style={styles(colors).balanceDetailLabel}>Income</Text>
                  <Text style={styles(colors).incomeAmount}>
                    +{monthlyIncome.toFixed(2)} €
                  </Text>
                </View>
                <View>
                  <Text style={styles(colors).balanceDetailLabel}>
                    Expenses
                  </Text>
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
              <Text style={styles(colors).sectionTitle}>
                Recent Transactions
              </Text>
              <TouchableOpacity>
                <Text style={styles(colors).seeAllButton}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles(colors).transactionsList}>
              {currentMonthTransactions
                .slice(0, 4)
                .map((transaction: any, index: number, array: any[]) => (
                  <TransactionItem
                    key={transaction._id}
                    data={transaction}
                    colors={colors}
                    isLast={index === array.length - 1}
                  />
                ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Expense Modal */}
      <AddTransactionModal
        isVisible={isAddTransactionModalVisible}
        onClose={closeAddTransactionModal}
      />
    </>
  );
};

export default HomeScreen;
