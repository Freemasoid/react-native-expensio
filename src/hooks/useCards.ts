import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addCardOptimistic,
  clearCardStorage,
  deleteCardOptimistic,
  fetchAndStoreCards,
  loadCardsFromStorage,
  setDefaultCardOptimistic,
  updateCardOptimistic,
} from "@/store/thunks/cardThunk";
import { NewCard } from "@/types/types";
import { USER_ID } from "@env";
import { useCallback, useEffect } from "react";

interface UseCardsOptions {
  autoFetch?: boolean;
}

export const useCards = (options: UseCardsOptions = {}) => {
  const { autoFetch = true } = options;
  const dispatch = useAppDispatch();
  const { cards, isLoading, error } = useAppSelector((state) => state.cards);

  const safeCards = cards || [];

  const initializeCards = useCallback(async () => {
    try {
      await dispatch(loadCardsFromStorage()).unwrap();

      await dispatch(fetchAndStoreCards(USER_ID)).unwrap();
    } catch (error) {
      console.error("Failed to initialize cards:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (autoFetch) {
      initializeCards();
    }
  }, [autoFetch, initializeCards]);

  const refreshCards = useCallback(async () => {
    try {
      await dispatch(fetchAndStoreCards(USER_ID)).unwrap();
    } catch (error) {
      console.error("Failed to refresh cards:", error);
      throw error;
    }
  }, [dispatch]);

  const clearData = useCallback(async () => {
    try {
      await dispatch(clearCardStorage()).unwrap();
    } catch (error) {
      console.error("Failed to clear cards:", error);
      throw error;
    }
  }, [dispatch]);

  const addCardOptimistically = useCallback(
    async (newCard: NewCard) => {
      try {
        await dispatch(
          addCardOptimistic({
            clerkId: USER_ID,
            data: newCard,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to add card optimistically:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const updateCardOptimistically = useCallback(
    async (cardData: any) => {
      try {
        await dispatch(
          updateCardOptimistic({
            clerkId: USER_ID,
            data: cardData,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to update card optimistically:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const deleteCardOptimistically = useCallback(
    async (cardId: string) => {
      try {
        await dispatch(
          deleteCardOptimistic({
            clerkId: USER_ID,
            cardId,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to delete card optimistically:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const setDefaultCardOptimistically = useCallback(
    async (cardId: string) => {
      try {
        await dispatch(
          setDefaultCardOptimistic({
            clerkId: USER_ID,
            cardId,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to set card as default:", error);
        throw error;
      }
    },
    [dispatch]
  );

  return {
    cards: safeCards,
    isLoading,
    error,
    initializeCards,
    refreshCards,
    clearData,
    addCardOptimistically,
    updateCardOptimistically,
    deleteCardOptimistically,
    setDefaultCardOptimistically,
  };
};
