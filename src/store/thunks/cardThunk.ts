import { NewCard } from "@/types/types";
import {
  createCard,
  deleteCard,
  getUserCards,
  setDefaultCard,
  updateCard,
} from "@/utils/calls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

const CARDS_STORAGE_KEY = "userCards";
const PENDING_CARDS_KEY = "pendingCards";

export const loadCardsFromStorage = createAsyncThunk(
  "cards/loadFromStorage",
  async () => {
    try {
      const storedData = await AsyncStorage.getItem(CARDS_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error("Failed to load cards from: storage", error);
      return null;
    }
  }
);

export const fetchAndStoreCards = createAsyncThunk(
  "cards/fetchAndStore",
  async (clerkId: string) => {
    try {
      const response = await getUserCards(clerkId);
      const cardData = response.data.cards || [];

      await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cardData));

      return cardData;
    } catch (error) {
      console.error("Failed to fetch and store cards", error);
      throw error;
    }
  }
);

export const clearCardStorage = createAsyncThunk(
  "cards/clearStorage",
  async () => {
    try {
      await AsyncStorage.removeItem(CARDS_STORAGE_KEY);
      await AsyncStorage.removeItem(PENDING_CARDS_KEY);
    } catch (error) {
      console.error("Failed to clear cards storage:", error);
    }
  }
);

export const addCardOptimistic = createAsyncThunk(
  "cards/addCardOptimistic",
  async ({ clerkId, data }: { clerkId: string; data: NewCard }) => {
    const storedCards = await AsyncStorage.getItem(CARDS_STORAGE_KEY);
    const cards = storedCards ? JSON.parse(storedCards) : [];

    const tempId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    const optimisticCard = {
      ...data,
      _id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const optimisticCards = [...cards, optimisticCard];
    await AsyncStorage.setItem(
      CARDS_STORAGE_KEY,
      JSON.stringify(optimisticCards)
    );

    try {
      const response = await createCard(clerkId, data);

      if (!response) {
        throw new Error("Failed to create card - no response received");
      }

      const updatedCards = optimisticCards.map((card: any) =>
        card.tempId === tempId ? response.data : card
      );

      await AsyncStorage.setItem(
        CARDS_STORAGE_KEY,
        JSON.stringify(updatedCards)
      );

      return { tempId, card: response.data };
    } catch (error) {
      await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
      console.error("Failed to add new card:", error);
      throw error;
    }
  }
);

export const updateCardOptimistic = createAsyncThunk(
  "cards/updateCardOptimistic",
  async ({ clerkId, data }: { clerkId: string; data: any }) => {
    const storedCards = await AsyncStorage.getItem(CARDS_STORAGE_KEY);
    const cards = storedCards ? JSON.parse(storedCards) : [];

    const optimisticCards = cards.map((card: any) =>
      card._id === data._id ? { ...card, ...data } : card
    );

    await AsyncStorage.setItem(
      CARDS_STORAGE_KEY,
      JSON.stringify(optimisticCards)
    );

    try {
      const response = await updateCard(clerkId, data);

      if (!response) {
        throw new Error("Failed to update card - no response received");
      }

      const updatedCards = optimisticCards.map((card: any) =>
        card._id === data._id ? response.data.card : card
      );

      await AsyncStorage.setItem(
        CARDS_STORAGE_KEY,
        JSON.stringify(updatedCards)
      );

      return response.data.card;
    } catch (error) {
      await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
      console.error("Failed to update card:", error);
      throw error;
    }
  }
);

export const deleteCardOptimistic = createAsyncThunk(
  "cards/deleteCardOptimistic",
  async ({ clerkId, cardId }: { clerkId: string; cardId: string }) => {
    const storedCards = await AsyncStorage.getItem(CARDS_STORAGE_KEY);
    const cards = storedCards ? JSON.parse(storedCards) : [];

    const optimisticCards = cards.filter((card: any) => card._id !== cardId);

    await AsyncStorage.setItem(
      CARDS_STORAGE_KEY,
      JSON.stringify(optimisticCards)
    );

    try {
      const response = await deleteCard(clerkId, { _id: cardId });

      if (!response) {
        throw new Error("Failed to delete card - no response received");
      }

      return cardId;
    } catch (error) {
      await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
      console.error("Failed to delete card:", error);
      throw error;
    }
  }
);

export const setDefaultCardOptimistic = createAsyncThunk(
  "cards/setDefaultCardOptimistic",
  async ({ clerkId, cardId }: { clerkId: string; cardId: string }) => {
    const storedCards = await AsyncStorage.getItem(CARDS_STORAGE_KEY);
    const cards = storedCards ? JSON.parse(storedCards) : [];

    const optimisticCards = cards.map((card: any) => ({
      ...card,
      isDefault: card._id === cardId,
    }));

    await AsyncStorage.setItem(
      CARDS_STORAGE_KEY,
      JSON.stringify(optimisticCards)
    );

    try {
      const response = await setDefaultCard(clerkId, { _id: cardId });

      if (!response) {
        throw new Error("Failed to set card as default - no response received");
      }

      if (response.data.cards) {
        await AsyncStorage.setItem(
          CARDS_STORAGE_KEY,
          JSON.stringify(response.data.cards)
        );
        return response.data.cards;
      }

      return optimisticCards;
    } catch (error) {
      await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
      console.error("Failed to set card as default:", error);
      throw error;
    }
  }
);
