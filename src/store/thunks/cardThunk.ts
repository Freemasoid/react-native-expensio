import { NewCard } from "@/types/types";
import { createCard, getUserCards, updateCard } from "@/utils/calls";
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
  async ({
    clerkId,
    data,
    tempId,
  }: {
    clerkId: string;
    data: NewCard;
    tempId: string;
  }) => {
    try {
      const response = await createCard(clerkId, data);

      if (!response) {
        throw new Error("Failed to create card - no response received");
      }

      const storedCards = await AsyncStorage.getItem(CARDS_STORAGE_KEY);
      const cards = storedCards ? JSON.parse(storedCards) : [];

      const updatedCards = cards.map((card: any) =>
        card.tempId === tempId ? response.data : card
      );

      await AsyncStorage.setItem(
        CARDS_STORAGE_KEY,
        JSON.stringify(updatedCards)
      );

      return { tempId, card: response.data };
    } catch (error) {
      console.error("Failed to add new card:", error);
      throw error;
    }
  }
);

export const updateCardOptimistic = createAsyncThunk(
  "cards/updateCardOptimistic",
  async ({ clerkId, data }: { clerkId: string; data: any }) => {
    try {
      const response = await updateCard(clerkId, data);

      if (!response) {
        throw new Error("Failed to update card - no response received");
      }

      const storedCards = await AsyncStorage.getItem(CARDS_STORAGE_KEY);
      const cards = storedCards ? JSON.parse(storedCards) : [];

      const updatedCards = cards.map((card: any) =>
        card._id === data._id ? response.data.card : card
      );

      await AsyncStorage.setItem(
        CARDS_STORAGE_KEY,
        JSON.stringify(updatedCards)
      );

      return response.data.card;
    } catch (error) {
      console.error("Failed to update card:", error);
      throw error;
    }
  }
);
