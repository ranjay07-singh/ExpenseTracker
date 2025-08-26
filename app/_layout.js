/* eslint-disable import/first */
import 'react-native-gesture-handler';
import 'react-native-reanimated'; // must be first import
/* eslint-enable import/first */
import { AuthProvider } from "@/contexts/authContext";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Configure foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const StackLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(modals)/profileModal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="(modals)/transactionModal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="(modals)/walletModal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="(modals)/searchModal"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default function RootLayout() {
useEffect(() => {
  let notificationSubscription;
  let responseSubscription;

  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for notifications!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  registerForPushNotificationsAsync();

  notificationSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notification Received:", notification);
    }
  );

  responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log("Notification Clicked:", response);
    }
  );

  return () => {
    notificationSubscription && notificationSubscription.remove();
    responseSubscription && responseSubscription.remove();
  };
}, []);

  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}