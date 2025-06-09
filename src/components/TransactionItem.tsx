import { GlobalColors } from "@/constants/styles";
import type { Transaction } from "@/types/types";
import { StyleSheet, Text, View } from "react-native";
import { CategoryIcon } from "./ui";
import type { IconName } from "./ui/CategoryIcon/icon-map";

interface TransactionItemProps {
  data: Transaction;
  colors: object;
  isLast: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  data,
  colors,
  isLast,
}) => {
  const date = new Date(data.date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

  const time = new Date(data.date).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      style={[styles(colors).container, !isLast && styles(colors).borderBottom]}
    >
      <View style={styles(colors).content}>
        <View style={styles(colors).leftSection}>
          <View style={styles(colors).iconContainer}>
            <CategoryIcon
              name={data.category as IconName}
              size={26}
              color="white"
            />
          </View>
          <View style={styles(colors).textContainer}>
            <Text style={styles(colors).title}>{data.title}</Text>
            <Text style={styles(colors).subtitle}>{data.category}</Text>
            <Text style={styles(colors).subtitle}>
              {date} · {time}
            </Text>
          </View>
        </View>
        <View style={styles(colors).rightSection}>
          <Text
            style={[
              styles(colors).amount,
              {
                color:
                  data.type === "income"
                    ? GlobalColors.green
                    : GlobalColors.red,
              },
            ]}
          >
            {data.type === "income" ? "+" : "-"}
            {Math.abs(data.amount).toFixed(2)} €
          </Text>
        </View>
      </View>
    </View>
  );
};

export const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: GlobalColors.gray[200],
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    rightSection: {
      alignItems: "flex-end",
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 9999,
      borderWidth: 3,
      borderColor: colors.primary_accent[500],
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
      backgroundColor: colors.primary[500],
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: GlobalColors.gray[900],
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      textTransform: "capitalize",
      color: GlobalColors.gray[800],
    },
    amount: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default TransactionItem;
