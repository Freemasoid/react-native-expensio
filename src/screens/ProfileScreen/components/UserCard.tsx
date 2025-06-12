import { GlobalColors } from "@/constants/styles";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import { Camera, Crown, User } from "lucide-react-native";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UserCardProps {
  onEditAvatar?: () => void;
  onEditProfile?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  onEditAvatar,
  onEditProfile,
}) => {
  const { colors } = useTheme();
  const { profile } = useAppSelector((state) => state.user);

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <View style={styles(colors).container}>
      {/* Avatar Section */}
      <View style={styles(colors).avatarSection}>
        <View style={styles(colors).avatarContainer}>
          {profile.avatar ? (
            <View style={styles(colors).avatar}>
              {/* TODO: Add Image component when avatar URL is available */}
              <User
                size={32}
                color="white"
              />
            </View>
          ) : (
            <View style={styles(colors).avatar}>
              <User
                size={32}
                color="white"
              />
            </View>
          )}

          <TouchableOpacity
            style={styles(colors).cameraButton}
            onPress={onEditAvatar}
            activeOpacity={0.7}
          >
            <Camera
              size={16}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Membership Badge */}
        {profile.membershipLevel === "premium" && (
          <View style={styles(colors).premiumBadge}>
            <Crown
              size={14}
              color={colors.primary[500]}
            />
            <Text style={styles(colors).premiumText}>Premium</Text>
          </View>
        )}
      </View>

      {/* User Info */}
      <View style={styles(colors).userInfo}>
        <Text style={styles(colors).userName}>{profile.name}</Text>
        <Text style={styles(colors).userEmail}>{profile.email}</Text>

        <Text style={styles(colors).joinDate}>
          Member since {formatJoinDate(profile.joinedDate)}
        </Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        style={styles(colors).editButton}
        onPress={onEditProfile}
        activeOpacity={0.7}
      >
        <Text style={styles(colors).editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: GlobalColors.gray[100],
      borderRadius: 24,
      padding: 20,
      marginBottom: 20,
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
    avatarSection: {
      alignItems: "center",
      marginBottom: 16,
    },
    avatarContainer: {
      position: "relative",
      marginBottom: 8,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary[500],
      borderWidth: 3,
      borderColor: colors.primary_accent[300],
      justifyContent: "center",
      alignItems: "center",
    },
    cameraButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary[600],
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "white",
    },
    premiumBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary_accent[100],
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    premiumText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.primary[500],
    },
    userInfo: {
      alignItems: "center",
      marginBottom: 20,
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
      color: GlobalColors.gray[900],
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: GlobalColors.gray[700],
      marginBottom: 8,
    },
    userBio: {
      fontSize: 16,
      color: GlobalColors.gray[600],
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 8,
    },
    joinDate: {
      fontSize: 14,
      color: GlobalColors.gray[600],
    },
    editButton: {
      backgroundColor: colors.primary[500],
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 20,
      minWidth: 120,
    },
    editButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
  });
