import BackButton from "../../components/BackButton";
import Header from "../../components/Header";
import { View, Text, Alert, Button } from "react-native";
import { ScrollView } from "react-native";
import InputField from "../../components/InputField";
import { useEffect, useState } from "react";
import { WalletType } from "../../types/types";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { Platform } from "react-native";
import ImageUpload from "../../components/ImageUpload";
import {
  createOrUpdateWallet,
  deleteWallet,
} from "../../services/walletServices";
import * as Icons from "phosphor-react-native";

const walletModal = () => {
  const { user, updateUserData } = useAuth();

  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    uid: "",
    amount: 0,
    totalExpenses: 0,
    totalIncome: 0,
    image: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const oldWallet: { name: string; image: string; id: string } =
    useLocalSearchParams();

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet.name,
        image: oldWallet.image,
      });
    }
  }, []);

  const onSubmit = async () => {
    let { name, image } = wallet;

    if (!name.trim()) {
      Alert.alert("Wallet", "Please fill the name");
      return;
    }
    if (!image) {
      Alert.alert("Wallet", "Please upload an image");
      return;
    }
    const data: WalletType = {
      name: name.trim(),
      image,
      uid: user?.uid,
    };

    if (oldWallet?.id) data.id = oldWallet.id;
    setIsLoading(true);
    const response = await createOrUpdateWallet(data);
    setIsLoading(false);
    if (response.success) {
      router.back();
    } else {
      Alert.alert("Wallet", response.msg);
    }
  };

  const onDelete = async () => {
    if (!oldWallet?.id) return;
    setIsLoading(true);
    const response = await deleteWallet(oldWallet.id);
    setIsLoading(false);
    if (response.success) {
      router.back();
    } else {
      Alert.alert("Wallet", response.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this wallet?", [
      {
        text: "Cancel",
        onPress: () => console.log("canceld"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDelete(),
        style: "destructive",
      },
    ]);
  };
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
      <Header
        title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
        leftIcon={<BackButton />}
      />
      {/* form  */}
      <ScrollView contentContainerClassName={"gap-5 mt-5 px-7"}>
        <InputField
          label="Wallet Name"
          placeholder="Salary"
          handleChangeText={(text) => setWallet({ ...wallet, name: text })}
          value={wallet.name}
          type="text"
          otherStyles="mt-10"
        />
        <View>
          <Text className="text-secondary">Wallet icon</Text>
          <ImageUpload
            file={wallet.image}
            onClear={() => setWallet({ ...wallet, image: null })}
            onSelect={(file) => setWallet({ ...wallet, image: file })}
            placeholder="Upload Image"
          />
        </View>
      </ScrollView>

      {/* save button */}
      <View className="flex-row px-4">
        {oldWallet?.id && !isLoading && (
          <CustomButton
            leftIcon={<Icons.Trash weight="bold" color="white" />}
            onPress={showDeleteAlert}
            styles="w-[50px] h-[50px]  rounded-xl bg-red"
          />
        )}
        <CustomButton
          title={oldWallet?.id ? "Update Wallet" : "Add Wallet"}
          onPress={onSubmit}
          styles={`h-[50px]  mx-5 mb-10 rounded-xl flex-1 rounded-lg ${
            Platform.OS === "android" && "mb-16"
          }`}
          textStyle="text-xl"
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default walletModal;
