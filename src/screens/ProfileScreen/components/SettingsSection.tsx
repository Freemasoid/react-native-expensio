import { GlobalColors } from "@/constants/styles";
import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePreferences } from "@/store/slices/userSlice";
import {
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  LogOut,
  Shield,
  Smartphone,
  Trash2,
  User,
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SettingItemProps {
  icon: React.ComponentType<any>;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  destructive?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
  rightElement,
  showChevron = true,
  destructive = false,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles(colors).settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles(colors).settingLeft}>
        <View
          style={[
            styles(colors).settingIcon,
            {
              backgroundColor: destructive
                ? GlobalColors.red
                : colors.primary[500],
            },
          ]}
        >
          <Icon
            size={18}
            color="white"
          />
        </View>
        <View style={styles(colors).settingText}>
          <Text
            style={[
              styles(colors).settingTitle,
              destructive && { color: GlobalColors.red },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={styles(colors).settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>

      <View style={styles(colors).settingRight}>
        {rightElement}
        {showChevron && !rightElement && (
          <ChevronRight
            size={16}
            color={GlobalColors.gray[500]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export const SettingsSection: React.FC = () => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);

  const handleNotificationToggle = (value: boolean) => {
    dispatch(updatePreferences({ notifications: value }));
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          console.log("Sign out");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Delete account");
          },
        },
      ]
    );
  };

  const settingSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          title: "Personal Information",
          subtitle: "Update your profile details",
          onPress: () => console.log("Edit profile"),
        },
        {
          icon: Bell,
          title: "Notifications",
          subtitle: profile.preferences.notifications ? "Enabled" : "Disabled",
          rightElement: (
            <Switch
              value={profile.preferences.notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{
                false: GlobalColors.gray[300],
                true: colors.primary_accent[500],
              }}
              thumbColor={
                profile.preferences.notifications
                  ? colors.primary[400]
                  : GlobalColors.gray[500]
              }
            />
          ),
          showChevron: false,
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Globe,
          title: "Language",
          subtitle:
            profile.preferences.language === "en"
              ? "English"
              : profile.preferences.language,
          onPress: () => console.log("Change language"),
        },
        {
          icon: Smartphone,
          title: "Currency",
          subtitle: profile.preferences.currency,
          onPress: () => console.log("Change currency"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          title: "Help & Support",
          subtitle: "Get help and contact support",
          onPress: () => console.log("Help & Support"),
        },
        {
          icon: Shield,
          title: "Privacy Policy",
          subtitle: "Read our privacy policy",
          onPress: () => console.log("Privacy Policy"),
        },
      ],
    },
    {
      title: "Account Actions",
      items: [
        {
          icon: LogOut,
          title: "Sign Out",
          onPress: handleSignOut,
          destructive: true,
        },
        {
          icon: Trash2,
          title: "Delete Account",
          subtitle: "Permanently delete your account",
          onPress: handleDeleteAccount,
          destructive: true,
        },
      ],
    },
  ];

  return (
    <View style={styles(colors).container}>
      {settingSections.map((section, sectionIndex) => (
        <View
          key={sectionIndex}
          style={styles(colors).section}
        >
          <Text style={styles(colors).sectionTitle}>{section.title}</Text>
          <View style={styles(colors).sectionContent}>
            {section.items.map((item, itemIndex) => (
              <SettingItem
                key={itemIndex}
                {...item}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary[500],
      marginBottom: 16,
    },
    sectionContent: {
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
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: GlobalColors.gray[200],
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: GlobalColors.gray[900],
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      color: GlobalColors.gray[600],
    },
    settingRight: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
