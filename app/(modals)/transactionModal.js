import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { expenseCategories, transactionTypes } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService';
import { scale, verticalScale } from '@/utils/styling';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

const TransactionModal = () => {
  const { user } = useAuth();
  const [transaction, setTransaction] = useState({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(), 
    walletId: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const availableWallets = wallets || [];
  const oldTransaction = useLocalSearchParams();

  // Extract the specific primitive values from oldTransaction that the effect uses.
  const oldId = oldTransaction?.id;
  const oldType = oldTransaction?.type;
  const oldAmount = oldTransaction?.amount;
  const oldDescription = oldTransaction?.description;
  const oldCategory = oldTransaction?.category;
  const oldWalletId = oldTransaction?.walletId;
  const oldImage = oldTransaction?.image; 

  useEffect(() => {

    if (oldId) {
      console.log("Updating state from old transaction params:", oldTransaction); 
      setTransaction(prevTransaction => ({
        ...prevTransaction,
        type: oldType ?? prevTransaction.type,
        amount: Number(oldAmount) || 0,
        description: oldDescription || "",
        category: oldCategory || "",
        walletId: oldWalletId ?? prevTransaction.walletId,
        image: oldImage ?? null,
      }));
    }

  }, [oldId, oldType, oldAmount, oldDescription, oldCategory, oldWalletId, oldImage]);
  // --- FIX END ---

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } = transaction;

    if (!walletId || !date || !amount || (type === 'expense' && !category)) {
      Alert.alert("Transaction", "Please fill all the required fields");
      return;
    }

    let transactionData = {
      type,
      amount,
      description,
      category,
      date, 
      walletId,
      image: image ? image : null,
      uid: user?.uid,
      ...(oldId && { id: oldId })
    };

    console.log("Submitting transaction data:", transactionData); 

    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);
    setLoading(false);

    if(res.success){
      router.back();
    } else{
      Alert.alert("Transaction", res.msg || "An error occurred");
    }
  };

  const onDelete = async () => {
    if (!oldId || !oldWalletId) { 
        Alert.alert("Error", "Cannot delete transaction without ID and Wallet ID.");
        return;
    };
    console.log("Deleting transaction with ID:", oldId);
    setLoading(true);
    const res = await deleteTransaction(
      oldId,
      oldWalletId 
    );
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg || "Could not delete transaction");
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: onDelete, style: "destructive" },
      ],
      { cancelable: true }
    );
  };

  // --- Handlers remain the same ---
  const handleTypeChange = (item) => {
    const newCategory = item.value === 'expense' ? transaction.category : "";
    setTransaction({ ...transaction, type: item.value, category: newCategory });
  };
  const handleWalletChange = (item) => {
     setTransaction({ ...transaction, walletId: item.value || "" });
  }
  const handleCategoryChange = (item) => {
      setTransaction({ ...transaction, category: item.value || "" });
  }
  const handleAmountChange = (value) => {
       setTransaction({
          ...transaction,
          amount: Number(value.replace(/[^0-9.]/g, "")) || 0, 
       });
  }
  const handleDescriptionChange = (value) => {
      setTransaction({ ...transaction, description: value });
  }
  const handleImageClear = () => {
      setTransaction({...transaction, image: null});
  }
  const handleImageSelect = (file) => {
      setTransaction({...transaction, image: file});
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ModalWrapper>
        <View style={styles.container}>
          <Header
            title={oldId ? "Update Transaction" : "New Transaction"} 
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />

          <ScrollView
            contentContainerStyle={styles.form}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Transaction Type */}
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>Type</Typo>
              <Dropdown
                style={styles.dropdownContainer}
                activeColor={colors.neutral700}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                data={transactionTypes}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                value={transaction.type}
                onChange={handleTypeChange}
              />
            </View>


            {/* Wallet Input */}
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>Wallet</Typo>
              <Dropdown
                style={styles.dropdownContainer}
                activeColor={colors.neutral700}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                data={availableWallets.map(wallet => ({
                  label: `${wallet?.name || 'Unnamed Wallet'} (₹${wallet?.amount?.toFixed(2) || '0.00'})`, // Safer access
                  value: wallet?.id ?? '', 
                }))}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                placeholder={walletLoading ? 'Loading wallets...' : 'Select wallet'}
                value={transaction.walletId}
                onChange={handleWalletChange}
                disable={walletLoading}
              />
              {walletError && <Typo color={colors.rose} size={12}>Error loading wallets</Typo>}
            </View>

            {/* Expense Categories */}
            {transaction.type === "expense" && (
              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>Expense Category</Typo>
                <Dropdown
                  style={styles.dropdownContainer}
                  activeColor={colors.neutral700}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  iconStyle={styles.dropdownIcon}
                  data={Object.values(expenseCategories)}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  containerStyle={styles.dropdownListContainer}
                  placeholder={'Select category'}
                  value={transaction.category}
                  onChange={handleCategoryChange}
                />
              </View>
            )}

            {/* Amount */}
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>Amount</Typo>
              <Input
                keyboardType='numeric'
                value={transaction.amount?.toString()}
                onChangeText={handleAmountChange}
              />
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <View style={styles.flexRow}>
                <Typo color={colors.neutral200} size={16}>Description</Typo>
                <Typo color={colors.neutral500} size={14}>(Optional)</Typo>
              </View>
              <Input
                value={transaction.description}
                multiline
                containerStyle={styles.multilineInputContainer}
                inputStyle={styles.multilineInput}
                onChangeText={handleDescriptionChange}
              />
            </View>

            {/* Receipt Upload */}
            <View style={styles.inputContainer}>
              <View style={styles.flexRow}>
                <Typo color={ colors.neutral200} size={16} >Receipt</Typo>
                <Typo color={ colors.neutral500} size={14} >(Optional)</Typo>
              </View>
                <ImageUpload
                  file={transaction.image}
                  onClear={handleImageClear}
                  onSelect={handleImageSelect}
                  placeholder='Upload Image'
                />
            </View>
          </ScrollView>
        </View>
        <View style={styles.footer}>
          {/* Delete Button */}
          {oldId && !loading &&( 
              <Button
                onPress={showDeleteAlert}
                style={styles.deleteButton}
              >
                <Icons.Trash
                  color={colors.white}
                  size={verticalScale(24)}
                  weight='bold'
                />
              </Button>
            )
          }

          {/* Submit/Update Button */}
          <Button
             onPress={onSubmit}
             loading={loading}
             style={[styles.submitButton, !oldId && { flex: 1 } ]}
           >
            <Typo color={colors.black} fontWeight={"700"}>
              {oldId ? "Update" : "Submit"} 
            </Typo>
          </Button>
        </View>
      </ModalWrapper>
    </GestureHandlerRootView>
  );
};

