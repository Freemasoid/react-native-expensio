import { GlobalColors } from "@/constants/styles";
import { StyleSheet } from "react-native";

export const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
    },
    headerSubtitle: {
      fontSize: 16,
      color: GlobalColors.gray[200],
    },
    content: {
      paddingHorizontal: 24,
      marginTop: 24,
    },
  });
