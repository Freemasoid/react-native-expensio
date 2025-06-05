import { AddButton } from "@/components";
import { store } from "@/store/store";
import { PlatformPressable } from "@react-navigation/elements";
import { Tabs } from "expo-router";
import { ChartPie, CreditCard, Home, User } from "lucide-react-native";
import { Provider } from "react-redux";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
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
            tabBarButton: () => <AddButton />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              console.log("tabPress");
            },
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
    </Provider>
  );
}
