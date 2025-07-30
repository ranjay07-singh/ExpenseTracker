import { StyleSheet, View } from "react-native";
import Typo from "./Typo";

const Header = ({ title = "", leftIcon, style }) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {title && (
        <Typo
          size={22}
          fontWeight={"600"}
          style={{
            textAlign: "center",
            width: leftIcon ? "82%" : "100%",
            color: "white",
          }}
        >
          {title}
        </Typo>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  leftIcon: {
    alignSelf: "flex-start",
  },
});
