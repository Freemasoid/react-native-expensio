import React, { createContext, ReactNode, useContext, useState } from "react";

type ScreenType = "home" | "transactions" | "settings";

interface ScreenContextType {
  currentScreen: ScreenType;
  navigateToScreen: (screen: ScreenType) => void;
  goBack: () => void;
  screenHistory: ScreenType[];
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

export const useScreenNavigation = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error("useScreenNavigation must be used within a ScreenProvider");
  }
  return context;
};

interface ScreenProviderProps {
  children: ReactNode;
}

export const ScreenProvider: React.FC<ScreenProviderProps> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("home");
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(["home"]);

  const navigateToScreen = (screen: ScreenType) => {
    setCurrentScreen(screen);
    setScreenHistory((prev) => [...prev, screen]);
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = screenHistory.slice(0, -1);
      const previousScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(previousScreen);
    }
  };

  return (
    <ScreenContext.Provider
      value={{
        currentScreen,
        navigateToScreen,
        goBack,
        screenHistory,
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
};
