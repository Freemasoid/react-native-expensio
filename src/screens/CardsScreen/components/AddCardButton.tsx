import { GlobalColors } from "@/constants/styles";
import { useTheme } from "@/hooks/useTheme";
import { Plus } from "lucide-react-native";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AddCardButtonProps {
  onPress: () => void;
}

export const AddCardButton: React.FC<AddCardButtonProps> = ({ onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles(colors).container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles(colors).content}>
        <View style={styles(colors).iconContainer}>
          <Plus
            size={32}
            color={colors.primary[500]}
            strokeWidth={2}
          />
        </View>

        <Text style={styles(colors).title}>Add New Card</Text>
        <Text style={styles(colors).subtitle}>
          Add a credit or debit card to your profile
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.primary[900],
      borderStyle: "dashed",
      backgroundColor: colors.primary[300],
      minHeight: 200,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      marginBottom: 16,
      ...(Platform.OS === "ios" && {
        shadowColor: GlobalColors.gray[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      }),
      elevation: Platform.OS === "android" ? 2 : 0,
    },
    content: {
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: GlobalColors.gray[100],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      ...(Platform.OS === "ios" && {
        shadowColor: GlobalColors.gray[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }),
      elevation: Platform.OS === "android" ? 3 : 0,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: GlobalColors.gray[100],
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: GlobalColors.gray[100],
      textAlign: "center",
      lineHeight: 20,
    },
  });
