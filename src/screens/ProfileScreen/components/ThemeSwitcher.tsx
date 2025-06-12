import { GlobalColors } from "@/constants/styles";
import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, ThemeName } from "@/store/slices/themeSlice";
import { Palette } from "lucide-react-native";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const ThemeSwitcher: React.FC = () => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  const themes: { name: ThemeName; label: string; colors: any }[] = [
    {
      name: "primaryGreen",
      label: "Forest Green",
      colors: GlobalColors.primaryGreen,
    },
    {
      name: "primaryBlue",
      label: "Ocean Blue",
      colors: GlobalColors.primaryBlue,
    },
    {
      name: "primaryRed",
      label: "Sunset Red",
      colors: GlobalColors.primaryRed,
    },
    {
      name: "primaryYellow",
      label: "Golden Yellow",
      colors: GlobalColors.primaryYellow,
    },
  ];

  const handleThemeChange = (themeName: ThemeName) => {
    dispatch(setTheme(themeName));
  };

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).header}>
        <Palette
          size={20}
          color={colors.primary[500]}
        />
        <Text style={styles(colors).sectionTitle}>Choose Theme</Text>
      </View>

      <View style={styles(colors).themesGrid}>
        {themes.map((theme) => (
          <TouchableOpacity
            key={theme.name}
            style={[
              styles(colors).themeCard,
              currentTheme === theme.name && styles(colors).selectedThemeCard,
            ]}
            onPress={() => handleThemeChange(theme.name)}
            activeOpacity={0.7}
          >
            <View style={styles(colors).themePreview}>
              <View
                style={[
                  styles(colors).colorPreview,
                  { backgroundColor: theme.colors.primary[500] },
                ]}
              />
              <View
                style={[
                  styles(colors).colorPreview,
                  { backgroundColor: theme.colors.primary_accent[500] },
                ]}
              />
              <View
                style={[
                  styles(colors).colorPreview,
                  { backgroundColor: theme.colors.secondary[500] },
                ]}
              />
            </View>

            <Text
              style={[
                styles(colors).themeLabel,
                currentTheme === theme.name &&
                  styles(colors).selectedThemeLabel,
              ]}
            >
              {theme.label}
            </Text>

            {currentTheme === theme.name && (
              <View style={styles(colors).selectedIndicator}>
                <View
                  style={[
                    styles(colors).selectedDot,
                    { backgroundColor: theme.colors.primary[500] },
                  ]}
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary[500],
    },
    themesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    themeCard: {
      flex: 1,
      minWidth: "47%",
      backgroundColor: GlobalColors.gray[100],
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
      borderWidth: 2,
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
    selectedThemeCard: {
      borderColor: colors.primary[500],
      backgroundColor: colors.primary[100],
    },
    themePreview: {
      flexDirection: "row",
      marginBottom: 12,
      gap: 4,
    },
    colorPreview: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    themeLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: GlobalColors.gray[700],
      textAlign: "center",
    },
    selectedThemeLabel: {
      color: colors.primary[600],
    },
    selectedIndicator: {
      position: "absolute",
      top: 8,
      right: 8,
    },
    selectedDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });
