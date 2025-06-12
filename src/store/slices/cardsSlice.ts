import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Card {
  id: string;
  bankName: string;
  cardType: "debit" | "credit";
  lastFourDigits: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
  color: string;
  createdAt: string;
}

interface CardsState {
  cards: Card[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CardsState = {
  cards: [
    {
      id: "card_001",
      bankName: "Bank of America",
      cardType: "debit",
      lastFourDigits: "4567",
      expiryMonth: "12",
      expiryYear: "24",
      cardholderName: "John Doe",
      isDefault: true,
      color: "#1a472a",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "card_002",
      bankName: "Chase",
      cardType: "credit",
      lastFourDigits: "8901",
      expiryMonth: "08",
      expiryYear: "25",
      cardholderName: "John Doe",
      isDefault: false,
      color: "#0f1d4a",
      createdAt: "2024-02-20T14:15:00Z",
    },
  ],
  isLoading: false,
  error: null,
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<Omit<Card, "id" | "createdAt">>) => {
      const newCard: Card = {
        ...action.payload,
        id: `card_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

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
      const cardIndex = state.cards.findIndex((card) => card.id === id);

      if (cardIndex !== -1) {
        if (updates.isDefault) {
          state.cards.forEach((card) => (card.isDefault = false));
        }

        state.cards[cardIndex] = { ...state.cards[cardIndex], ...updates };
      }
    },

    removeCard: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      const cardToRemove = state.cards.find((card) => card.id === cardId);

      state.cards = state.cards.filter((card) => card.id !== cardId);

      if (cardToRemove?.isDefault && state.cards.length > 0) {
        state.cards[0].isDefault = true;
      }
    },

    setDefaultCard: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      state.cards.forEach((card) => {
        card.isDefault = card.id === cardId;
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
});

export const {
  addCard,
  updateCard,
  removeCard,
  setDefaultCard,
  setLoading,
  setError,
  clearCards,
} = cardsSlice.actions;

export default cardsSlice.reducer;
