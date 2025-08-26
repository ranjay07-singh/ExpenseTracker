import { colors } from "@/constants/theme";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }) => {
  return (
    <SafeAreaView
      style={[
        styles.container,
        style,
      ]}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />
      {children}
    </SafeAreaView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
    paddingTop: Platform.OS === "ios" ? height * 0.02 : 0, // small padding for iOS
  },
});
