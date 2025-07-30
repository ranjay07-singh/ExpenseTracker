import CustomTabs from "@/components/CustomTabs";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Tabs tabBar={CustomTabs} screenOptions={{ headerShown: false, tabBarLabelStyle: {color: "white" }}}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="TipsScreen" />
      <Tabs.Screen name="profile" />
    </Tabs>
    </GestureHandlerRootView>
  );
};

export default _layout;

const styles = StyleSheet.create({});