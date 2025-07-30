import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService';
import { scale, verticalScale } from '@/utils/styling';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';


const WalletModal = () => {

    const {user, updateUserData}= useAuth();
    // Removed <WalletType> generic
    const [wallet, setWallet] = useState({
        name: "",
        image: null
    });
    const [loading, setLoading] = useState(false);
    const router =useRouter();

    // Removed inline type annotation
    const oldWallet = useLocalSearchParams();

      useEffect(()=>{
        if(oldWallet?.id){
          setWallet({
            name: oldWallet?.name,
            image: oldWallet?.image,
          })
        }
      }, []); 

    const onSubmit = async () => {
        let {name, image} = wallet;
        if(!name.trim() || !image){
            Alert.alert("Wallet", "Please fill all the fields");
            return;
        }

        // Removed WalletType annotation
        const data ={
          name,
          image,
          uid: user?.uid
        };
        //include wallet id if updating
        if(oldWallet?.id) data.id = oldWallet?.id;
        setLoading(true);
        const res = await createOrUpdateWallet(data);
        setLoading(false);
        if(res.success){
            updateUserData(user?.uid);
            router.back();
        }
        else{
            Alert.alert("Wallet", res.msg);
        }
    };

    const onDelete = async ()=>{
      if(!oldWallet?.id) return;
      setLoading(true);
      const res = await deleteWallet(oldWallet?.id);
      setLoading(false);
      if(res.success){
        router.back();
      }else{
        Alert.alert("Wallet", res.msg);
      }
    };

    const showDeleteAlert=()=>{
      Alert.alert(
        "Confirm",
        "Are you sure you want to do this? \nThis action will remove all tansactions related to this wallet",
    [
      {
        text: "Cancel",
        onPress: ()=> console.log("cancel delete"),
        style: "cancel"
      },
      {
        text: "Delete",
        onPress: ()=> onDelete(),
        style: "destructive"
      },
    ]
    );
    };
    return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ModalWrapper>
        <View style={styles.container}>
          <Header
            title={oldWallet?.id ? "Update Wallet": "New Wallet"}
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />
          {/* form */}
          <ScrollView contentContainerStyle={styles.form}>
            <View style={styles.inputContainer}>
                <Typo color={ colors.neutral200}>Wallet Name</Typo>
                <Input
                placeholder="Salary"
                value={wallet.name}
                onChangeText={(value) =>
                    setWallet({...wallet, name: value})
                }
                />
            </View>
            <View style={styles.inputContainer}>
                <Typo color={ colors.neutral200}>Wallet Icon</Typo>
                <ImageUpload file={wallet.image}
                onClear={()=> setWallet({...wallet, image:null})}
                onSelect={file=> setWallet({...wallet, image: file})}
                placeholder='Upload Image'/>
            </View>
          </ScrollView>
        </View>
        <View style={styles.footer}>
          {oldWallet?.id && !loading &&(
              <Button
              onPress={showDeleteAlert}
              style={{
                backgroundColor: colors.rose,
                paddingHorizontal: spacingX._15
              }}
              >
                <Icons.Trash
                color={colors.white}
                size={verticalScale(24)}
                weight='bold'
                />
              </Button>
            )
          }
            <Button onPress={onSubmit} loading={loading} style={{flex: 1}}>
                <Typo color={colors.black} fontWeight={"700"}>
                  {oldWallet?.id ? "Update Wallet" : "Add Wallet"}
                </Typo>
            </Button>
        </View>
      </ModalWrapper>
      </GestureHandlerRootView>
    );
  };

export default WalletModal

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