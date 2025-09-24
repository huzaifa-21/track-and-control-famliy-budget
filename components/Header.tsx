import { HeaderProps } from "../types/types";
import { View, Text } from "react-native";

const Header = ({ title = "", leftIcon, style }: HeaderProps) => {
  return (
    <View className={`w-full items-center flex-row justify-center ${style}`}>
      {leftIcon && <View className="self-start">{leftIcon}</View>}
      {title && (
        <Text
          className={`text-2xl font-medium text-center   ${
            leftIcon ? "w-[80%] -start-5 -z-10" : "w-full"
          }`}
        >
          {title}
        </Text>
      )}
    </View>
  );
};
export default Header;
