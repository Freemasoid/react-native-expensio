import { StyleSheet } from "react-native";

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
      color: "rgba(255, 255, 255, 0.8)",
    },
    avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
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
      color: "rgba(255, 255, 255, 0.8)",
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
      color: "rgba(255, 255, 255, 0.8)",
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
      color: colors.primary[600],
      fontSize: 14,
      fontWeight: "500",
    },
  });
