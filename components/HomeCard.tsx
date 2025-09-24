import * as Icons from "phosphor-react-native";
import { useAuth } from "../context/AuthContext";
import useFetchData from "../hooks/useFetchData";
import { TransactionType, WalletType } from "../types/types";
import { orderBy, Timestamp, where } from "firebase/firestore";
import { useExportCSV } from "@/hooks/useExportCSV";
import { Text, View, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { scheduleNotifications } from "../hooks/Notifications";

const HomeCard = () => {
  const { user } = useAuth();
  const { exportCSV } = useExportCSV();
  const { data: wallets, loading } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  useEffect(() => {
    scheduleNotifications();
  }, []);

  const { data: transactions, loading: transactionsLoading } =
    useFetchData<TransactionType>("transactions", [
      where("uid", "==", user?.uid),
      orderBy("date", "desc"),
    ]);

  const handleExsport = () => {
    // return transactions without the uid and the walletId
    const filteredTransactions = transactions.map((transaction) => {
      return {
        "Wallet Name": wallets.find(
          (wallet) => wallet.id === transaction.walletId
        )?.name,
        "Transaction Type": transaction.type,
        Category: transaction.category,
        Description: transaction.description,
        Date: (transaction.date as Timestamp).toDate().toDateString(),
        Amount: `$${transaction.amount}`,
      };
    });

    exportCSV(filteredTransactions, "transaction-data");
  };

  const getTotals = () => {
    return wallets.reduce(
      (total: any, wallet: WalletType) => {
        total.balance += wallet.amount;
        total.income += wallet.totalIncome;
        total.expenses += wallet.totalExpenses;
        return total;
      },
      { balance: 0, income: 0, expenses: 0 }
    );
  };

  return (
    <View className="bg-white p-6 rounded-2xl h-[180px] shadow-main">
      <View className="h-full justify-between">
        <View>
          <View className="flex-row justify-between items-center">
            <Text className="text-md font-medium">Total Balance</Text>
            <TouchableOpacity onPress={handleExsport}>
              <Icons.Export size={20} color="black" weight="bold" />
            </TouchableOpacity>
          </View>
          <Text className="text-3xl mt-1 font-bold">
            ${loading ? "----" : getTotals().balance.toFixed(2)}
          </Text>
        </View>
        {/* Toal expensess and income  */}
        <View className="flex-row justify-between">
          {/* income container  */}
          <View>
            <View className="flex-row gap-2 items-center">
              <View className="bg-gray-200 p-1 rounded-full">
                <Icons.ArrowDown size={15} weight="bold" />
              </View>
              <Text className="">Income</Text>
            </View>
            <Text className="text-md text-primary font-bold self-center mt-1">
              ${loading ? "----" : getTotals().income.toFixed(2)}
            </Text>
          </View>
          {/* expense container  */}
          <View>
            <View className="flex-row gap-2 items-center">
              <View className="bg-gray-200 p-1 rounded-full">
                <Icons.ArrowUp size={15} weight="bold" />
              </View>
              <Text>Expense</Text>
            </View>
            <Text className="text-md self-center mt-1 font-bold text-[#e11d48] ">
              ${loading ? "----" : getTotals().expenses.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeCard;
