import { useTheme } from "@/hooks/useTheme";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [totalBalance] = useState(4850.0);
  const [monthlyExpenses] = useState(1249.5);
  const [monthlyIncome] = useState(3500.0);
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] =
    useState(false);

  return (
    <ScrollView style={styles(colors).container}>
      <LinearGradient
        colors={[colors.primary[500], colors.primary_accent[500]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles(colors).header, { paddingTop: insets.top }]}
      >
        <View style={styles(colors).headerContent}>
          <View style={styles(colors).headerTop}>
            <View>
              <Text style={styles(colors).greeting}>Hello, John!</Text>
              <Text style={styles(colors).subtitle}>Track your expenses</Text>
            </View>

            <View>
              <View style={styles(colors).avatarContainer}>
                <User
                  size={24}
                  color="white"
                />
              </View>
            </View>
          </View>

          <BlurView
            intensity={20}
            style={styles(colors).balanceCard}
          >
            <Text style={styles(colors).balanceLabel}>Total Balance</Text>
            <Text style={styles(colors).balanceAmount}>
              {totalBalance.toFixed(2)} €
            </Text>
            <View style={styles(colors).balanceDetails}>
              <View>
                <Text style={styles(colors).balanceDetailLabel}>Income</Text>
                <Text style={styles(colors).incomeAmount}>
                  +{monthlyIncome.toFixed(2)} €
                </Text>
              </View>
              <View>
                <Text style={styles(colors).balanceDetailLabel}>Expenses</Text>
                <Text style={styles(colors).expenseAmount}>
                  -{monthlyExpenses.toFixed(2)} €
                </Text>
              </View>
            </View>
          </BlurView>
        </View>
      </LinearGradient>

      <View style={styles(colors).content}>
        {/* spending chart */}
        <View style={styles(colors).section}>
          <Text style={styles(colors).sectionTitle}>
            This month&apos;s spending
          </Text>
        </View>

        {/* categories */}
        <View style={styles(colors).section}>
          <Text style={styles(colors).sectionTitle}>Categories</Text>
        </View>

        {/* recent transactions */}
        <View style={styles(colors).section}>
          <View style={styles(colors).transactionsHeader}>
            <Text style={styles(colors).sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles(colors).seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingVertical: 48,
      paddingHorizontal: 32,
    },
    headerContent: {
      gap: 24,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    greeting: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
    },
    subtitle: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
    },
    avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    balanceCard: {
      borderRadius: 24,
      padding: 24,
      overflow: "hidden",
    },
    balanceLabel: {
      fontSize: 18,
      color: "rgba(255, 255, 255, 0.8)",
      marginBottom: 8,
    },
    balanceAmount: {
      fontSize: 32,
      fontWeight: "bold",
      color: "white",
      marginBottom: 16,
    },
    balanceDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    balanceDetailLabel: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
    },
    incomeAmount: {
      fontSize: 18,
      fontWeight: "600",
      color: "white",
    },
    expenseAmount: {
      fontSize: 18,
      fontWeight: "600",
      color: "white",
    },
    content: {
      paddingHorizontal: 24,
      marginTop: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.primary[400],
      marginBottom: 16,
    },
    transactionsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    seeAllButton: {
      color: colors.primary[600],
      fontSize: 14,
      fontWeight: "500",
    },
  });

export default HomeScreen;
