import { GlobalColors } from "@/constants/styles";
import { useTheme } from "@/hooks/useTheme";
import { useTransactions } from "@/hooks/useTransactions";
import { NewTransaction, Transaction } from "@/types/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Calendar,
  Captions,
  EuroIcon,
  FileText,
  Receipt,
  Tag,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
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
import { Dropdown } from "react-native-element-dropdown";

interface AddTransactionModalProps {
  isVisible: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isVisible,
  onClose,
  transaction,
}) => {
  const { colors } = useTheme();

  const [formData, setFormData] = useState<NewTransaction>({
    title: "",
    amount: 0,
    type: "expense",
    category: "",
    date: new Date().toISOString(),
    description: "",
  });

  const updateField = (field: keyof NewTransaction, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const {
    addTransactionOptimistically,
    updateTransactionOptimistically,
    deleteTransactionOptimistically,
  } = useTransactions();

  const [errors, setErrors] = useState<{
    amount?: string;
    category?: string;
  }>({});

  const categories = [
    "food",
    "transport",
    "shopping",
    "entertainment",
    "bills",
    "healthcare",
    "education",
    "travel",
    "housing",
    "utilities",
    "insurance",
    "investment",
    "salary",
    "freelance",
    "gifts",
  ];

  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction) {
      setFormData({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category === "income" ? "" : transaction.category,
        date: transaction.date,
        description: transaction.description || "",
      });
    }
  }, [transaction]);

  const resetForm = () => {
    setFormData({
      title: "",
      amount: 0,
      type: "expense",
      category: "",
      date: new Date().toISOString(),
      description: "",
    });
    setErrors({});
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatAmount(text);
    updateField("amount", parseFloat(formatted) || 0);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const onDatepickerChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      updateField("date", selectedDate.toISOString());
    }
  };

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleSubmit = async () => {
    const newErrors: { amount?: string; category?: string } = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (formData.type === "expense" && !formData.category) {
      newErrors.category = "Please select a category";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isEditing && transaction) {
        const updatedTransaction: Transaction = {
          ...transaction,
          ...formData,
          category: formData.type === "income" ? "income" : formData.category,
        };

        await updateTransactionOptimistically(updatedTransaction);
      } else {
        const newTransaction: NewTransaction = {
          ...formData,
          category: formData.type === "income" ? "income" : formData.category,
        };

        await addTransactionOptimistically(newTransaction);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    try {
      await deleteTransactionOptimistically(transaction);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
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
              <Text style={styles(colors).headerTitle}>
                {isEditing ? "Update Transaction" : "Add Transaction"}
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
          {/* Title Input */}
          <View style={styles(colors).inputSection}>
            <View style={styles(colors).labelContainer}>
              <Captions
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles(colors).label}>Title *</Text>
            </View>
            <View style={styles(colors).amountInputContainer}>
              <TextInput
                style={styles(colors).amountInput}
                value={formData.title}
                onChangeText={(text) => updateField("title", text)}
                placeholder="Name your transaction..."
                placeholderTextColor={GlobalColors.gray[400]}
                keyboardType="default"
                returnKeyType="none"
              />
            </View>
            {errors.amount && (
              <Text style={styles(colors).errorText}>{errors.amount}</Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles(colors).typeSelectionButtons}>
            <TouchableOpacity
              style={
                formData.type === "expense"
                  ? styles(colors).activeTypeButton
                  : styles(colors).inactiveTypeButton
              }
              onPress={() => updateField("type", "expense")}
              activeOpacity={0.7}
            >
              <Text
                style={
                  formData.type === "expense"
                    ? styles(colors).activeButtonText
                    : styles(colors).inactiveButtonText
                }
              >
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                formData.type === "income"
                  ? styles(colors).activeTypeButton
                  : styles(colors).inactiveTypeButton
              }
              onPress={() => updateField("type", "income")}
              activeOpacity={0.8}
            >
              <Text
                style={
                  formData.type === "income"
                    ? styles(colors).activeButtonText
                    : styles(colors).inactiveButtonText
                }
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles(colors).inputSection}>
            <View style={styles(colors).labelContainer}>
              <EuroIcon
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles(colors).label}>Amount *</Text>
            </View>
            <View style={styles(colors).amountInputContainer}>
              <TextInput
                style={styles(colors).amountInput}
                value={formData.amount.toString()}
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
          {formData.type === "expense" && (
            <View style={styles(colors).inputSection}>
              <View style={styles(colors).labelContainer}>
                <Tag
                  size={20}
                  color={colors.primary[500]}
                />
                <Text style={styles(colors).label}>Category *</Text>
              </View>

              <Dropdown
                style={styles(colors).dropdown}
                containerStyle={styles(colors).dropdownContainer}
                data={categories.map((cat) => ({ label: cat, value: cat }))}
                search
                searchPlaceholder="Search..."
                maxHeight={300}
                labelField="label"
                valueField="value"
                selectedTextStyle={styles(colors).dropdownSelectedText}
                itemTextStyle={{ textTransform: "capitalize", fontSize: 18 }}
                inputSearchStyle={{ borderRadius: 6, fontSize: 18 }}
                placeholderStyle={{ fontSize: 18 }}
                value={formData.category}
                onChange={(item) => {
                  updateField("category", item.value);
                }}
              />
            </View>
          )}

          {/* Date Input */}
          <View style={styles(colors).inputSection}>
            <View style={styles(colors).labelContainer}>
              <Calendar
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles(colors).label}>Date *</Text>
            </View>
            <View style={styles(colors).datePickerField}>
              <Text style={styles(colors).datePickerText}>
                {formatDateDisplay(formData.date)}
              </Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date(formData.date)}
                mode={"date"}
                is24Hour={true}
                onChange={onDatepickerChange}
                style={styles(colors).invisibleDatePicker}
              />
            </View>
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
              placeholder="Add a note about this transaction..."
              placeholderTextColor={GlobalColors.gray[400]}
              value={formData.description}
              onChangeText={(text) => updateField("description", text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="done"
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

            {formData.type === "expense" ? (
              <TouchableOpacity
                style={[
                  styles(colors).submitButton,
                  (!formData.amount || !formData.category || !formData.title) &&
                    styles(colors).submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={
                  !formData.amount || !formData.category || !formData.title
                }
              >
                <Text style={styles(colors).submitButtonText}>
                  {isEditing ? "Update Expense" : "Add Expense"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles(colors).submitButton,
                  (!formData.amount || !formData.title) &&
                    styles(colors).submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={!formData.amount || !formData.title}
              >
                <Text style={styles(colors).submitButtonText}>
                  {isEditing ? "Update Income" : "Add Income"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Delete Button for Editing */}
          {isEditing && (
            <View style={styles(colors).actionButtons}>
              <TouchableOpacity
                style={styles(colors).deleteButton}
                activeOpacity={0.8}
                onPress={handleDelete}
              >
                <Text style={styles(colors).deleteButtonText}>
                  Delete Transaction
                </Text>
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
    amountInputContainer: {
      fontSize: 18,
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
    amountInput: {
      flex: 1,
      fontSize: 18,
      fontWeight: "400",
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
    datePickerField: {
      backgroundColor: "white",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: GlobalColors.gray[200],
      paddingHorizontal: 16,
      paddingVertical: 16,
      justifyContent: "center",
      position: "relative",
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
    datePickerText: {
      fontSize: 18,
      fontWeight: "400",
      color: GlobalColors.gray[900],
    },
    invisibleDatePicker: {
      position: "absolute",
      left: 1,
      opacity: 0.1,
      zIndex: 1,
      color: "white",
    },
    textArea: {
      minHeight: 80,
      paddingTop: 12,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
      paddingBottom: 20,
    },
    dropdown: {
      borderRadius: 12,
      borderWidth: 2,
      borderColor: GlobalColors.gray[200],
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 18,
      color: GlobalColors.gray[900],
      height: 50,
      backgroundColor: "white",
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
    dropdownContainer: {
      borderRadius: 12,
      borderColor: GlobalColors.gray[200],
      borderWidth: 1,
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
      fontSize: 18,
    },
    dropdownSelectedText: {
      flex: 1,
      fontSize: 18,
      fontWeight: "400",
      color: GlobalColors.gray[900],
      padding: 0,
      textTransform: "capitalize",
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
