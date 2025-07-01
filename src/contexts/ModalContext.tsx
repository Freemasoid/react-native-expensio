import { AddTransactionModal } from "@/components/modals";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface ModalContextType {
  isAddTransactionModalVisible: boolean;
  setIsAddTransactionModalVisible: (visible: boolean) => void;
  openAddTransactionModal: () => void;
  closeAddTransactionModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isAddTransactionModalVisible, setIsAddTransactionModalVisible] =
    useState(false);

  const openAddTransactionModal = () => setIsAddTransactionModalVisible(true);
  const closeAddTransactionModal = () => setIsAddTransactionModalVisible(false);

  const value: ModalContextType = {
    isAddTransactionModalVisible,
    setIsAddTransactionModalVisible,
    openAddTransactionModal,
    closeAddTransactionModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <AddTransactionModal
        isVisible={isAddTransactionModalVisible}
        onClose={closeAddTransactionModal}
      />
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
