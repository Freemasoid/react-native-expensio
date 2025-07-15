import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ChartPie, CreditCard, Home, User } from "lucide-react-native";
import React from "react";
import { LogBox, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { AddButton } from "@/components/layout";
import { GlobalColors, GlobalStyles } from "@/constants/styles";
import { ModalProvider, useModal } from "@/contexts";
import { useTheme } from "@/hooks/useTheme";
import { persistor, store } from "@/store/store";

import AnalyticsScreen from "@/screens/AnalyticsScreen";
import CardsScreen from "@/screens/CardsScreen";
import HomeScreen from "@/screens/HomeScreen";
import ProfileScreen from "@/screens/ProfileScreen";

// Suppress Victory Native reanimated warning
LogBox.ignoreLogs([
  "It looks like you might be using shared value's .value inside reanimated inline style",
]);

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors } = useTheme();
  const { openAddTransactionModal } = useModal();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        headerShown: false,
        tabBarStyle: {
          backgroundColor: GlobalColors.gray[100],
          borderTopColor: GlobalColors.gray[200],
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Home
              color={color}
              size={size}
            />
          ),
        }}
      >
        {() => (
          <View style={[GlobalStyles.screenContainer]}>
            <StatusBar style="light" />
            <HomeScreen />
          </View>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Analytics"
        options={{
          tabBarIcon: ({ color, size }) => (
            <ChartPie
              color={color}
              size={size}
            />
          ),
        }}
      >
        {() => (
          <View style={[GlobalStyles.screenContainer]}>
            <StatusBar style="light" />
            <AnalyticsScreen />
          </View>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Add"
        options={{
          tabBarButton: () => <AddButton onPress={openAddTransactionModal} />,
        }}
      >
        {() => null}
      </Tab.Screen>

      <Tab.Screen
        name="Cards"
        options={{
          tabBarIcon: ({ color, size }) => (
            <CreditCard
              color={color}
              size={size}
            />
          ),
        }}
      >
        {() => (
          <View style={[GlobalStyles.screenContainer]}>
            <StatusBar style="light" />
            <CardsScreen />
          </View>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <User
              color={color}
              size={size}
            />
          ),
        }}
      >
        {() => (
          <View style={[GlobalStyles.screenContainer]}>
            <StatusBar style="light" />
            <ProfileScreen />
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <ModalProvider>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </ModalProvider>
      </PersistGate>
    </Provider>
  );
}
