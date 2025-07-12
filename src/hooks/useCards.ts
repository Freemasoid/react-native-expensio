import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCardOptimistically as addCardOptimisticallyAction } from "@/store/slices/cardsSlice";
import {
  addCardOptimistic,
  clearCardStorage,
  fetchAndStoreCards,
  loadCardsFromStorage,
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

  useEffect(() => {
    if (autoFetch) {
      initializeCards();
    }
  }, [autoFetch]);

  const initializeCards = useCallback(async () => {
    try {
      await dispatch(loadCardsFromStorage()).unwrap();

      await dispatch(fetchAndStoreCards(USER_ID)).unwrap();
    } catch (error) {
      console.error("Failed to initialize cards:", error);
    }
  }, [dispatch]);

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
        const tempId = `temp_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 11)}`;

        const pendingCard = {
          ...newCard,
          _id: tempId,
          tempId,
          isDefault: newCard.isDefault ?? safeCards.length === 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _v: 0,
        };

        dispatch(addCardOptimisticallyAction(pendingCard));

        await dispatch(
          addCardOptimistic({
            clerkId: USER_ID,
            data: newCard,
            tempId,
          })
        ).unwrap();

        await refreshCards();
      } catch (error) {
        console.error("Failed to add card optimistically:", error);
        throw error;
      }
    },
    [dispatch, safeCards.length, refreshCards]
  );

  return {
    cards: safeCards,
    isLoading,
    error,
    initializeCards,
    refreshCards,
    clearData,
    addCardOptimistically,
  };
};
