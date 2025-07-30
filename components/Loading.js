import { colors } from "@/constants/theme";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
  
  const Loading = ({ size = "large", color = colors.primary }) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  };
  
  export default Loading;
  
  const styles = StyleSheet.create({});
  