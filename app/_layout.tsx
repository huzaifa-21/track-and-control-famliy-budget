import { Stack } from "expo-router";
import "./global.css";
import { I18nManager, Platform } from "react-native";
import { AuthProvider } from "../context/AuthContext";
import "expo-dev-client";

if (I18nManager.isRTL) {
  I18nManager.forceRTL(false);
  I18nManager.allowRTL(false);
}

const StackLayout = () => (
  <Stack
    screenOptions={{
      headerShown: false,
      ...Platform.select({
        android: {
          statusBarTranslucent: true,
          statusBarBackgroundColor: "transparent",
          statusBarStyle: "dark",
        },
      }),
    }}
  >
    <Stack.Screen
      name="(modals)/profileModal"
      options={{
        presentation: "modal",
      }}
    />
    <Stack.Screen
      name="(modals)/walletModal"
      options={{
        presentation: "modal",
      }}
    />
    <Stack.Screen
      name="(modals)/transactionModal"
      options={{
        presentation: "modal",
      }}
    />
    <Stack.Screen
      name="(modals)/searchModal"
      options={{
        presentation: "modal",
      }}
    />
  </Stack>
);

export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
