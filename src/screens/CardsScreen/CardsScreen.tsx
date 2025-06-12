import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Card } from "@/store/slices/cardsSlice";
import { addCard } from "@/store/slices/cardsSlice";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddCardButton, CardItem, EmptyState } from "./components";
import { styles } from "./styles";

const CardsScreen: React.FC = () => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { cards, isLoading } = useAppSelector((state) => state.cards);
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const insets = useSafeAreaInsets();

  const handleAddCard = () => {
    Alert.alert(
      "Add New Card",
      "This would open a form to add a new card. For demo purposes, we'll add a sample card.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add Sample Card",
          onPress: () => {
            const newCard: Omit<Card, "id" | "createdAt"> = {
              bankName: "Sample Bank",
              cardType: "credit",
              lastFourDigits: "1234",
              expiryMonth: "12",
              expiryYear: "25",
              cardholderName: "John Doe",
              isDefault: cards.length === 0,
              color: "#6366f1",
            };
            dispatch(addCard(newCard));
          },
        },
      ]
    );
  };

  const handleEditCard = (card: Card) => {
    // TODO: add edit card functionality
  };

  return (
    <MenuProvider>
      <ScrollView style={styles(colors).container}>
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
          <Text style={styles(colors).headerTitle}>My Cards</Text>
          <Text style={styles(colors).headerSubtitle}>
            Manage your payment cards
          </Text>
        </LinearGradient>

        <View style={styles(colors).content}>
          {cards.length === 0 ? (
            <EmptyState onAddCard={handleAddCard} />
          ) : (
            <ScrollView
              style={styles(colors).scrollView}
              contentContainerStyle={styles(colors).scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Cards List */}
              {cards.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  onEdit={handleEditCard}
                />
              ))}

              {/* Add Card Button */}
              <AddCardButton onPress={handleAddCard} />

              {/* Bottom spacing for safe area */}
              <View style={styles(colors).bottomSpacing} />
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </MenuProvider>
  );
};

export default CardsScreen;
