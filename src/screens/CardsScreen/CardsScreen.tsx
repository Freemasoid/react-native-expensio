import { AddCardModal } from "@/components/modals/AddCardModal";
import { useCards } from "@/hooks/useCards";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import type { Card } from "@/store/slices/cardsSlice";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddCardButton, CardItem, EmptyState } from "./components";
import { styles } from "./styles";

const CardsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { cards } = useCards();
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const insets = useSafeAreaInsets();

  const handleCloseCardModal = () => {
    setIsCardModalVisible(false);
    setSelectedCard(undefined);
  };

  const handleOpenCardModal = (data: Card) => {
    setSelectedCard(data);
    setIsCardModalVisible(true);
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
          {!cards || cards.length === 0 ? (
            <EmptyState onPress={() => setIsCardModalVisible(true)} />
          ) : (
            <ScrollView
              style={styles(colors).scrollView}
              contentContainerStyle={styles(colors).scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Cards List */}
              {cards.map((card, index) => (
                <CardItem
                  key={card._id || `card-${index}`}
                  card={card}
                  onEdit={() => handleOpenCardModal(card)}
                />
              ))}

              {/* Add Card Button */}
              <AddCardButton onPress={() => setIsCardModalVisible(true)} />

              {/* Bottom spacing for safe area */}
              <View style={styles(colors).bottomSpacing} />
            </ScrollView>
          )}
        </View>

        <AddCardModal
          isVisible={isCardModalVisible}
          onClose={handleCloseCardModal}
          card={selectedCard}
        />
      </ScrollView>
    </MenuProvider>
  );
};

export default CardsScreen;
