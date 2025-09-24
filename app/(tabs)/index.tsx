import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import * as Icons from "phosphor-react-native";
import HomeCard from "../../components/HomeCard";
import TransactionList from "../../components/TransactionList";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { TransactionType, WalletType } from "../../types/types";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "../../hooks/useFetchData";

const Home = () => {
  const { user } = useAuth();

  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ];

  const { data: transactions, loading: transactionsLoading } =
    useFetchData<TransactionType>("transactions", constraints);

  return (
    <SafeAreaView className="p-5 h-[95vh]">
      <View className="mb-5 flex-row justify-between items-center">
        <View>
          <Text className="text-header -mb-1">Hello</Text>
          <Text className="text-xl font-medium">{user?.name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(modals)/searchModal")}
          className="p-3 rounded-full bg-white shadow-main"
        >
          <Icons.MagnifyingGlass size={18} color="gray" weight="bold" />
        </TouchableOpacity>
      </View>
      <ScrollView className="h-full" showsVerticalScrollIndicator={false}>
        <View>
          <HomeCard />
        </View>
        <TransactionList
          data={transactions}
          title="Recent Transactions"
          emptyListMessage="No Transaction Added "
          loading={transactionsLoading}
        />
      </ScrollView>
      <CustomButton
        leftIcon={<Icons.Plus size={30} color="white" weight="bold" />}
        styles={`absolute bottom-20 right-6  rounded-full w-[44px] h-[44px] ${
          Platform.OS === "android" && "bottom-12"
        }`}
        textStyle="d-none"
        onPress={() => router.push("/(modals)/transactionModal")}
      />
    </SafeAreaView>
  );
};

export default Home;
