
import { firestore } from "@/config/firebase";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";

export const createOrUpdateWallet = async (walletData) => {
  try {
    let walletToSave = { ...walletData };
    if (!walletData?.id) {
      // New Wallet
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true }); 
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error) {
    console.log("error creating or updating wallet: ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);

    deleteTransactionByWalletId(walletId);

    return { success: true, msg: "Wallet deleted successfully" };
  } catch (err) {
    console.log("error deleting wallet: ", err);
    return { success: false, msg: err.message };
  }
};

export const deleteTransactionByWalletId = async (walletId) => {
  try {
    let hasMoreTransactions = true;

    while (hasMoreTransactions) {
      const transactionsQuery = query(
        collection(firestore, "transactions"),
        where("walletId", "==", walletId)
      );

      const transactionsSnapshot = await getDocs(transactionsQuery);
      if (transactionsSnapshot.size === 0) {
        hasMoreTransactions = false;
        break;
      }

      const batch = writeBatch(firestore);

      transactionsSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
      });

      await batch.commit();
      console.log(`${transactionsSnapshot.size} transactions deleted in this batch.`);
    }
    return { success: true, msg: "Wallet deleted successfully" };
  } catch (err) {
    console.log("error deleting wallet: ", err);
    return { success: false, msg: err.message };
  }
};
