import { GlobalColors } from "@/constants/styles";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction } from "@/types/types";
import { useFont } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Bar, CartesianChart } from "victory-native";

interface ColorsProp {
  primary: {
    [key: number]: string;
  };
  [key: string]: any;
}

interface SpendingChartProps {
  colors: ColorsProp;
}

const SpendingChart: React.FC<SpendingChartProps> = ({ colors }) => {
  const font = useFont(require("~/assets/fonts/SpaceMono-Regular.ttf"), 13);
  const { getCombinedMonthTransactions } = useTransactions();

  const chartData = useMemo(() => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last7Days.push(date);
    }

    return last7Days.map((date) => {
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const dayKey = date.toISOString().split("T")[0];

      const monthTransactions = getCombinedMonthTransactions(year, month);

      const dayExpenses = monthTransactions
        .filter((transaction: Transaction) => {
          const transactionDate = new Date(transaction.date)
            .toISOString()
            .split("T")[0];
          return transactionDate === dayKey && transaction.type === "expense";
        })
        .reduce((total, transaction) => total + transaction.amount, 0);

      return {
        day: date.toLocaleDateString("en-GB", {
          day: "2-digit",
        }),
        amount: dayExpenses,
      };
    });
  }, [getCombinedMonthTransactions]);

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).chartContainer}>
        <CartesianChart
          data={chartData}
          xKey="day"
          yKeys={["amount"]}
          padding={{ left: 0, right: 0, top: 15, bottom: 30 }}
          domainPadding={{ left: 25, right: 25, top: 20, bottom: 10 }}
          xAxis={{
            font,
            labelColor: GlobalColors.gray[800],
            labelOffset: 8,
            axisSide: "bottom",
            labelPosition: "outset",
            lineWidth: 0,
            tickCount: chartData.length,
          }}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.amount}
              chartBounds={chartBounds}
              color={colors.primary[600]}
              roundedCorners={{ topLeft: 8, topRight: 8 }}
              innerPadding={0.3}
              labels={{ font: font, position: "top" }}
            />
          )}
        </CartesianChart>
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
    chartContainer: {
      height: 200,
      width: "100%",
      backgroundColor: GlobalColors.gray[100],
    },
  });

export default SpendingChart;
