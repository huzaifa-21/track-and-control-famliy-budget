import BackButton from "../../components/BackButton";
import Header from "../../components/Header";
import { View } from "react-native";
import { ScrollView } from "react-native";
import InputField from "../../components/InputField";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Platform } from "react-native";
import { where, orderBy, limit } from "firebase/firestore";
import useFetchData from "../../hooks/useFetchData";
import { TransactionType } from "../../types/types";
import TransactionList from "../../components/TransactionList";

// this modal is only for testing github time
const searchModal = () => {
  const { user, updateUserData } = useAuth();

  const [search, setSearch] = useState("");

  const constraints = [where("uid", "==", user?.uid), orderBy("date", "desc")];

  const { data: allTransactions, loading: transactionsLoading } =
    useFetchData<TransactionType>("transactions", constraints);

  const filterdTransactions = allTransactions.filter(
    (transaction: TransactionType) => {
      if (search.length > 1) {
        if (
          transaction.category!.toLowerCase().includes(search.toLowerCase()) ||
          transaction.type!.toLowerCase().includes(search.toLowerCase()) ||
          transaction.description!.toLowerCase().includes(search.toLowerCase())
        ) {
          return true;
        }
        return false;
      }
      return true;
    }
  );

  return (
    <View
      className="py-5 flex-1"
      style={{
        ...Platform.select({
          android: {
            height: "80%",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            backgroundColor: "white",
            position: "relative",
            top: 40,
            boxShadow: "0px 2px 15px rgba(0, 0, 0, 0.1)",
          },
        }),
      }}
    >
      <Header title={"Search"} leftIcon={<BackButton />} />
      <ScrollView className="p-5 mt-5">
        <InputField
          placeholder="Clothes..."
          handleChangeText={(text) => setSearch(text)}
          value={search}
          type="text"
        />
        <View>
          <TransactionList
            loading={transactionsLoading}
            data={filterdTransactions}
            title="All Transactions"
            emptyListMessage="No Transactions Match Your Keywords"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default searchModal;
