import { ResponseType, WalletType } from "../types/types";
import { uploadeFileToCloudinary } from "./imageServices";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { fireStore } from "../config/firebase";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };
    if (walletData.image) {
      const imageUploadRes = await uploadeFileToCloudinary(
        walletData?.image,
        "wallets"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload the Wallet icon",
        };
      }
      walletToSave.image = imageUploadRes.data;
    }

    if (!walletToSave?.id) {
      // new wallet
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletToSave?.id
      ? doc(fireStore, "wallets", walletToSave?.id)
      : doc(collection(fireStore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true }); // only update the data provided
    //@ts-ignore
    return { success: true, data: { ...walletToSave }, id: walletRef.id };
  } catch (error: any) {
    console.log(error);
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(fireStore, "wallets", walletId);
    await deleteDoc(walletRef);

    deleteTransactionByWalletId(walletId);

    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export const deleteTransactionByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransaction = true;

    while (hasMoreTransaction) {
      const transactionQuery = query(
        collection(fireStore, "transactions"),
        where("walletId", "==", walletId)
      );

      const transactionSnapshot = await getDocs(transactionQuery);

      if (transactionSnapshot.size === 0) {
        hasMoreTransaction = false;
        break;
      }

      const batch = writeBatch(fireStore);
      transactionSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
      });

      await batch.commit();
      console.log(`Deleted ${transactionSnapshot.size} transactions`);
    }

    return { success: true, msg: "All transaction deleted successfully" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
