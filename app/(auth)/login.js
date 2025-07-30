import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

const Login = () => {
    
    const emailRef = React.useRef("");
    const passwordRef = React.useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); 
    const {login: loginUser} = useAuth();

    const handleSubmit = async ()=>{
        if(!emailRef.current || !passwordRef.current){
            Alert.alert('Login', "Please fill all the fields");
            return;
        }
        setIsLoading(true);
        // Using values from refs
        const res = await loginUser(emailRef.current, passwordRef.current);
        setIsLoading(false);
        if(!res.success){
            Alert.alert('Login', res.msg || 'Login failed'); // Add fallback message
        }
        // Successful login is handled by the AuthProvider/authContext listener typically
    };

    // Function to handle navigation to Forgot Password
    const goToForgotPassword = () => {
       
        router.push('/ForgotPassword');
    };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />
        <View style={{gap: 5, marginTop: spacingY._20}}>
        <Typo size={30} fontWeight={"800"} color={colors.textLight}>
            Hey,
        </Typo>
        <Typo size={30} fontWeight={"800"} color={colors.textLight}>
            Welcome Back!
        </Typo>
        </View>
        {/* form */}
        <View style={styles.form}>
            <Typo size={20} color={colors.textLighter}>
                Login Now to track your expenses
            </Typo>
            <Input placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
            keyboardType="email-address" 
            autoCapitalize="none" 
            icon={<Icons.At
            size={verticalScale(26)}
            color={colors.neutral300}
            weight="fill"
            />
            }
            />
            <Input placeholder="Enter your password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
            icon={<Icons.Lock
            size={verticalScale(26)}
            color={colors.neutral300}
            weight="fill"
            />
            }
            />

            {/* --- FIX START: Make "Forgot Password?" pressable --- */}
            <Pressable onPress={goToForgotPassword} style={{ alignSelf: 'flex-end' }}>
                <Typo size={14} color={colors.text}>
                    Forgot Password?
                </Typo>
            </Pressable>
            {/* --- FIX END --- */}
            <Button loading={isLoading} onPress={handleSubmit}>
                <Typo fontWeight={'700'} color={colors.black} size={21}>
                    Login
                </Typo>
            </Button>
            </View>

        <View style={styles.footer}>
            <Typo size={15} color={colors.textLight}> Don't have an account? </Typo>
            <Pressable onPress={()=> router.push("/register")}>
                <Typo size={15} fontWeight={'700'} color={colors.primary}>
                    Sign up
                </Typo>
            </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: { 
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },

footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 'auto', 
    paddingBottom: spacingY._20
},
footerText: { 
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
},
});