import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import TransactionList from '@/components/TransactionList';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

const SearchModal = () => {

    const {user, updateUserData}= useAuth();
    const [loading, setLoading] = useState(false);
    const router =useRouter();
    const [search, setSearch] = useState("");

    const constraints =[
        where("uid", "==", user?.uid),
        orderBy("date", "desc"),
      ];

      // Removed <TransactionType> generic
      const {
        data: allTransactions,
        error,
        loading: transactionsLoading,
      } = useFetchData("transactions", constraints);

      const filteredTransactions = allTransactions?.filter((item) => {
        if(search.length>1){
          if(
            item.category?.toLowerCase()?.includes(search?.toLocaleLowerCase()) ||
            item.type?.toLowerCase()?.includes(search?.toLocaleLowerCase()) ||
            item.description?.toLowerCase()?.includes(search?.toLocaleLowerCase())
      ){
        return true;
      }
      return false;
      }
    return true;
})

    return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ModalWrapper style={{backgroundColor: colors.neutral900}}>
        <View style={styles.container}>
          <Header
            title={"Search"}
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />
          {/* form */}
          <ScrollView contentContainerStyle={styles.form}>
            <View style={styles.inputContainer}>
                <Input
                placeholder="...."
                value={search}
                placeholderTextColor={colors.neutral400}
                containerStyle={{borderColor: colors.neutral700}}
                onChangeText={(value) =>
                    setSearch(value)
                }
                />
            </View>

            <View>
              <TransactionList
              loading={transactionsLoading}
              data={filteredTransactions}
              emptyListMessage='No transactions found'
              />
            </View>
          </ScrollView>
        </View>
      </ModalWrapper>
      </GestureHandlerRootView>
    );
  };

export default SearchModal;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: spacingX._20,
    },
    form:{
        gap:spacingY._30,
        marginTop:spacingY._15
    },
    avatarContainer: {
      position: "relative",
      alignSelf: "center",
    },
    inputContainer: {
        gap: spacingY._10,
    },
    });