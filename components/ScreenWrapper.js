import { colors } from "@/constants/theme";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
  
  const { height } = Dimensions.get("window");
  
  const ScreenWrapper = ({ style, children }) => {
    let paddingTop = Platform.OS === "ios" ? height * 0.06 : 0;
  
    return (
      <View
        style={[
          {
            paddingTop,
            flex: 1,
            backgroundColor: colors.neutral900,
          },
          style,
        ]}
      >
        <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />
        {children}
      </View>
    );
  };
  
  export default ScreenWrapper;
  
  const styles = StyleSheet.create({});
  