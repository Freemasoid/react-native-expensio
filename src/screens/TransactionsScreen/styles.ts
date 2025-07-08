import { GlobalColors } from "@/constants/styles";
import { Platform, StyleSheet } from "react-native";

export const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: GlobalColors.gray[100],
    },
    header: {
      paddingVertical: 40,
      paddingHorizontal: 32,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: 4,
      textAlign: "right",
    },
    headerSubtitle: {
      fontSize: 16,
      color: GlobalColors.gray[200],
      textAlign: "right",
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      marginTop: 24,
    },
    flatListContent: {
      paddingBottom: 20,
    },

    // Search and Filter
    searchAndFilter: {
      marginBottom: 24,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: GlobalColors.gray[100],
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
      gap: 12,
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
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: GlobalColors.gray[900],
    },
    filterContainer: {
      flexDirection: "row",
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: GlobalColors.gray[100],
      borderWidth: 1,
      borderColor: GlobalColors.gray[200],
    },
    activeFilterButton: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: GlobalColors.gray[700],
    },
    activeFilterButtonText: {
      color: "white",
    },

    // Month Section
    monthSection: {
      marginBottom: 24,
    },
    monthHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    monthInfo: {
      flex: 1,
    },
    monthTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.primary[500],
      marginBottom: 4,
    },
    monthStats: {
      fontSize: 14,
      color: GlobalColors.gray[600],
    },
    monthSummary: {
      alignItems: "flex-end",
    },
    monthIncome: {
      fontSize: 16,
      fontWeight: "600",
      color: GlobalColors.green,
      marginBottom: 2,
    },
    monthExpenses: {
      fontSize: 16,
      fontWeight: "600",
      color: GlobalColors.red,
    },
    transactionsList: {
      backgroundColor: GlobalColors.gray[100],
      borderRadius: 16,
      overflow: "hidden",
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

    // Loading and Error States
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    loadingText: {
      fontSize: 16,
      color: colors.primary[500],
      marginTop: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    errorTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.primary[500],
      marginBottom: 8,
      textAlign: "center",
    },
    errorText: {
      fontSize: 16,
      color: GlobalColors.gray[600],
      textAlign: "center",
      lineHeight: 22,
    },

    // Empty State
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 48,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.primary[500],
      marginTop: 16,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyStateSubtitle: {
      fontSize: 16,
      color: GlobalColors.gray[600],
      textAlign: "center",
      lineHeight: 22,
    },
  });
