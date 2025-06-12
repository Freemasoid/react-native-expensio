import { GlobalColors } from "@/constants/styles";
import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch } from "@/store/hooks";
import type { Card } from "@/store/slices/cardsSlice";
import { removeCard, setDefaultCard } from "@/store/slices/cardsSlice";
import { Eye, MoreVertical, Star } from "lucide-react-native";
import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

interface CardItemProps {
  card: Card;
  onEdit?: (card: Card) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onEdit }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const formatCardNumber = (lastFour: string) => {
    return `•••• •••• •••• ${lastFour}`;
  };

  const formatExpiry = (month: string, year: string) => {
    return `${month}/${year}`;
  };

  const handleSetDefault = () => {
    if (!card.isDefault) {
      dispatch(setDefaultCard(card.id));
    }
  };

  const handleRemoveCard = () => {
    Alert.alert(
      "Remove Card",
      `Are you sure you want to remove this ${card.cardType} card?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            dispatch(removeCard(card.id));
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    onEdit?.(card);
  };

  return (
    <View style={styles(colors).container}>
      <View style={[styles(colors).card, { backgroundColor: card.color }]}>
        {/* Card Header */}
        <View style={styles(colors).cardHeader}>
          <View style={styles(colors).bankInfo}>
            <Text style={styles(colors).bankName}>{card.bankName}</Text>
            <Text style={styles(colors).cardType}>
              {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)}{" "}
              Card
            </Text>
          </View>

          <View style={styles(colors).cardActions}>
            {card.isDefault && (
              <View style={styles(colors).defaultBadge}>
                <Star
                  size={12}
                  color={colors.primary[500]}
                  fill={colors.primary[500]}
                />
              </View>
            )}

            <Menu>
              <MenuTrigger>
                <View style={styles(colors).actionButton}>
                  <MoreVertical
                    size={20}
                    color="white"
                  />
                </View>
              </MenuTrigger>

              <MenuOptions customStyles={menuOptionsStyles}>
                {!card.isDefault && (
                  <MenuOption onSelect={handleSetDefault}>
                    <View style={styles(colors).menuItem}>
                      <Star
                        size={16}
                        color={colors.primary[500]}
                      />
                      <Text style={styles(colors).menuItemText}>
                        Set as Default
                      </Text>
                    </View>
                  </MenuOption>
                )}

                <MenuOption onSelect={handleEdit}>
                  <View style={styles(colors).menuItem}>
                    <Text style={styles(colors).menuItemText}>Edit Card</Text>
                  </View>
                </MenuOption>

                <MenuOption onSelect={handleRemoveCard}>
                  <View
                    style={[
                      styles(colors).menuItem,
                      styles(colors).destructiveMenuItem,
                    ]}
                  >
                    <Text
                      style={[
                        styles(colors).menuItemText,
                        styles(colors).destructiveText,
                      ]}
                    >
                      Remove Card
                    </Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>

        {/* Card Number */}
        <View style={styles(colors).cardNumber}>
          <Text style={styles(colors).cardNumberText}>
            {formatCardNumber(card.lastFourDigits)}
          </Text>
        </View>

        {/* Card Footer */}
        <View style={styles(colors).cardFooter}>
          <View>
            <Text style={styles(colors).cardLabel}>Cardholder</Text>
            <Text style={styles(colors).cardValue}>{card.cardholderName}</Text>
          </View>

          <View>
            <Text style={styles(colors).cardLabel}>Expiry</Text>
            <Text style={styles(colors).cardValue}>
              {formatExpiry(card.expiryMonth, card.expiryYear)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles(colors).eyeButton}
            activeOpacity={0.7}
          >
            <Eye
              size={18}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const menuOptionsStyles = {
  optionsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 160,
    ...Platform.select({
      ios: {
        shadowColor: GlobalColors.gray[900],
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  optionWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    card: {
      borderRadius: 16,
      padding: 20,
      minHeight: 200,
      justifyContent: "space-between",
      ...(Platform.OS === "ios" && {
        shadowColor: GlobalColors.gray[900],
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      }),
      elevation: Platform.OS === "android" ? 6 : 0,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    bankInfo: {
      flex: 1,
    },
    bankName: {
      fontSize: 20,
      fontWeight: "bold",
      color: "white",
      marginBottom: 4,
    },
    cardType: {
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.8)",
      textTransform: "capitalize",
    },
    cardActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    defaultBadge: {
      backgroundColor: "white",
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
    },
    cardNumber: {
      marginVertical: 20,
    },
    cardNumberText: {
      fontSize: 18,
      fontWeight: "600",
      color: "white",
      letterSpacing: 2,
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    cardLabel: {
      fontSize: 12,
      color: "rgba(255, 255, 255, 0.7)",
      marginBottom: 4,
    },
    cardValue: {
      fontSize: 14,
      fontWeight: "600",
      color: "white",
    },
    eyeButton: {
      padding: 8,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: "500",
      color: GlobalColors.gray[900],
    },
    destructiveMenuItem: {
      borderTopWidth: 1,
      borderTopColor: GlobalColors.gray[200],
    },
    destructiveText: {
      color: GlobalColors.red,
    },
  });
