import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Loading from "./Loading";

const Button = ({
  style,
  onPress,
  loading = false, 
  children, 
}) => {
  // If loading is true, render a loading indicator within a View
  if (loading) {
    return (
      <View style={[styles.button, style, { backgroundColor: 'transparent' }]}>
        <Loading/>
      </View>
    );
  }
return (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    {typeof children === "string" ? <Text>{children}</Text> : children}
  </TouchableOpacity>
);
};

export default Button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary, 
        borderRadius: radius._17,        
        borderCurve: "continuous",       
        height: verticalScale(52),      
        justifyContent: "center",        
        alignItems: "center"       
    },
});