// /* eslint-disable import/first */
// import 'react-native-reanimated'; // must be first import
// /* eslint-enable import/first */
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

const index = () => { 
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            router.push("/(auth)/welcome");
        }, 2000);
    }, []); 

  return (
    <ScreenWrapper>
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../assets/images/EX2.png")} 
      />
    </View>
    </ScreenWrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "20%",
    aspectRatio: 1,
  },
});