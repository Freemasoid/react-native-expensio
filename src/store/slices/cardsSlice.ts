import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addCardOptimistic,
  clearCardStorage,
  fetchAndStoreCards,
  loadCardsFromStorage,
} from "../thunks/cardThunk";

export interface Card {
  _id: string;
  bankName: string;
  cardType: "credit" | "debit";
  lastFourDigits: string;
  cardholderName: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  _v: number;
}

interface CardsState {
  cards: Card[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CardsState = {
  cards: [
    {
      _id: "686ebabb9527f4e45c8dc832",
      bankName: "Bank of America",
      cardType: "debit",
      lastFourDigits: "4567",
      cardholderName: "John Doe",
      color: "#1a472a",
      isDefault: true,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      _v: 0,
    },
    {
      _id: "686ebabb9527f4e45c8dc831",
      bankName: "Chase",
      cardType: "credit",
      lastFourDigits: "8901",
      cardholderName: "John Doe",
      color: "#0f1d4a",
      isDefault: false,
      createdAt: "2024-02-20T14:15:00Z",
      updatedAt: "2024-02-20T14:15:00Z",
      _v: 0,
    },
  ],
  isLoading: false,
  error: null,
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard: (
      state,
      action: PayloadAction<Omit<Card, "_id" | "createdAt">>
    ) => {
      const newCard: Card = {
        ...action.payload,
        _id: `card_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      if (state.cards.length === 0 || newCard.isDefault) {
        state.cards.forEach((card) => (card.isDefault = false));
        newCard.isDefault = true;
      }

      state.cards.push(newCard);
    },

    addCardOptimistically: (
      state,
      action: PayloadAction<Card & { tempId: string }>
    ) => {
      const newCard = action.payload;

      if (state.cards.length === 0 || newCard.isDefault) {
        state.cards.forEach((card) => (card.isDefault = false));
        newCard.isDefault = true;
      }

      state.cards.push(newCard);
    },

    updateCard: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Card> }>
    ) => {
      const { id, updates } = action.payload;
      const cardIndex = state.cards.findIndex((card) => card._id === id);

      if (cardIndex !== -1) {
        if (updates.isDefault) {
          state.cards.forEach((card) => (card.isDefault = false));
        }

        state.cards[cardIndex] = { ...state.cards[cardIndex], ...updates };
      }
    },

    removeCard: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      const cardToRemove = state.cards.find((card) => card._id === cardId);

      state.cards = state.cards.filter((card) => card._id !== cardId);

      if (cardToRemove?.isDefault && state.cards.length > 0) {
        state.cards[0].isDefault = true;
      }
    },

    setDefaultCard: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      state.cards.forEach((card) => {
        card.isDefault = card._id === cardId;
      });
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearCards: (state) => {
      state.cards = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCardsFromStorage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCardsFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.cards = action.payload;
        }
      })
      .addCase(loadCardsFromStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Failed to load cards from storage";
      })

      .addCase(fetchAndStoreCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAndStoreCards.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.cards = action.payload;
        }
      })
      .addCase(fetchAndStoreCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch and store cards";
      })

      .addCase(clearCardStorage.fulfilled, (state) => {
        state.cards = [];
        state.error = null;
      })

      .addCase(addCardOptimistic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCardOptimistic.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const { tempId, card } = action.payload;

          const cardIndex = state.cards.findIndex(
            (c: any) => c.tempId === tempId
          );
          if (cardIndex !== -1) {
            state.cards[cardIndex] = card;
          }
        }
      })
      .addCase(addCardOptimistic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to add card";

        const meta = action.meta.arg;
        state.cards = state.cards.filter(
          (card: any) => card.tempId !== meta.tempId
        );
      });
  },
});

export const {
  addCard,
  addCardOptimistically,
  updateCard,
  removeCard,
  setDefaultCard,
  setLoading,
  setError,
  clearCards,
} = cardsSlice.actions;

export default cardsSlice.reducer;
