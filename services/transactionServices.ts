import { fireStore } from "../config/firebase";
import { TransactionType, WalletType } from "../types/types";
import { ResponseType } from "../types/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadeFileToCloudinary } from "./imageServices";
import { createOrUpdateWallet } from "./walletServices";
import { getLast12Months, getLast7Days, getYearsRange } from "../utils/common";

export const createOrUpdateTransaction = async (
  transaction: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, amount, image, type, walletId } = transaction;

    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid Transaction data!" };
    }

    if (id) {
      const oldTransactionSnapshot = await getDoc(
        doc(fireStore, "transactions", id)
      );
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOriginal =
        oldTransaction.walletId != walletId ||
        oldTransaction.type != type ||
        oldTransaction.amount != amount;

      if (shouldRevertOriginal) {
        let response = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!response.success) {
          console.log(response.msg);
          return response;
        }
      }
    } else {
      // upate wallet for new transaction
      let response = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type!
      );
      if (!response.success) return response;
    }

    if (image) {
      const imageUploadRes = await uploadeFileToCloudinary(
        image,
        "transactions"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload receipt",
        };
      }
      transaction.image = imageUploadRes.data;
    }

    const transactionRef = id
      ? doc(fireStore, "transactions", id)
      : doc(collection(fireStore, "transactions"));

    await setDoc(transactionRef, transaction, { merge: true });

    return { success: true, data: { ...transaction, id: transactionRef.id } };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(fireStore, "wallets", walletId);
    const walletSnapShot = await getDoc(walletRef);
    if (!walletSnapShot.exists()) {
      console.log("Wallet not found");
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapShot.data() as WalletType;

    if (type == "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "selected wallet doesn't have enough balance",
      };
    }

    const updateType = type == "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type == "income"
        ? Number(walletData.amount!) + amount
        : Number(walletData.amount!) - amount;
    const updatedTotals =
      type === "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
    });

    return { success: true, msg: "Wallet updated successfully" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    const originalWalletSnapshot = await getDoc(
      doc(fireStore, "wallets", oldTransaction.walletId)
    );

    const originalWallet = originalWalletSnapshot.data() as WalletType;

    let newWalletSnapshot = await getDoc(
      doc(fireStore, "wallets", newWalletId)
    );
    let newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type == "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense;

    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType == "expense") {
      // if user tries to convert income to expense on the same wallet
      // or if the user tries to increase the expense amount and don't have enough balance
      if (
        oldTransaction.walletId == newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "selected wallet doesn't have enough balance",
        };
      }

      // if the user tries to add expense from a new wallet but the wallet don't have enough balance
      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: "selected wallet doesn't have enough balance",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    // ==============================================================================

    // refetch the new wallet because we may have just updated it
    newWalletSnapshot = await getDoc(doc(fireStore, "wallets", newWalletId));
    newWallet = newWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType == "income" ? "totalIncome" : "totalExpenses";

    const updatedTransactionAmount: number =
      newTransactionType == "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

    const newIncomeExpensesAmount = Number(
      newWallet[updateType]! + Number(newTransactionAmount)
    );

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpensesAmount,
    });

    return { success: true, msg: "Wallet updated successfully" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
): Promise<ResponseType> => {
  try {
    const transactionRef = doc(fireStore, "transactions", transactionId);

    const transactoinSnapshot = await getDoc(transactionRef);

    if (!transactoinSnapshot.exists()) {
      return { success: false, msg: "Transaction not found" };
    }

    const transactionData = transactoinSnapshot.data() as TransactionType;
    const transactionType = transactionData.type;
    const transactionAmount = transactionData.amount;

    // get wallet data to update amount, totalIncome or totalExpenses
    const walletSnapshot = await getDoc(doc(fireStore, "wallets", walletId));
    const walletData = walletSnapshot.data() as WalletType;

    // check fields to be updated based on transaction type
    const updateType =
      transactionType == "income" ? "totalIncome" : "totalExpenses";
    const newWalletAmount =
      walletData?.amount! -
      (transactionType == "income" ? transactionAmount : -transactionAmount);

    const newIncomeExpensesAmount = walletData[updateType]! - transactionAmount;

    if (transactionType === "expense" && newWalletAmount < 0) {
      return {
        success: false,
        msg: "You can't delete this transaction",
      };
    }

    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpensesAmount,
    });

    await deleteDoc(transactionRef);

    return { success: true, msg: "Transaction deleted successfully" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export const fetchWeeklyData = async (uid: string): Promise<ResponseType> => {
  try {
    const db = fireStore;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionQuery = query(
      collection(db, "transactions"),
      where("uid", "==", uid),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc")
    );

    const transactionSnapshot = await getDocs(transactionQuery);
    const weeklyData = getLast7Days();
    const transactions: TransactionType[] = [];

    transactionSnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];

      const dayDate = weeklyData.find((day) => day.date === transactionDate);

      if (dayDate) {
        if (transaction.type === "income") {
          dayDate.income += transaction.amount;
        } else if (transaction.type === "expense") {
          dayDate.expense += transaction.amount;
        }
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        label: day.day,
        spacing: 10,
        labelWidth: 30,
        frontColor: "#299d91",
      },
      {
        value: day.expense,
        frontColor: "#e11d48",
      },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export const fetchMonthlyData = async (uid: string): Promise<ResponseType> => {
  try {
    const db = fireStore;
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 12);

    // Define query to fetch transactions for the last 12 months
    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const monthlyData = getLast12Months();
    const transactions: TransactionType[] = [];

    // Process transactions to calculate income and expenses for each month
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp).toDate();
      const monthName = transactionDate.toLocaleString("default", {
        month: "short",
      });
      const shortYear = transactionDate.getFullYear().toString().slice(-2);
      const monthData = monthlyData.find(
        (month: any) => month.month === `${monthName} ${shortYear}`
      );

      if (monthData) {
        if (transaction.type === "income") {
          monthData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          monthData.expense += transaction.amount;
        }
      }
    });

    const stats = monthlyData.flatMap((month: any) => [
      {
        value: month.income,
        label: month.month,
        spacing: 10,
        labelWidth: 50,
        frontColor: "#299d91",
      },
      {
        value: month.expense,
        frontColor: "#e11d48",
      },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export const fetchYearlyData = async (uid: string): Promise<ResponseType> => {
  try {
    const db = fireStore;

    const transactionQuery = query(
      collection(db, "transactions"),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const transactions: TransactionType[] = [];

    const firstTransaction = querySnapshot.docs.reduce((earliest, doc) => {
      const transactionDate = doc.data().date.toDate();
      return transactionDate < earliest ? transactionDate : earliest;
    }, new Date());

    const firstYear = firstTransaction.getFullYear();
    const currentYear = new Date().getFullYear();

    const yearlyData = getYearsRange(firstYear, currentYear);

    // Process transactions to calculate income and expenses for each month
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionYear = (transaction.date as Timestamp)
        .toDate()
        .getFullYear();

      const yearData = yearlyData.find(
        (item: any) => item.year === transactionYear.toString()
      );

      if (yearData) {
        if (transaction.type === "income") {
          yearData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          yearData.expense += transaction.amount;
        }
      }
    });

    const stats = yearlyData.flatMap((year: any) => [
      {
        value: year.income,
        label: year.year,
        spacing: 10,
        labelWidth: 50,
        frontColor: "#299d91",
      },
      {
        value: year.expense,
        frontColor: "#e11d48",
      },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
