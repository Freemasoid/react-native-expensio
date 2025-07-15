import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addCardOptimistic,
  clearCardStorage,
  deleteCardOptimistic,
  fetchAndStoreCards,
  loadCardsFromStorage,
  setDefaultCardOptimistic,
  updateCardOptimistic,
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
  cards: [],
  isLoading: false,
  error: null,
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
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

    updateCardOptimistically: (
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

    deleteCardOptimistically: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      const cardToRemove = state.cards.find((card) => card._id === cardId);

      state.cards = state.cards.filter((card) => card._id !== cardId);

      if (cardToRemove?.isDefault && state.cards.length > 0) {
        state.cards[0].isDefault = true;
      }
    },

    setDefaultCardOptimistically: (state, action: PayloadAction<string>) => {
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
      // * LOAD FROM STORAGE
      .addCase(loadCardsFromStorage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCardsFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload !== null && action.payload !== undefined) {
          state.cards = action.payload;
        }
      })
      .addCase(loadCardsFromStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Failed to load cards from storage";
      })

      // * FETCH AND STORE
      .addCase(fetchAndStoreCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAndStoreCards.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload !== null && action.payload !== undefined) {
          state.cards = action.payload;
        }
      })
      .addCase(fetchAndStoreCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch and store cards";
      })

      // * CLEAR CARD STORAGE
      .addCase(clearCardStorage.fulfilled, (state) => {
        state.cards = [];
        state.error = null;
      })

      // * ADD CARD OPTIMISTICALLY
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
      })

      // * UPDATE CARD OPTIMISTICALLY
      .addCase(updateCardOptimistic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCardOptimistic.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCard = action.payload;

        if (updatedCard) {
          const cardIndex = state.cards.findIndex(
            (card) => card._id === updatedCard._id
          );
          if (cardIndex !== -1) {
            state.cards[cardIndex] = updatedCard;
          }
        }
      })
      .addCase(updateCardOptimistic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update card";
      })

      // * DELETE CARD OPTIMISTICALLY
      .addCase(deleteCardOptimistic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCardOptimistic.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedCardId = action.payload;

        if (deletedCardId) {
          const cardToDelete = state.cards.find(
            (card) => card._id === deletedCardId
          );
          const wasDefault = cardToDelete?.isDefault;

          state.cards = state.cards.filter(
            (card) => card._id !== deletedCardId
          );

          if (wasDefault && state.cards.length > 0) {
            state.cards[0].isDefault = true;
          }
        }
      })
      .addCase(deleteCardOptimistic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete card";
      })

      // * SET DEFAULT CARD OPTIMISTICALLY
      .addCase(setDefaultCardOptimistic.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;

        const cardId = action.meta.arg.cardId;
        state.cards.forEach((card) => {
          card.isDefault = card._id === cardId;
        });
      })
      .addCase(setDefaultCardOptimistic.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload && Array.isArray(action.payload)) {
          state.cards = action.payload;
        }
      })
      .addCase(setDefaultCardOptimistic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to set default card";
      });
  },
});

export const {
  addCardOptimistically,
  updateCardOptimistically,
  deleteCardOptimistically,
  setDefaultCardOptimistically,
  setLoading,
  setError,
  clearCards,
} = cardsSlice.actions;

export default cardsSlice.reducer;
