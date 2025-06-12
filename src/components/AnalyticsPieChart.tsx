import { GlobalColors } from "@/constants/styles";
import type { TransactionData } from "@/types/types";
import { useFont } from "@shopify/react-native-skia";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Pie, PolarChart } from "victory-native";

interface AnalyticsPieChartProps {
  colors: object;
  data: TransactionData;
}

const AnalyticsPieChart: React.FC<AnalyticsPieChartProps> = ({
  colors,
  data,
}) => {
  const font = useFont(require("~/assets/fonts/SpaceMono-Regular.ttf"), 13);

  const processCategoryExpenseData = () => {
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = new Date().getMonth();
    const categorySummaries = data.categorySummaries[currentYear];

    if (!categorySummaries) {
      return [];
    }

    const categoryExpenses: { [category: string]: number } = {};

    const months = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = currentMonth - (5 - i);
      const adjustedMonth = monthIndex < 0 ? monthIndex + 12 : monthIndex;
      return String(adjustedMonth + 1).padStart(2, "0");
    });

    Object.keys(categorySummaries).forEach((categoryName) => {
      if (categoryName !== "income") {
        categoryExpenses[categoryName] = 0;
      }
    });

    Object.entries(categorySummaries).forEach(
      ([categoryName, categoryData]) => {
        if (categoryName === "income") return;

        Object.entries(categoryData.monthlyBreakdown).forEach(
          ([month, monthData]) => {
            if (months.includes(month)) {
              categoryExpenses[categoryName] += monthData.monthlySpend;
            }
          }
        );
      }
    );

    const pieColors = [
      GlobalColors.red,
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
    ];

    return Object.entries(categoryExpenses)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount], index) => ({
        label: category.charAt(0).toUpperCase() + category.slice(1),
        value: Math.round(amount * 100) / 100,
        color: pieColors[index % pieColors.length],
      }))
      .sort((a, b) => b.value - a.value); // Sort by highest expense first
  };

  const chartData = processCategoryExpenseData();
  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles(colors).container}>
      <Text style={styles(colors).title}>Category Breakdown</Text>
      <Text style={styles(colors).subtitle}>
        Last 6 months expenses by category
      </Text>

      <View style={styles(colors).chartContainer}>
        <PolarChart
          data={chartData}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius={40} />
        </PolarChart>
      </View>

      <View style={styles(colors).legendContainer}>
        {chartData.slice(0, 5).map((item, index) => (
          <View
            key={item.label}
            style={styles(colors).legendItem}
          >
            <View
              style={[
                styles(colors).legendColor,
                { backgroundColor: item.color },
              ]}
            />
            <Text style={styles(colors).legendText}>
              {item.label}: {item.value.toLocaleString()} € (
              {((item.value / totalExpenses) * 100).toFixed(1)}%)
            </Text>
          </View>
        ))}
        {chartData.length > 5 && (
          <Text style={styles(colors).moreText}>
            +{chartData.length - 5} more categories
          </Text>
        )}
      </View>

      <View style={styles(colors).summary}>
        <Text style={styles(colors).summaryText}>
          {chartData.length > 0 ? "Total expenses" : "Test data"}:{" "}
          {totalExpenses.toLocaleString()} € across {chartData.length}{" "}
          categories
        </Text>
      </View>
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: GlobalColors.gray[100],
      borderRadius: 24,
      padding: 20,
      marginBottom: 24,
      borderColor: "transparent",
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
    title: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: "#666",
      marginBottom: 16,
    },
    chartContainer: {
      height: 250,
      width: "100%",
      backgroundColor: "transparent",
      borderRadius: 8,
      marginBottom: 16,
    },
    legendContainer: {
      marginTop: 12,
      paddingHorizontal: 8,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    legendColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    legendText: {
      fontSize: 12,
      color: "#333",
      flex: 1,
    },
    moreText: {
      fontSize: 12,
      color: "#666",
      fontStyle: "italic",
      textAlign: "center",
      marginTop: 4,
    },
    summary: {
      marginTop: 12,
      padding: 12,
      backgroundColor: GlobalColors.gray[200],
      borderRadius: 12,
    },
    summaryText: {
      fontSize: 14,
      textAlign: "center",
      color: "#333",
      fontWeight: "600",
    },
    noDataContainer: {
      height: 200,
      justifyContent: "center",
      alignItems: "center",
    },
    noDataText: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
    },
  });

export default AnalyticsPieChart;
