import { AddButton } from "@/components/layout";
import { ModalProvider, useModal } from "@/contexts";
import { useTheme } from "@/hooks/useTheme";
import { persistor, store } from "@/store/store";
import { PlatformPressable } from "@react-navigation/elements";
import { Tabs } from "expo-router";
import { ChartPie, CreditCard, Home, User } from "lucide-react-native";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <ModalProvider>
          <TabsLayout />
        </ModalProvider>
      </PersistGate>
    </Provider>
  );
}

function TabsLayout() {
  const { colors } = useTheme();
  const { openAddExpenseModal } = useModal();

  // Custom AddButton wrapper that includes the onPress functionality
  const CustomAddButton = () => <AddButton onPress={openAddExpenseModal} />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        headerShown: false,
        tabBarButton: (props) => (
          <PlatformPressable
            {...props}
            android_ripple={{ color: "transparent" }}
          />
        ),
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, size }) => (
            <ChartPie
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="addButton"
        options={{
          tabBarButton: CustomAddButton,
        }}
      />

      <Tabs.Screen
        name="cards"
        options={{
          title: "Cards",
          tabBarIcon: ({ color, size }) => (
            <CreditCard
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="+not-found"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