export default TransactionModal;

// --- Styles remain the same ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20, 
    backgroundColor: colors.neutral900,
  },
  form: {
    gap: spacingY._20,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    paddingBottom: Platform.OS === 'ios' ? spacingY._20 : spacingY._10,
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
    backgroundColor: colors.neutral900,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
    backgroundColor: colors.neutral800,
  },
  dropdownItemText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    marginTop: 5,
    borderColor: colors.neutral500,
    borderWidth: 1,
  },
  dropdownPlaceholder: {
    color: colors.neutral400,
    fontSize: verticalScale(14),
  },
  dropdownItemContainer: {
    borderRadius: radius._10,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    width: verticalScale(24),
    height: verticalScale(24),
    tintColor: colors.neutral300,
  },
  deleteButton: {
      backgroundColor: colors.rose,
      paddingHorizontal: spacingX._15,
      justifyContent: 'center',
      alignItems: 'center',
      height: verticalScale(54),
      borderRadius: radius._15,
      borderCurve: "continuous",
  },
  submitButton: {
    flex: 1,
    height: verticalScale(54),
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  multilineInputContainer: {
      height: verticalScale(100),
      alignItems: 'flex-start',
      paddingVertical: spacingY._10,
  },
  multilineInput: {
      textAlignVertical: 'top',
      height: '100%',
  },
});