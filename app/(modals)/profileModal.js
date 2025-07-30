import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { getProfileImage } from '@/services/imageService';
import { updateUser } from '@/services/userService';
import { scale, verticalScale } from '@/utils/styling';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

const ProfileModal = () => {

    const {user, updateUserData}= useAuth();
    const [userData, setUserData] = useState({ 
        name: "",
        image: null
    });
    const [loading, setLoading] = useState(false);
    const router =useRouter();

    useEffect(()=>{
        setUserData({
            name: user?.name || "",
            image: user?.image || null
        });
    }, [user]);

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
          });

        console.log(result);

        if (!result.canceled) {
            setUserData({...userData, image: result.assets[0]});
        }
      };

    const onSubmit = async () => {
        let {name, image} = userData;
        if(!name.trim()){
            Alert.alert("User", "Please fill all the fields");
            return;
        }
        setLoading(true);
        const res = await updateUser(user?.uid, userData);
        setLoading(false);
        if(res.success){
            updateUserData(user?.uid);
            router.back();
        }
        else{
            Alert.alert("User", res.msg);
        }
    };
    return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ModalWrapper>
        <View style={styles.container}>
          <Header
            title="Update Profile"
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />
          {/* form */}
          <ScrollView contentContainerStyle={styles.form}>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={getProfileImage(userData.image)}
                contentFit="cover"
                transition={100}
              />
              <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
                <Icons.Pencil
                size={verticalScale(20)}
                color={colors.neutral800}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <Typo color={ colors.neutral200}>Name</Typo>
                <Input
                placeholder="Name"
                value={userData.name}
                onChangeText={(value) =>
                    setUserData({...userData, name: value})
                }
                />
            </View>
          </ScrollView>
        </View>
        <View style={styles.footer}>
            <Button onPress={onSubmit} loading={loading} style={{flex: 1}}>
                <Typo color={colors.black} fontWeight={"700"}>
                    Update
                </Typo>
            </Button>
        </View>
      </ModalWrapper>
      </GestureHandlerRootView>
    );
  };

export default ProfileModal;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: spacingX._20,
    },
    footer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1,
    },
    form:{
        gap:spacingY._30,
        marginTop:spacingY._15
    },
    avatarContainer: {
      position: "relative",
      alignSelf: "center",
    },
    avatar: {
      alignSelf: "center",
      backgroundColor: colors.neutral300,
      height: verticalScale(135),
      width: verticalScale(135),
      borderRadius: 200,
    },
    editIcon: {
      position: "absolute",
      bottom: spacingY._5,
      right: spacingY._7,
      borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
    },
    inputContainer: {
        gap: spacingY._10,
    },
    });