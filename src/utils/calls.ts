import { Card, NewCard, Transaction } from "@/types/types";
import apiClient from "./api";

// Transactions

export async function getUserTransactions(
  clerkId: string,
  options?: { year?: string; month?: string }
) {
  try {
    const response = await apiClient.get(`/transactions/${clerkId}`, {
      params: {
        year: options?.year,
        month: options?.month,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch user expenses:", error);
    throw error;
  }
}

export async function createTransaction(clerkId: string, data: Transaction) {
  try {
    const response = await apiClient.post(`/transactions/${clerkId}`, data);
    return response;
  } catch (error) {
    console.error("Failed to create user transaction", error);
  }
}

export async function updateTransaction(clerkId: string, data: Transaction) {
  try {
    const response = await apiClient.post(
      `/transactions/update/${clerkId}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Failed to update user transaction", error);
  }
}

export async function deleteTransaction(clerkId: string, data: Transaction) {
  try {
    const response = await apiClient.delete(`/transactions/${clerkId}`, {
      data,
    });
    return response;
  } catch (error) {
    console.error("Failed to delete user transaction", error);
  }
}

// Categories

export async function createUserCategoriesDocument(clerkId: string) {
  try {
    const response = await apiClient.post(
      `/userCategories/createUserCategoriesDocument`
    );
    return response;
  } catch (error) {
    console.error("Failed to create user categories document", error);
  }
}

export async function getUserCategories(clerkId: string) {
  try {
    const response = await apiClient.get(`/userCategories/${clerkId}`);
    return response;
  } catch (error) {
    console.error("Failed to get user categories", error);
  }
}

export async function addUserCategory(clerkId: string, category: string) {
  try {
    const response = await apiClient.post(`/userCategories/${clerkId}`, {
      category: category,
    });
    return response;
  } catch (error) {
    console.error("Failed to add user category", error);
  }
}

export async function updateUserCategory(
  clerkId: string,
  category: string,
  newCategory: string
) {
  try {
    const response = await apiClient.post(`/userCategories/${clerkId}`, {
      category: category,
      newCategory: newCategory,
    });
    return response;
  } catch (error) {
    console.error("Failed to update user category", error);
  }
}

export async function deleteUserCategory(clerkId: string, category: string) {
  try {
    const response = await apiClient.post(`/userCategories/${clerkId}`, {
      category: category,
    });
    return response;
  } catch (error) {
    console.error("Failed to delete user category", error);
  }
}

// Cards

export async function getUserCards(clerkId: string) {
  try {
    const response = await apiClient.get(`/cards/${clerkId}`);
    return response;
  } catch (error) {
    console.error("Failed to get user cards", error);
    throw error;
  }
}

export async function createCard(clerkId: string, data: NewCard) {
  try {
    const response = await apiClient.post(`/cards/${clerkId}`, data);
    return response;
  } catch (error) {
    console.error("Failed to create a card:", error);
    throw error;
  }
}

export async function updateCard(clerkId: string, data: Card) {
  try {
    const response = await apiClient.post(`/cards/update/${clerkId}`, data);
    return response;
  } catch (error) {
    console.error("Failed to update a card", error);
    throw error;
  }
}

export async function deleteCard(clerkId: string, data: Partial<Card>) {
  try {
    const response = await apiClient.delete(`/cards/${clerkId}`, { data });
    return response;
  } catch (error) {
    console.error("Failed to delete a card", error);
    throw error;
  }
}
