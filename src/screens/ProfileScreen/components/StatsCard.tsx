import { GlobalColors } from "@/constants/styles";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import { BarChart3, DollarSign, Target, TrendingUp } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export const StatsCard: React.FC = () => {
  const { colors } = useTheme();
  const { stats, profile } = useAppSelector((state) => state.user);

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ${profile.preferences.currency}`;
  };

  const getBudgetProgress = () => {
    return Math.min((stats.totalExpenses / stats.monthlyBudget) * 100, 100);
  };

  const getSavingsProgress = () => {
    return Math.min((stats.currentSavings / stats.savingsGoal) * 100, 100);
  };

  const statsData = [
    {
      icon: DollarSign,
      title: "Total Expenses",
      value: formatCurrency(stats.totalExpenses),
      subtitle: `${getBudgetProgress().toFixed(0)}% of budget`,
      color: colors.primary[500],
      progress: getBudgetProgress(),
    },
    {
      icon: Target,
      title: "Savings Goal",
      value: formatCurrency(stats.currentSavings),
      subtitle: `${getSavingsProgress().toFixed(0)}% of ${formatCurrency(
        stats.savingsGoal
      )}`,
      color: colors.primary_accent[500],
      progress: getSavingsProgress(),
    },
    {
      icon: TrendingUp,
      title: "Expense Streak",
      value: `${stats.expenseStreak} days`,
      subtitle: "Keep tracking!",
      color: GlobalColors.green,
      progress: null,
    },
    {
      icon: BarChart3,
      title: "Monthly Budget",
      value: formatCurrency(stats.monthlyBudget),
      subtitle: `${formatCurrency(
        stats.monthlyBudget - stats.totalExpenses
      )} remaining`,
      color: colors.secondary[500],
      progress: null,
    },
  ];

  return (
    <View style={styles(colors).container}>
      <Text style={styles(colors).sectionTitle}>Financial Overview</Text>

      <View style={styles(colors).statsGrid}>
        {statsData.map((stat, index) => (
          <View
            key={index}
            style={styles(colors).statCard}
          >
            <View style={styles(colors).statHeader}>
              <View
                style={[
                  styles(colors).iconContainer,
                  { backgroundColor: stat.color },
                ]}
              >
                <stat.icon
                  size={20}
                  color="white"
                />
              </View>
              <Text style={styles(colors).statTitle}>{stat.title}</Text>
            </View>

            <Text style={styles(colors).statValue}>{stat.value}</Text>
            <Text style={styles(colors).statSubtitle}>{stat.subtitle}</Text>

            {stat.progress !== null && (
              <View style={styles(colors).progressContainer}>
                <View style={styles(colors).progressBar}>
                  <View
                    style={[
                      styles(colors).progressFill,
                      {
                        width: `${stat.progress}%`,
                        backgroundColor: stat.color,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary[500],
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    statCard: {
      flex: 1,
      minWidth: "47%",
      backgroundColor: GlobalColors.gray[100],
      borderRadius: 16,
      padding: 16,
      ...(Platform.OS === "ios" && {
        shadowColor: GlobalColors.gray[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }),
      elevation: Platform.OS === "android" ? 2 : 0,
    },
    statHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    statTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: GlobalColors.gray[700],
      flex: 1,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: GlobalColors.gray[900],
      marginBottom: 4,
    },
    statSubtitle: {
      fontSize: 12,
      color: GlobalColors.gray[600],
      marginBottom: 8,
    },
    progressContainer: {
      marginTop: 8,
    },
    progressBar: {
      height: 4,
      backgroundColor: GlobalColors.gray[200],
      borderRadius: 2,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 2,
    },
  });
