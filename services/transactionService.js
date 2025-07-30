import { firestore } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { getLast12Months, getLast7Days } from "@/utils/common";
import { scale } from "@/utils/styling";
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { createOrUpdateWallet } from "./walletService";

export const createOrUpdateTransaction = async (transactionData) => {
  try {
    const {id, type, walletId, amount, image} = transactionData;
    if(!amount || amount <= 0 || !walletId || !type){
      return {success: false, msg: "Invalid transaction data!"};
    }

    if(id){
      const oldTransactionSnapshot = await getDoc(doc(firestore, "transactions", id));
      const oldTransaction = oldTransactionSnapshot.data();
      const shouldRevertOrignal = 
        oldTransaction.type !== type || 
        oldTransaction.amount !== amount || 
        oldTransaction.walletId !== walletId;
      if(shouldRevertOrignal){
        let res = await revertAndUpdateWallets(oldTransaction, Number(amount), type, walletId);
        if(!res.success) return res;
      } 
    } else {
      // Update wallet for new txn
      let res = await updateWalletForNewTransaction(walletId, Number(amount), type);
      if(!res.success) return res;
    }

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, {merge: true});

    return { success: true, data: { ...transactionData, id: transactionRef.id } };
  } catch (err) {
    console.log("error creating or updating transaction: ", err);
    return { success: false, msg: err.message };
  }
};

const updateWalletForNewTransaction = async (walletId, amount, type) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);
    if (!walletSnapshot.exists()) {
      console.log("error updating wallet for new transaction");
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data();
    
    if(type === "expense" && walletData.amount - amount < 0){
      return { success: false, msg: "Selected wallet doesn't have enough balance." };
    }
    const updateType = type === 'income' ? "totalIncome" : "totalExpenses";
    const updateWalletAmount = type === "income"
      ? Number(walletData.amount) + amount 
      : Number(walletData.amount) - amount;

    const updatedTotals = type === "income"
      ? Number(walletData.totalIncome) + amount 
      : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updateWalletAmount,
      [updateType]: updatedTotals,
    });
    return { success: true };
  } catch (err) {
    console.log("error updating wallet for new transaction: ", err);
    return { success: false, msg: err.message };
  }
};

const revertAndUpdateWallets = async (oldTransaction, newTransactionAmount, newTransactionType, newWalletId) => {
  try {
    const orignalWalletSnapshot = await getDoc(doc(firestore, "wallets", oldTransaction.walletId));
    const originalWallet = orignalWalletSnapshot.data();
    let newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));
    let newWallet = newWalletSnapshot.data();

    const revertType = oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";
    const revertIncomeExpense = oldTransaction.type === "income" ? -Number(oldTransaction.amount) : Number(oldTransaction.amount);

    const revertedWalletAmount = Number(originalWallet.amount) + revertIncomeExpense;
    const revertedIncomeExpenseAmount = Number(originalWallet[revertType]) - Number(oldTransaction.amount);

    if(newTransactionType === 'expense'){
      if(oldTransaction.walletId === newWalletId && revertedWalletAmount < newTransactionAmount){
        return { success: false, msg: "The selected wallet doesn't have enough balance" };
      }
      if (newWallet.amount < newTransactionAmount) {
        return { success: false, msg: "The selected wallet doesn't have enough balance" };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));
    newWallet = newWalletSnapshot.data();

    const updateType = newTransactionType === "income" ? "totalIncome" : "totalExpenses";
    const updatedTransactionAmount = newTransactionType === "income" 
      ? Number(newTransactionAmount) 
      : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;
    const newIncomeExpenseAmount = Number(newWallet[updateType]) + Number(newTransactionAmount);

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });
    
    return { success: true };
  } catch (err) {
    console.log("error updating wallet for new transaction: ", err);
    return { success: false, msg: err.message };
  }
};

export const deleteTransaction = async (transactionId, walletId) => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);

    if(!transactionSnapshot.exists()){
      return { success: false, msg: "Transaction not found!" };
    }
    const transactionData = transactionSnapshot.data();
    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;
    
    const walletSnapshot = await getDoc(doc(firestore, "wallets", walletId));
    const walletData = walletSnapshot.data();

    const updateType = transactionType === "income" ? "totalIncome" : "totalExpenses";
    const newWalletAmount = walletData?.amount - (transactionType === "income" ? transactionAmount : -transactionAmount);

    const newIncomeExpenseAmount = walletData[updateType] - transactionAmount;

    if(transactionType === "income" && newWalletAmount < 0){
      return { success: false, msg: "You cannot delete this transaction." };
    }

    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    await deleteDoc(transactionRef);
    return { success: true };
  } catch (err) {
    console.log("error updating wallet for new transaction: ", err);
    return { success: false, msg: err.message };
  }
};

export const fetchWeeklyStats = async (uid) => {
  try {
    const db = firestore;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    ); 
    
    const querySnapshot = await getDocs(transactionsQuery);
    const weeklyData = getLast7Days();
    const transactions = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data();
      transaction.id = doc.id;
      transactions.push(transaction);
      const transactionDate = (transaction.date).toDate().toISOString().split("T")[0];
      const dayData = weeklyData.find((day) => day.date === transactionDate);

      if(dayData){
        if(transaction.type === 'income'){
          dayData.income += transaction.amount;
        } else if(transaction.type === 'expense'){
          dayData.expense += transaction.amount;
        }
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {   
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: day.expense, frontColor: colors.rose,
      },
    ]);
    
    return { success: true, data: { stats, transactions } };
  } catch (err) {
    console.log("error fetching weekly stats: ", err);
    return { success: false, msg: err.message };
  }
};

export const fetchMonthlyStats = async (uid) => {
  try {
    const db = firestore;
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 12);

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );
    
    const querySnapshot = await getDocs(transactionsQuery);
    const monthlyData = getLast12Months();
    const transactions = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data();
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date).toDate();
      const monthName = transactionDate.toLocaleString("default", { month: "short" });
      const shortYear = transactionDate.getFullYear().toString().slice(-2);
      const monthData = monthlyData.find(
        (month) => month.month === `${monthName} ${shortYear}`
      );

      if(monthData){
        if(transaction.type === 'income'){
          monthData.income += transaction.amount;
        } else if(transaction.type === 'expense'){
          monthData.expense += transaction.amount;
        }
      }
    });

    const stats = monthlyData.flatMap((month) => [
      {   
        value: month.income,
        label: month.month,
        spacing: scale(4),
        labelWidth: scale(46),
        frontColor: colors.primary,
      },
      {
        value: month.expense, frontColor: colors.rose,
      },
    ]);
    
    return { success: true, data: { stats, transactions } };
  } catch (err) {
    console.log("error fetching monthly stats: ", err);
    return { success: false, msg: err.message };
  }
};
