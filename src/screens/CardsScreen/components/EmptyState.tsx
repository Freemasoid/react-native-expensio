import { GlobalColors } from "@/constants/styles";
import { useTheme } from "@/hooks/useTheme";
import { CreditCard, Plus } from "lucide-react-native";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface EmptyStateProps {
  onAddCard: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddCard }) => {
  const { colors } = useTheme();

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).iconContainer}>
        <CreditCard
          size={64}
          color={GlobalColors.gray[400]}
          strokeWidth={1.5}
        />
      </View>

      <Text style={styles(colors).title}>No Cards Added</Text>
      <Text style={styles(colors).subtitle}>
        Add your first card to start managing your payments and expenses more
        efficiently.
      </Text>

      <TouchableOpacity
        style={styles(colors).addButton}
        onPress={onAddCard}
        activeOpacity={0.8}
      >
        <Plus
          size={20}
          color="white"
          strokeWidth={2}
        />
        <Text style={styles(colors).addButtonText}>Add Your First Card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
      paddingVertical: 64,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: GlobalColors.gray[100],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: GlobalColors.gray[900],
      marginBottom: 12,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: GlobalColors.gray[600],
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 32,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary[500],
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
      ...(Platform.OS === "ios" && {
        shadowColor: GlobalColors.gray[900],
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      }),
      elevation: Platform.OS === "android" ? 4 : 0,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
  });
