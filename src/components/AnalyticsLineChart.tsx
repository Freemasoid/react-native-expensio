import { GlobalColors } from "@/constants/styles";
import type { YearlyCategorySummary } from "@/types/types";
import { useFont } from "@shopify/react-native-skia";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { CartesianChart, Line } from "victory-native";

interface AnalyticsLineChartProps {
  colors: object;
  data: YearlyCategorySummary;
}

const AnalyticsLineChart: React.FC<AnalyticsLineChartProps> = ({
  colors,
  data,
}) => {
  const font = useFont(require("~/assets/fonts/SpaceMono-Regular.ttf"), 13);

  const processMonthlyExpensesData = () => {
    const currentMonth = new Date().getMonth();
    const categorySummaries = data;

    if (!categorySummaries) {
      return [];
    }

    const monthlyExpenses: { [month: string]: number } = {};

    const months = Array.from({ length: currentMonth + 1 }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );

    const allMonthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthNames = allMonthNames.slice(0, currentMonth + 1);

    months.forEach((month) => {
      monthlyExpenses[month] = 0;
    });

    Object.entries(categorySummaries).forEach(
      ([categoryName, categoryData]) => {
        if (categoryName === "income") return;

        Object.entries(categoryData.monthlyBreakdown).forEach(
          ([month, monthData]) => {
            if (months.includes(month)) {
              monthlyExpenses[month] += monthData.amount;
            }
          }
        );
      }
    );

    return months.map((month, index) => ({
      x: monthNames[index],
      y: Math.round(monthlyExpenses[month] * 100) / 100,
    }));
  };

  const chartData = processMonthlyExpensesData();
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });

  return (
    <View style={styles(colors).container}>
      <Text style={styles(colors).title}>Monthly Expenses Trend</Text>
      <Text style={styles(colors).subtitle}>
        January to {currentMonthName} {new Date().getFullYear()}
      </Text>

      <View style={styles(colors).chartContainer}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["y"]}
          domainPadding={{ left: 20, right: 20, top: 20, bottom: 10 }}
          axisOptions={{
            font,
            tickCount: { x: Math.min(chartData.length, 6), y: 5 },
            labelColor: GlobalColors.gray[800],
            lineColor: GlobalColors.gray[300],
          }}
        >
          {({ points }) => (
            <Line
              points={points.y}
              color={GlobalColors.red}
              strokeWidth={3}
              curveType="natural"
              connectMissingData={true}
            />
          )}
        </CartesianChart>
      </View>

      <View style={styles(colors).summary}>
        <Text style={styles(colors).summaryText}>
          Peak spending:{" "}
          {Math.max(...chartData.map((d) => d.y)).toLocaleString()} € in{" "}
          {
            chartData.find(
              (d) => d.y === Math.max(...chartData.map((d) => d.y))
            )?.x
          }
        </Text>
      </View>
    </View>
  );
};

export default AnalyticsLineChart;

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: GlobalColors.gray[100],
      borderRadius: 24,
      padding: 20,
      marginBottom: 14,
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
      height: 200,
      width: "100%",
      backgroundColor: GlobalColors.gray[100],
      borderRadius: 8,
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
  });
