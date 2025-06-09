import { GlobalColors } from "@/constants/styles";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { CategoryIcon } from "./ui";
import type { IconName } from "./ui/CategoryIcon/icon-map";

interface CategoryCardProps {
  name: IconName;
  totalSpend: number;
  monthlySpend: number;
  colors: object;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  totalSpend,
  monthlySpend,
  colors,
}) => {
  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).stats}>
        <View style={styles(colors).statsTop}>
          <View style={styles(colors).iconContainer}>
            <CategoryIcon
              name={name}
              size={26}
              color="white"
            />
          </View>

          <View>
            <Text style={styles(colors).categoryTitle}>{name}</Text>
            <Text style={styles(colors).categorySpend}>
              {monthlySpend.toFixed(2)} €
            </Text>
          </View>
        </View>

        <View style={styles(colors).progressBar}>
          <View
            style={[
              styles(colors).progress,
              {
                width: `${Math.min((monthlySpend / totalSpend) * 100, 100)}%`,
              },
            ]}
          ></View>
        </View>
      </View>
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
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
    stats: {
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "center",
      marginVertical: 8,
      marginHorizontal: 16,
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
    statsTop: {
      flex: 1,
      flexDirection: "row",
    },
    categoryTitle: {
      textTransform: "capitalize",
      fontWeight: 600,
      fontSize: 16,
    },
    categorySpend: {
      fontWeight: 500,
      fontSize: 15,
    },
    progressBar: {
      width: "100%",
      backgroundColor: GlobalColors.gray[200],
      borderRadius: 9999,
      height: 8,
      marginTop: 8,
    },
    progress: {
      height: 8,
      borderRadius: 9999,
      backgroundColor: colors.primary[600],
    },
  });
