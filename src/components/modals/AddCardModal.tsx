import { GlobalColors } from "@/constants/styles";
import { useCards } from "@/hooks/useCards";
import { useTheme } from "@/hooks/useTheme";
import { Card, NewCard } from "@/types/types";
import {
  Captions,
  CreditCard,
  FileText,
  Palette,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ColorPicker from "../ColorPicker";

interface AddCardModalProps {
  isVisible: boolean;
  onClose: () => void;
  card?: Card;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isVisible,
  onClose,
  card,
}) => {
  const { colors } = useTheme();

  const [formData, setFormData] = useState<NewCard>({
    bankName: "",
    cardType: "debit",
    lastFourDigits: "",
    cardholderName: "",
    color: "",
    isDefault: false,
  });

  const updateField = (field: keyof NewCard, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const {
    addCardOptimistically,
    updateCardOptimistically,
    deleteCardOptimistically,
  } = useCards();

  const [errors, setErrors] = useState<{
    bankName?: string;
    lastFourDigits?: string;
    cardholderName?: string;
  }>({});

  const isEditing = !!card;

  useEffect(() => {
    if (card) {
      setFormData({
        bankName: card.bankName,
        cardType: card.cardType,
        lastFourDigits: card.lastFourDigits,
        cardholderName: card.cardholderName,
        color: card.color,
        isDefault: card.isDefault || false,
      });
    }
  }, [card]);

  const resetForm = () => {
    setFormData({
      bankName: "",
      cardType: "debit",
      lastFourDigits: "",
      cardholderName: "",
      color: "",
      isDefault: false,
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    const newErrors: {
      bankName?: string;
      lastFourDigits?: string;
      cardholderName?: string;
    } = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Please enter bank name";
    }

    if (!formData.lastFourDigits || formData.lastFourDigits.length !== 4) {
      newErrors.lastFourDigits = "Please enter 4 digits";
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Please enter cardholder name";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isEditing && card) {
        await updateCardOptimistically({
          ...formData,
          _id: card._id,
        });
      } else {
        await addCardOptimistically(formData);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to save card:", error);
    }
  };

  const handleDelete = async () => {
    console.log("handleDelete called - START");

    if (!card) {
      console.log("No card found, returning early");
      return;
    }

    console.log("handleDelete called with card:", card);

    try {
      if (!card._id) {
        Alert.alert("Error", "Invalid card ID. Cannot delete card.");
        return;
      }

      await deleteCardOptimistically(card._id);

      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to delete card:", error);
      Alert.alert("Error", "Failed to delete card. Please try again.");
    }
  };

  const formatCardDigits = (text: string) => {
    return text.replace(/[^0-9]/g, "");
  };

  const handleLastFourDigitsChange = (text: string) => {
    const formatted = formatCardDigits(text);
    updateField("lastFourDigits", formatted);
    if (errors.lastFourDigits) {
      setErrors((prev) => ({ ...prev, lastFourDigits: undefined }));
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles(colors).container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={[styles(colors).header]}>
          <View style={styles(colors).headerContent}>
            <View style={styles(colors).headerLeft}>
              <View style={styles(colors).iconContainer}>
                <CreditCard
                  size={20}
                  color="white"
                />
              </View>
              <Text style={styles(colors).headerTitle}>
                {isEditing ? "Update Card" : "Add Card"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles(colors).closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X
                size={20}
                color={GlobalColors.gray[600]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles(colors).content}
          contentContainerStyle={styles(colors).scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Bank Name Input */}
          <View style={styles(colors).inputSection}>
            <View style={styles(colors).labelContainer}>
              <Captions
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles(colors).label}>Bank Name *</Text>
            </View>

            <TextInput
              style={[styles(colors).textInput]}
              value={formData.bankName}
              onChangeText={(text) => updateField("bankName", text)}
              placeholder="Card bank issuer..."
              placeholderTextColor={GlobalColors.gray[400]}
              keyboardType="default"
              returnKeyType="next"
            />

            {errors.bankName && (
              <Text style={styles(colors).errorText}>{errors.bankName}</Text>
            )}
          </View>

          {/* Card Type Selection */}
          <View style={styles(colors).typeSelectionButtons}>
            <TouchableOpacity
              style={
                formData.cardType === "debit"
                  ? styles(colors).activeTypeButton
                  : styles(colors).inactiveTypeButton
              }
              onPress={() => updateField("cardType", "debit")}
              activeOpacity={0.7}
            >
              <Text
                style={
                  formData.cardType === "debit"
                    ? styles(colors).activeButtonText
                    : styles(colors).inactiveButtonText
                }
              >
                Debit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                formData.cardType === "credit"
                  ? styles(colors).activeTypeButton
                  : styles(colors).inactiveTypeButton
              }
              onPress={() => updateField("cardType", "credit")}
              activeOpacity={0.8}
            >
              <Text
                style={
                  formData.cardType === "credit"
                    ? styles(colors).activeButtonText
                    : styles(colors).inactiveButtonText
                }
              >
                Credit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Last Four Digits Input */}
          <View style={styles(colors).inputSection}>
            <View style={styles(colors).labelContainer}>
              <CreditCard
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles(colors).label}>Last Four Digits *</Text>
            </View>

            <TextInput
              style={[styles(colors).textInput]}
              value={formData.lastFourDigits}
              onChangeText={handleLastFourDigitsChange}
              placeholder="1234"
              placeholderTextColor={GlobalColors.gray[400]}
              keyboardType="numeric"
              maxLength={4}
            />

            {errors.lastFourDigits && (
              <Text style={styles(colors).errorText}>
                {errors.lastFourDigits}
              </Text>
            )}
          </View>

          {/* Cardholder Name Input */}
          <View style={styles(colors).inputSection}>
            <View style={styles(colors).labelContainer}>
              <FileText
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles(colors).label}>Cardholder Name *</Text>
            </View>
            <TextInput
              style={[styles(colors).textInput]}
              placeholder="Name on card..."
              placeholderTextColor={GlobalColors.gray[400]}
              value={formData.cardholderName}
              onChangeText={(text) => updateField("cardholderName", text)}
              keyboardType="default"
              returnKeyType="done"
            />
            {errors.cardholderName && (
              <Text style={styles(colors).errorText}>
                {errors.cardholderName}
              </Text>
            )}
          </View>

          {/* Color picker */}
          <View style={styles(colors).inputSection}>
            <View style={styles(colors).labelContainer}>
              <Palette
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles(colors).label}>Card color</Text>
            </View>
            <ColorPicker
              selectedColor={formData.color}
              onColorSelect={(color) => updateField("color", color)}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles(colors).actionButtons}>
            <TouchableOpacity
              style={styles(colors).cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles(colors).cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles(colors).submitButton,
                (!formData.bankName ||
                  !formData.lastFourDigits ||
                  !formData.cardholderName) &&
                  styles(colors).submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={
                !formData.bankName ||
                !formData.lastFourDigits ||
                !formData.cardholderName
              }
            >
              <Text style={styles(colors).submitButtonText}>
                {isEditing ? "Update Card" : "Add Card"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Delete Button for Editing */}
          {isEditing && (
            <View style={styles(colors).actionButtons}>
              <TouchableOpacity
                style={styles(colors).deleteButton}
                activeOpacity={0.8}
                onPress={() => {
                  handleDelete();
                }}
              >
                <Text style={styles(colors).deleteButtonText}>Delete Card</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: GlobalColors.gray[100],
    },
    header: {
      backgroundColor: "white",
      borderBottomWidth: 1,
      borderBottomColor: GlobalColors.gray[200],
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary[500],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: GlobalColors.gray[900],
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: GlobalColors.gray[100],
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100,
    },
    inputSection: {
      marginBottom: 24,
    },
    labelContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: GlobalColors.gray[700],
    },
    textInput: {
      backgroundColor: "white",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: GlobalColors.gray[200],
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 18,
      color: GlobalColors.gray[900],
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
    actionButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
      paddingBottom: 20,
    },
    typeSelectionButtons: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
      marginBottom: 16,
      borderColor: GlobalColors.gray[300],
      borderWidth: 1,
      borderRadius: 12,
    },
    activeTypeButton: {
      flex: 1,
      backgroundColor: colors.primary[500],
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
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
    activeButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
    inactiveTypeButton: {
      flex: 1,
      backgroundColor: GlobalColors.gray[100],
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    inactiveButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: GlobalColors.gray[700],
    },
    cancelButton: {
      flex: 1,
      backgroundColor: GlobalColors.gray[100],
      borderWidth: 1,
      borderColor: GlobalColors.gray[500],
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: GlobalColors.gray[700],
    },
    deleteButton: {
      flex: 1,
      backgroundColor: GlobalColors.red,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
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
    deleteButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
    submitButton: {
      flex: 1,
      backgroundColor: colors.primary[500],
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
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
    submitButtonDisabled: {
      backgroundColor: GlobalColors.gray[300],
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginTop: 4,
    },
  });
