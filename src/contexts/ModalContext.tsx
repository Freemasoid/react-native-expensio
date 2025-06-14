import React, { createContext, ReactNode, useContext, useState } from "react";

interface ModalContextType {
  isAddExpenseModalVisible: boolean;
  setIsAddExpenseModalVisible: (visible: boolean) => void;
  openAddExpenseModal: () => void;
  closeAddExpenseModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] =
    useState(false);

  const openAddExpenseModal = () => setIsAddExpenseModalVisible(true);
  const closeAddExpenseModal = () => setIsAddExpenseModalVisible(false);

  const value: ModalContextType = {
    isAddExpenseModalVisible,
    setIsAddExpenseModalVisible,
    openAddExpenseModal,
    closeAddExpenseModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
