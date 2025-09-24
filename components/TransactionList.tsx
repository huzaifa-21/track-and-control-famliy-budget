import {
  TransactionItemProps,
  TransactionListType,
  TransactionType,
} from "../types/types";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Loading from "./Loading";
import { expenseCategories, incomeCategory } from "../constants/data";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Timestamp } from "firebase/firestore";
import { router } from "expo-router";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        description: item?.description,
        category: item?.category,
        date: (item?.date as Timestamp)?.toDate()?.toISOString(),
        image: item?.image,
        uid: item?.uid,
        walletId: item?.walletId,
      },
    });
  };

  return (
    <View className="mt-8 pb-10">
      {title && (
        <Text className="text-2xl font-medium text-header ">{title}</Text>
      )}
      <View className="mt-5">
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          estimatedItemSize={60}
        />
      </View>
      {!loading && data.length == 0 && (
        <Text className="text-center mt-32 text-xl">{emptyListMessage}</Text>
      )}

      {loading && (
        <View className="mt-32">
          <Loading />
        </View>
      )}
    </View>
  );
};

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  let category =
    item.type == "income"
      ? incomeCategory
      : expenseCategories[item.category as string];
  let IconComponent = category.icon;

  //@ts-ignore
  const date = (item?.date as Timestamp)
    ?.toDate()
    ?.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .damping(14)
        .springify()}
    >
      <TouchableOpacity
        onPress={() => handleClick(item)}
        activeOpacity={0.7}
        className="bg-white shadow-sm shadow-gray-300 gap-3  rounded-xl p-3 mb-3 items-center flex-row"
      >
        <View
          className="p-3 rounded-2xl"
          style={{ backgroundColor: category.bgColor }}
        >
          {IconComponent && (
            <IconComponent size={24} weight="fill" color="white" />
          )}
        </View>
        <View className="flex-1 ">
          <Text numberOfLines={1} className="font-semibold text-base">
            {category.label}
          </Text>
          {item.description && (
            <Text numberOfLines={1} className="text-sm  text-gray-500 -mt-1">
              {item.description}
            </Text>
          )}
        </View>
        <View className="items-center">
          <Text
            className="text-base font-semibold -mb-1"
            style={{ color: item.type === "income" ? "#299d91" : "#e11d48" }}
          >
            {item.type === "income" ? "+ $" : "- $"}
            {item.amount.toLocaleString()}
          </Text>
          <Text className="text-sm text-gray-500 self-end">{date}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionList;
