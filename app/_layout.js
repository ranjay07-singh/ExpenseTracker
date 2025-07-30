import { AuthProvider } from "@/contexts/authContext";
import { Stack } from 'expo-router';
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});