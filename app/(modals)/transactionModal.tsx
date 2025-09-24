import BackButton from "../../components/BackButton";
import Header from "../../components/Header";
import {
  View,
  Text,
  Alert,
  Pressable,
  TouchableOpacity,
  Button,
} from "react-native";
import { ScrollView } from "react-native";
import InputField from "../../components/InputField";
import { useEffect, useState } from "react";
import {
  ExpenseCategoriesType,
  TransactionType,
  WalletType,
} from "../../types/types";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { Platform } from "react-native";
import ImageUpload from "../../components/ImageUpload";
import { deleteWallet } from "../../services/walletServices";
import * as Icons from "phosphor-react-native";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";
import { expenseCategories, transactionTypes } from "../../constants/data";
import useFetchData from "../../hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/services/transactionServices";

const transactionModal = () => {
  const { user } = useAuth();
  const {
    data: wallets,
    loading: walletsLoading,
    error: walletsError,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  type ParamType = {
    name: string;
    image?: any;
    id: string;
    type: string;
    amount: string;
    description: string;
    category: string;
    date: string;
    walletId: string;
    uid: string;
  };

  const oldTransaction: ParamType = useLocalSearchParams();

  const onDateChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS === "ios" ? true : false);
  };

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction.amount),
        description: oldTransaction.description || "",
        category: oldTransaction.category || "",
        date: new Date(oldTransaction.date),
        walletId: oldTransaction.walletId,
        image: oldTransaction?.image,
      });
    }
  }, []);

  const onSubmit = async () => {
    let { type, amount, description, category, date, walletId, image } =
      transaction;
    if (!amount || (type === "expense" && !category) || !date || !walletId) {
      Alert.alert("Transaction", "Please fill all the required fields");
      return;
    }
    const transactionDate: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image: image || null,
      uid: user?.uid,
    };

    if (oldTransaction?.id) transactionDate.id = oldTransaction.id;

    setIsLoading(true);
    const response = await createOrUpdateTransaction(transactionDate);
    setIsLoading(false);
    if (response.success) {
      router.back();
    } else {
      Alert.alert("Transaction", response.msg);
    }
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setIsLoading(true);
    const response = await deleteTransaction(
      oldTransaction.id,
      oldTransaction.walletId
    );
    setIsLoading(false);
    if (response.success) {
      router.back();
    } else {
      Alert.alert("Transaction", response.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this transaction?",
      [
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
      ]
    );
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
        title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
        leftIcon={<BackButton />}
        style="mb-5"
      />
      {/* form  */}
      <ScrollView
        contentContainerClassName={"gap-5 mt-5 px-7"}
        showsVerticalScrollIndicator={false}
      >
        {/* expense type  */}
        <View>
          <Text className="text-secondary mb-2">Type</Text>
          <Dropdown
            style={styles.container}
            selectedTextStyle={styles.selectedTextStyle}
            placeholderStyle={styles.placeholderStyle}
            iconStyle={styles.iconStyle}
            data={transactionTypes}
            maxHeight={300}
            labelField="label"
            valueField="value"
            itemTextStyle={styles.itemTextStyle}
            containerStyle={styles.containerStyle}
            value={transaction.type}
            placeholder="Transaction Type"
            onChange={(item) => {
              setTransaction({ ...transaction, type: item.value });
            }}
          />
        </View>
        {/* wallet */}
        <View>
          <Text className="text-secondary mb-2">Wallet</Text>
          <Dropdown
            style={styles.container}
            selectedTextStyle={styles.selectedTextStyle}
            placeholderStyle={styles.placeholderStyle}
            iconStyle={styles.iconStyle}
            data={wallets.map((wallet) => ({
              label: `${wallet.name} ($${wallet.amount})`,
              value: wallet.id,
            }))}
            maxHeight={300}
            labelField="label"
            valueField="value"
            itemTextStyle={styles.itemTextStyle}
            containerStyle={styles.containerStyle}
            value={transaction.walletId}
            placeholder="choose a wallet"
            onChange={(item) => {
              setTransaction({ ...transaction, walletId: item.value });
            }}
          />
        </View>
        {/* category  */}
        {transaction.type == "expense" && (
          <View>
            <Text className="text-secondary mb-2">Expense Category</Text>
            <Dropdown
              style={styles.container}
              placeholderStyle={styles.placeholderStyle}
              iconStyle={styles.iconStyle}
              data={Object.values(expenseCategories).map((item) => ({
                label: item.label,
                value: item.value,
              }))}
              maxHeight={300}
              selectedTextStyle={styles.selectedTextStyle}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.itemTextStyle}
              containerStyle={styles.containerStyle}
              value={transaction.category}
              placeholder="select a category"
              onChange={(item) => {
                setTransaction({ ...transaction, category: item.value });
              }}
            />
          </View>
        )}

        {/* Date picker  */}
        <View className="">
          <Text className="text-secondary mb-2">Date</Text>
          {!showDatePicker && (
            <Pressable
              className="h-12 border rounded-lg justify-center items-start border-gray-400 px-4"
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{(transaction.date as Date).toLocaleDateString()}</Text>
            </Pressable>
          )}

          {showDatePicker && (
            <View
              className="mb-10"
              style={{
                ...Platform.select({
                  ios: {
                    margin: "auto",
                  },
                  android: {},
                }),
              }}
            >
              <DateTimePicker
                themeVariant="light"
                value={transaction.date as Date}
                textColor="black"
                mode="date"
                display={Platform.OS == "ios" ? "spinner" : "default"}
                //@ts-ignore
                onChange={onDateChange}
              />
              {Platform.OS == "ios" && (
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  className="absolute -bottom-8 rounded-lg right-0 p-3 bg-primary"
                >
                  <Text className="text-white font-bold">OK</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <InputField
          inputStyle="border-gray-400"
          label="Amount"
          value={transaction.amount.toString()}
          handleChangeText={(e) =>
            setTransaction({
              ...transaction,
              amount: Number(e.replace(/[^0-9]/g, "")),
            })
          }
          type="number"
          keyboardType="numeric"
        />

        <View>
          <View className="flex-row gap-2 items-center mb-2">
            <Text className="text-secondary ">Description</Text>
            <Text className="text-gray-400 text-sm">(optional)</Text>
          </View>

          <InputField
            multiline
            otherStyles="-mt-6 "
            inputStyle="border-gray-400 h-[100px] items-start p-3 "
            value={transaction.description}
            handleChangeText={(e) =>
              setTransaction({
                ...transaction,
                description: e,
              })
            }
            type="text"
            placeholder="This is the last payment for this month"
          />
        </View>

        <View className="mb-10">
          <View className="flex-row gap-2 items-center mb-2">
            <Text className="text-secondary ">Receipt</Text>
            <Text className="text-gray-400 text-sm">(optional)</Text>
          </View>
          <ImageUpload
            file={transaction.image}
            onClear={() => setTransaction({ ...transaction, image: null })}
            onSelect={(file) => setTransaction({ ...transaction, image: file })}
            placeholder="Upload Image"
          />
        </View>
      </ScrollView>
      <View className="flex-row px-4">
        {oldTransaction?.id && !isLoading && (
          <CustomButton
            leftIcon={<Icons.Trash weight="bold" color="white" />}
            onPress={showDeleteAlert}
            styles="w-[50px] h-[50px] rounded-xl bg-red"
          />
        )}

        {/* save button */}
        <CustomButton
          title={oldTransaction?.id ? "Update" : "Submit"}
          onPress={onSubmit}
          styles={`h-[50px] w-[100px] mx-3  mb-10 rounded-xl flex-1 rounded-lg  ${
            Platform.OS === "android" && "mb-12"
          }`}
          textStyle="text-xl"
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default transactionModal;

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 8,
    borderRadius: 8,
    borderCurve: "continuous",
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 13,
    color: "gray",
    paddingLeft: 8,
  },
  selectedTextStyle: {
    fontSize: 12,
    paddingLeft: 8,
    color: "black",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemTextStyle: {
    fontSize: 13,
    color: "black",
  },
  containerStyle: {
    marginTop: Platform.OS === "android" ? 0 : 72,
    height: "auto",
    borderWidth: 1,
    borderColor: "#999",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderCurve: "continuous",
    boxShadow: "0px 12px 15px rgba(0, 0, 0, 0.1)",
  },
});
