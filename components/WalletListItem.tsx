import { WalletType } from "../types/types";
import { Image } from "expo-image";
import { Router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const WalletListItem = ({
  item,
  index,
  router,
}: {
  item: WalletType;
  index: number;
  router: Router;
}) => {
  const openWallet = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image,
      },
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 150)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity
        onPress={openWallet}
        className="flex-row items-center gap-3"
      >
        <View className="w-14 h-14 border border-gray-300 overflow-hidden rounded-lg">
          <Image
            style={{ flex: 1 }}
            contentFit="cover"
            transition={100}
            source={item?.image}
          />
        </View>
        <View className="flex-1">
          <Text className="font-medium">{item?.name}</Text>
          <Text className="font-bold text-gray-500">
            ${item?.amount?.toLocaleString()}
          </Text>
        </View>
        <Icons.CaretRight weight="bold" />
      </TouchableOpacity>
    </Animated.View>
  );
};
export default WalletListItem;
