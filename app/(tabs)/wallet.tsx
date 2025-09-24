import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Icons from "phosphor-react-native";
import { router } from "expo-router";
import useFetchData from "../../hooks/useFetchData";
import { WalletType } from "../../types/types";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import WalletListItem from "../../components/WalletListItem";

const Wallet = () => {
  const { user } = useAuth();
  const {
    data: wallets,
    loading,
    error,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotalBalance = () => {
    return wallets.reduce((acc, wallet) => acc + (wallet?.amount || 0), 0);
  };

  return (
    <SafeAreaView className="">
      {/* container  */}
      <View className="justify-between gap-20 mt-14">
        {/* balance view  */}
        <View>
          <View>
            <Text className="font-bold text-5xl text-center text-primary">
              ${getTotalBalance().toFixed(2)}
            </Text>
            <Text className="text-gray-600 text-center font-medium">
              Total Balance
            </Text>
          </View>
        </View>
        {/* wallets view  */}
        <View className="bg-white h-screen shadow-main rounded-tr-3xl rounded-tl-3xl p-5 ">
          <View className="flex flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-secondary">My Wallet</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <Icons.PlusCircle
                weight="fill"
                color="#299d91"
                style={{ padding: 18 }}
              />
            </TouchableOpacity>
          </View>
          {loading && <Loading />}
          <FlatList
            data={wallets}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem item={item} index={index} router={router} />
              );
            }}
            contentContainerStyle={{ gap: 10, marginTop: 20 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Wallet;
