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

/**
 * Represents a payment card in the application
 *
 * @interface Card
 * @property {string} _id - Unique identifier for the card
 * @property {string} bankName - Name of the issuing bank
 * @property {"credit" | "debit"} cardType - Type of card (credit or debit)
 * @property {string} lastFourDigits - Last four digits of the card number
 * @property {string} cardholderName - Name of the cardholder
 * @property {string} color - Visual color theme for the card
 * @property {boolean} isDefault - Whether this card is the default payment method
 * @property {string} createdAt - ISO timestamp when the card was created
 * @property {string} updatedAt - ISO timestamp when the card was last updated
 * @property {number} _v - Version number for optimistic concurrency control
 */
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

/**
 * Redux state for payment card management
 *
 * Manages the collection of user payment cards, handles optimistic updates,
 * and tracks async operation states for card-related operations.
 *
 * @interface CardsState
 * @property {Card[]} cards - Array of user payment cards
 * @property {boolean} isLoading - Loading state for async card operations
 * @property {string | null} error - Error message from failed card operations
 */
interface CardsState {
  cards: Card[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial state for card management
 *
 * @property {Card[]} cards - Array of user payment cards
 * @property {boolean} isLoading - Loading state for async card operations
 * @property {string | null} error - Error message from failed card operations
 */
const initialState: CardsState = {
  cards: [],
  isLoading: false,
  error: null,
};

// * HELPER FUNCTIONS

/**
 * Ensures only one card is marked as default when adding a new default card
 * @param cards - Array of existing cards
 * @param newCard - New card being added
 * @param shouldBeDefault - Whether the new card should be default
 */
const handleDefaultCardLogic = (
  cards: Card[],
  newCard: Card,
  shouldBeDefault: boolean = false
) => {
  if (cards.length === 0 || shouldBeDefault) {
    cards.forEach((card) => (card.isDefault = false));
    newCard.isDefault = true;
  }
};

/**
 * Updates the default card status ensuring only one card is default
 * @param cards - Array of cards to update
 * @param targetCardId - ID of the card to set as default
 */
const updateDefaultCardStatus = (cards: Card[], targetCardId: string) => {
  cards.forEach((card) => {
    card.isDefault = card._id === targetCardId;
  });
};

/**
 * Handles default card reassignment when a default card is deleted
 * @param cards - Array of remaining cards after deletion
 * @param wasDefault - Whether the deleted card was the default
 */
const reassignDefaultAfterDeletion = (cards: Card[], wasDefault: boolean) => {
  if (wasDefault && cards.length > 0) {
    cards[0].isDefault = true;
  }
};

// * REDUX SLICE DEFINITION

/**
 * Redux slice for managing payment card state
 *
 * Handles local card CRUD operations, optimistic updates,
 * default card management, and async operation states.
 */
const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    /**
     * Adds a card optimistically to the local state before server confirmation
     * Automatically handles default card logic for first card or explicitly default cards
     */
    addCardOptimistically: (
      state,
      action: PayloadAction<Card & { tempId: string }>
    ) => {
      const newCard = action.payload;
      handleDefaultCardLogic(state.cards, newCard, newCard.isDefault);
      state.cards.push(newCard);
    },

    /**
     * Updates a card optimistically with partial data
     * Handles default card status changes by ensuring only one default exists
     */
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

    /**
     * Removes a card optimistically from local state
     * Automatically reassigns default status to first card if deleted card was default
     */
    deleteCardOptimistically: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      const cardToRemove = state.cards.find((card) => card._id === cardId);
      const wasDefault = cardToRemove?.isDefault;

      state.cards = state.cards.filter((card) => card._id !== cardId);
      reassignDefaultAfterDeletion(state.cards, wasDefault || false);
    },

    /**
     * Sets a specific card as the default payment method
     * Ensures all other cards are marked as non-default
     */
    setDefaultCardOptimistically: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      updateDefaultCardStatus(state.cards, cardId);
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
    // * LOAD FROM STORAGE
    builder
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
        if (action.payload && action.payload.card) {
          const newCard = action.payload.card;

          // Handle default card logic
          if (newCard.isDefault || state.cards.length === 0) {
            state.cards.forEach((card) => (card.isDefault = false));
            newCard.isDefault = true;
          }

          state.cards.push(newCard);
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

          reassignDefaultAfterDeletion(state.cards, wasDefault || false);
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

        // Apply optimistic update immediately
        const cardId = action.meta.arg.cardId;
        updateDefaultCardStatus(state.cards, cardId);
      })
      .addCase(setDefaultCardOptimistic.fulfilled, (state, action) => {
        state.isLoading = false;

        // Update with server-confirmed data if provided
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
