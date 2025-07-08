import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Calendar, Search } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TransactionItem } from "@/components";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { useTheme } from "@/hooks/useTheme";
import { useTransactions } from "@/hooks/useTransactions";
import { useAppSelector } from "@/store/hooks";
import { Transaction } from "@/types/types";
import { styles } from "./styles";

interface MonthlyTransactions {
  monthYear: string;
  displayName: string;
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
}

interface TransactionsScreenProps {
  onBack?: () => void;
}

const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "income" | "expense"
  >("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | undefined
  >(undefined);

  const { transactions, isLoading, error, getCombinedMonthTransactions } =
    useTransactions();

  const monthlyTransactions = useMemo(() => {
    if (!transactions?.transactions) return [];

    const monthlyData: MonthlyTransactions[] = [];

    Object.keys(transactions.transactions).forEach((year) => {
      Object.keys(transactions.transactions[year]).forEach((month) => {
        const monthTransactions = getCombinedMonthTransactions(year, month);

        if (monthTransactions.length > 0) {
          const monthYear = `${year}-${month}`;
          const date = new Date(parseInt(year), parseInt(month) - 1);
          const displayName = date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });

          const totalIncome = monthTransactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

          const totalExpenses = monthTransactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

          monthlyData.push({
            monthYear,
            displayName,
            transactions: monthTransactions,
            totalIncome,
            totalExpenses,
          });
        }
      });
    });

    return monthlyData.sort((a, b) => b.monthYear.localeCompare(a.monthYear));
  }, [transactions, getCombinedMonthTransactions]);

  const filteredTransactions = useMemo(() => {
    return monthlyTransactions
      .map((monthData) => {
        const filtered = monthData.transactions.filter((transaction) => {
          const matchesSearch =
            transaction.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            transaction.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (transaction.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ??
              false);

          const matchesFilter =
            selectedFilter === "all" || transaction.type === selectedFilter;

          return matchesSearch && matchesFilter;
        });

        return {
          ...monthData,
          transactions: filtered,
        };
      })
      .filter((monthData) => monthData.transactions.length > 0);
  }, [monthlyTransactions, searchQuery, selectedFilter]);

  const handleTransactionPress = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedTransaction(undefined);
  }, []);

  const handleFilterPress = useCallback(
    (filter: "all" | "income" | "expense") => {
      setSelectedFilter(filter);
    },
    []
  );

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const renderMonthSection = useCallback(
    ({ item }: { item: MonthlyTransactions }) => (
      <View style={styles(colors).monthSection}>
        <View style={styles(colors).monthHeader}>
          <View style={styles(colors).monthInfo}>
            <Text style={styles(colors).monthTitle}>{item.displayName}</Text>
            <Text style={styles(colors).monthStats}>
              {item.transactions.length} transaction
              {item.transactions.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <View style={styles(colors).monthSummary}>
            <Text style={styles(colors).monthIncome}>
              +€{item.totalIncome.toFixed(2)}
            </Text>
            <Text style={styles(colors).monthExpenses}>
              -€{item.totalExpenses.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles(colors).transactionsList}>
          {item.transactions.map((transaction, index) => (
            <TouchableOpacity
              key={transaction._id}
              onPress={() => handleTransactionPress(transaction)}
              activeOpacity={0.7}
            >
              <TransactionItem
                data={transaction}
                colors={colors}
                isLast={index === item.transactions.length - 1}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),
    [colors, handleTransactionPress]
  );

  const renderHeader = useMemo(
    () => (
      <View style={styles(colors).searchAndFilter}>
        {/* Search Bar */}
        <View style={styles(colors).searchContainer}>
          <Search
            size={20}
            color={colors.primary[400]}
          />
          <TextInput
            style={styles(colors).searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={colors.primary[300]}
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        {/* Filter Buttons */}
        <View style={styles(colors).filterContainer}>
          <TouchableOpacity
            style={[
              styles(colors).filterButton,
              selectedFilter === "all" && styles(colors).activeFilterButton,
            ]}
            onPress={() => handleFilterPress("all")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles(colors).filterButtonText,
                selectedFilter === "all" &&
                  styles(colors).activeFilterButtonText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles(colors).filterButton,
              selectedFilter === "income" && styles(colors).activeFilterButton,
            ]}
            onPress={() => handleFilterPress("income")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles(colors).filterButtonText,
                selectedFilter === "income" &&
                  styles(colors).activeFilterButtonText,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles(colors).filterButton,
              selectedFilter === "expense" && styles(colors).activeFilterButton,
            ]}
            onPress={() => handleFilterPress("expense")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles(colors).filterButtonText,
                selectedFilter === "expense" &&
                  styles(colors).activeFilterButtonText,
              ]}
            >
              Expenses
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [colors, searchQuery, selectedFilter, handleSearchChange, handleFilterPress]
  );

  const renderEmptyState = useMemo(
    () => (
      <View style={styles(colors).emptyState}>
        <Calendar
          size={48}
          color={colors.primary[300]}
        />
        <Text style={styles(colors).emptyStateTitle}>
          {searchQuery || selectedFilter !== "all"
            ? "No transactions found"
            : "No transactions yet"}
        </Text>
        <Text style={styles(colors).emptyStateSubtitle}>
          {searchQuery || selectedFilter !== "all"
            ? "Try adjusting your search or filter"
            : "Start tracking your expenses and income"}
        </Text>
      </View>
    ),
    [colors, searchQuery, selectedFilter]
  );

  if (isLoading && !transactions) {
    return (
      <View style={styles(colors).container}>
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
            {onBack && (
              <TouchableOpacity
                onPress={onBack}
                style={{ marginRight: 16 }}
              >
                <ArrowLeft
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            )}
            <View style={styles(colors).headerText}>
              <View>
                <Text style={styles(colors).headerTitle}>Transactions</Text>
                <Text style={styles(colors).headerSubtitle}>
                  View all your transactions
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={styles(colors).loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary[500]}
          />
          <Text style={styles(colors).loadingText}>
            Loading transactions...
          </Text>
        </View>
      </View>
    );
  }

  if (error && !transactions) {
    return (
      <View style={styles(colors).container}>
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
            {onBack && (
              <TouchableOpacity
                onPress={onBack}
                style={{ marginRight: 16 }}
              >
                <ArrowLeft
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            )}
            <View style={styles(colors).headerText}>
              <View>
                <Text style={styles(colors).headerTitle}>Transactions</Text>
                <Text style={styles(colors).headerSubtitle}>
                  View all your transactions
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={styles(colors).errorContainer}>
          <Text style={styles(colors).errorTitle}>
            Failed to load transactions
          </Text>
          <Text style={styles(colors).errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles(colors).container}>
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
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={{ marginRight: 16 }}
            >
              <ArrowLeft
                size={24}
                color="white"
              />
            </TouchableOpacity>
          )}
          <View style={styles(colors).headerText}>
            <View>
              <Text style={styles(colors).headerTitle}>Transactions</Text>
              <Text style={styles(colors).headerSubtitle}>
                View all your transactions
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles(colors).content}>
        <FlatList
          data={filteredTransactions}
          renderItem={renderMonthSection}
          keyExtractor={(item) => item.monthYear}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles(colors).flatListContent}
          keyboardShouldPersistTaps="handled"
        />
      </View>

      <AddTransactionModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
      />
    </View>
  );
};

export default TransactionsScreen;
