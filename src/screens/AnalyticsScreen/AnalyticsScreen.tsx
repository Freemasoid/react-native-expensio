import { AnalyticsLineChart, AnalyticsPieChart } from "@/components";
import { transactionData } from "@/constants/mock-data";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import { getUserExpenses } from "@/utils/api";
import { USER_ID } from "@env";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

const AnalyticsScreen = () => {
  const { colors } = useTheme();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState<any>(null);

  useEffect(() => {
    async function getTransactions() {
      try {
        const response = await getUserExpenses(USER_ID);
        setTransactions(response);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch transactions";

        console.error(errorMessage);
      }
    }

    getTransactions();
  }, []);

  // Use real API data if available, otherwise fall back to mock data
  const analyticsData = transactions?.data || transactionData;

  return (
    <ScrollView
      style={styles(colors).container}
      showsVerticalScrollIndicator={false}
    >
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
          <View style={styles(colors).headerText}>
            <Text style={styles(colors).headerTitle}>Analytics</Text>
            <Text style={styles(colors).headerSubtitle}>
              Track your spending patterns
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles(colors).content}>
        <AnalyticsLineChart
          data={analyticsData}
          colors={colors}
        />
      </View>

      <View style={styles(colors).content}>
        <AnalyticsPieChart
          data={analyticsData}
          colors={colors}
        />
      </View>
    </ScrollView>
  );
};
export default AnalyticsScreen;
