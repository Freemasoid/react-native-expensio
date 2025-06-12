import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SettingsSection,
  StatsCard,
  ThemeSwitcher,
  UserCard,
} from "./components";
import { styles } from "./styles";

const ProfileScreen = () => {
  const { colors } = useTheme();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const insets = useSafeAreaInsets();

  const handleEditAvatar = () => {
    console.log("Edit avatar");
  };

  const handleEditProfile = () => {
    console.log("Edit profile");
  };

  return (
    <ScrollView
      style={styles(colors).container}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={
          currentTheme === "primaryYellow"
            ? [colors.primary[300], colors.primary_accent[300]]
            : [colors.primary[500], colors.primary_accent[500]]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles(colors).header, { paddingTop: insets.top }]}
      >
        <View style={styles(colors).headerContent}>
          <View style={styles(colors).headerText}>
            <Text style={styles(colors).headerTitle}>Profile</Text>
            <Text style={styles(colors).headerSubtitle}>
              Manage your profile and preferences
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles(colors).content}>
        {/* User Profile Card */}
        <UserCard
          onEditAvatar={handleEditAvatar}
          onEditProfile={handleEditProfile}
        />

        {/* Financial Statistics */}
        <StatsCard />

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Settings Sections */}
        <SettingsSection />

        {/* Bottom spacing for safe area */}
        <View style={{ height: insets.bottom + 20 }} />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
