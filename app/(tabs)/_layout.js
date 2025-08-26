import CustomTabs from "@/components/CustomTabs";
import { colors } from "@/constants/theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { withLayoutContext } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();
const MaterialTabs = withLayoutContext(Tab.Navigator);

const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MaterialTabs
        tabBar={(props) => <CustomTabs {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.neutral900,
            borderTopWidth: 0, // remove top border to match old style
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: {
            fontSize: 12,
            textTransform: "none", // preserve label text case
            marginBottom: 4, // spacing similar to top tabs
          },
        }}
      >
        <MaterialTabs.Screen name="index" />
        <MaterialTabs.Screen name="statistics" />
        <MaterialTabs.Screen name="wallet" />
        <MaterialTabs.Screen name="TipsScreen" />
        <MaterialTabs.Screen name="profile" />
      </MaterialTabs>
    </GestureHandlerRootView>
  );
};

export default _layout;
