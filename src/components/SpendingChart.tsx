import { GlobalColors } from "@/constants/styles";
import { useFont } from "@shopify/react-native-skia";
import React from "react";
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

  const data = [
    { day: "Mon", amount: 45 },
    { day: "Tue", amount: 32 },
    { day: "Wed", amount: 78 },
    { day: "Thu", amount: 56 },
    { day: "Fri", amount: 89 },
    { day: "Sat", amount: 123 },
    { day: "Sun", amount: 67 },
  ];

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).chartContainer}>
        <CartesianChart
          data={data}
          xKey="day"
          yKeys={["amount"]}
          padding={{ left: 15, right: 15, top: 15, bottom: 30 }}
          domainPadding={{ left: 20, right: 20, top: 20, bottom: 10 }}
          xAxis={{
            font,
            labelColor: GlobalColors.gray[800],
            labelOffset: 8,
            axisSide: "bottom",
            labelPosition: "outset",
            lineWidth: 0,
          }}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.amount}
              chartBounds={chartBounds}
              color={colors.primary[600]}
              roundedCorners={{ topLeft: 8, topRight: 8 }}
              innerPadding={0.3}
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
      ...(Platform.OS === "ios" && {
        shadowColor: GlobalColors.gray[900],
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      }),
      elevation: Platform.OS === "android" ? 3 : 0,
    },
    chartContainer: {
      height: 200,
      width: "100%",
      backgroundColor: GlobalColors.gray[100],
    },
  });

export default SpendingChart;
