import {
  Calendar,
  DollarSign,
  FileText,
  Receipt,
  Tag,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlobalColors } from "@/constants/styles";
import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch } from "@/store/hooks";
import { addTransaction } from "@/store/slices/transactionSlice";

interface AddTransactionModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  // Form state
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{
    amount?: string;
    category?: string;
  }>({});
  const [transactionType, setTransactionType] = useState("expense");

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Travel",
    "Other",
  ];

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setErrors({});
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatAmount(text);
    setAmount(formatted);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleSubmit = () => {
    // Validation
    const newErrors: { amount?: string; category?: string } = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create transaction
    const transaction = {
      id: Date.now().toString(),
      title: description || `${category} expense`,
      amount: parseFloat(amount),
      type: "expense" as const,
      category: category.toLowerCase(),
      date: new Date(date).toISOString(),
      description: description || `${category} expense`,
    };

    dispatch(addTransaction(transaction));
    resetForm();
    onClose();
  };

  const formatAmount = (text: string) => {
    // Remove any non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + "." + parts[1].substring(0, 2);
    }

    return cleaned;
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
                <Receipt
                  size={20}
                  color="white"
                />
              </View>
              <Text style={styles(colors).headerTitle}>Add Expense</Text>
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
          {/* Amount Input */}
          <View style={styles(colors).inputSection}>
            <View style={styles(colors).labelContainer}>
              <DollarSign
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles(colors).label}>Amount *</Text>
            </View>
            <View style={styles(colors).amountInputContainer}>
              <Text style={styles(colors).currencySymbol}>€</Text>
              <TextInput
                style={styles(colors).amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                placeholderTextColor={GlobalColors.gray[400]}
                keyboardType="numeric"
                returnKeyType="none"
              />
            </View>
            {errors.amount && (
              <Text style={styles(colors).errorText}>{errors.amount}</Text>
            )}
          </View>

          {/* Category Selection */}
          <View style={styles(colors).inputSection}>
            <View style={styles(colors).labelContainer}>
              <Tag
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles(colors).label}>Category *</Text>
            </View>
            <View style={styles(colors).categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles(colors).categoryButton,
                    category === cat && styles(colors).categoryButtonSelected,
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    if (errors.category) {
                      setErrors((prev) => ({ ...prev, category: undefined }));
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles(colors).categoryButtonText,
                      category === cat &&
                        styles(colors).categoryButtonTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && (
              <Text style={styles(colors).errorText}>{errors.category}</Text>
            )}
          </View>

          {/* Date Input */}
          <View style={styles(colors).inputSection}>
            <View style={styles(colors).labelContainer}>
              <Calendar
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles(colors).label}>Date</Text>
            </View>
            <TextInput
              style={styles(colors).textInput}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={GlobalColors.gray[400]}
              returnKeyType="next"
            />
          </View>

          {/* Description Input */}
          <View style={styles(colors).inputSection}>
            <View style={styles(colors).labelContainer}>
              <FileText
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles(colors).label}>Description</Text>
            </View>
            <TextInput
              style={[styles(colors).textInput, styles(colors).textArea]}
              placeholder="Add a note about this expense..."
              placeholderTextColor={GlobalColors.gray[400]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="done"
            />
          </View>

          {/* Action Buttons - Now inside ScrollView */}
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
                (!amount || !category) && styles(colors).submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={!amount || !category}
            >
              <Text style={styles(colors).submitButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
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
      paddingBottom: 40,
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
    amountInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: GlobalColors.gray[200],
      paddingHorizontal: 16,
      paddingVertical: 12,
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
    currencySymbol: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.primary[500],
      marginRight: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 20,
      fontWeight: "600",
      color: GlobalColors.gray[900],
      padding: 0,
    },
    textInput: {
      backgroundColor: "white",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: GlobalColors.gray[200],
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
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
    textArea: {
      minHeight: 80,
      paddingTop: 12,
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    categoryButton: {
      backgroundColor: "white",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: GlobalColors.gray[200],
      paddingHorizontal: 16,
      paddingVertical: 12,
      minWidth: "30%",
      alignItems: "center",
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
    categoryButtonSelected: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    categoryButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: GlobalColors.gray[700],
    },
    categoryButtonTextSelected: {
      color: "white",
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
      paddingBottom: 20,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: GlobalColors.gray[100],
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
