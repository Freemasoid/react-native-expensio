import { GlobalColors } from "@/constants/styles";
import { Platform, StyleSheet } from "react-native";

export const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingVertical: 48,
      paddingHorizontal: 32,
    },
    headerContent: {
      gap: 24,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    greeting: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
    },
    subtitle: {
      fontSize: 16,
      color: GlobalColors.gray[200],
    },
    avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: GlobalColors.gray[700],
      justifyContent: "center",
      alignItems: "center",
    },
    balanceCard: {
      borderRadius: 24,
      padding: 24,
      overflow: "hidden",
    },
    balanceLabel: {
      fontSize: 18,
      color: GlobalColors.gray[200],
      marginBottom: 8,
    },
    balanceAmount: {
      fontSize: 32,
      fontWeight: "bold",
      color: "white",
      marginBottom: 16,
    },
    balanceDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    balanceDetailLabel: {
      fontSize: 16,
      color: GlobalColors.gray[200],
    },
    incomeAmount: {
      fontSize: 18,
      fontWeight: "600",
      color: "white",
    },
    expenseAmount: {
      fontSize: 18,
      fontWeight: "600",
      color: "white",
    },
    content: {
      paddingHorizontal: 24,
      marginTop: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.primary[400],
      marginBottom: 16,
    },
    transactionsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    seeAllButton: {
      color: colors.primary[400],
      fontSize: 14,
      fontWeight: "500",
    },
    transactionsList: {
      backgroundColor: GlobalColors.gray[100],
      borderRadius: 24,
      marginBottom: 14,
      borderColor: "black",
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
  });
