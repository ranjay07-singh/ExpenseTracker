import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

const ForgotPassword = () => { 
  const [email, setEmail] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Forgot Password", "Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password Reset", "A reset link has been sent to your email");
      router.push("/(auth)/login");
    } catch (error) { 
      Alert.alert("Error", error.message || "Something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />
        <View style={{ marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"} color={colors.textLight}>
            Forgot Password
          </Typo>
          <Typo size={16} color={colors.textLighter}>
            Enter your email to receive reset instructions
          </Typo>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Enter your email"
            onChangeText={(value) => setEmail(value)} 
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />

          <Button loading={isLoading} onPress={handleResetPassword}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Send Reset Link
            </Typo>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
    marginTop: spacingY._20,
  },
});