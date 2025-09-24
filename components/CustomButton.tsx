import { CustomButtonsProps } from "../interfaces/interfaces";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
const CustomButton = ({
  title,
  onPress,
  isLoading,
  styles,
  textStyle,
  leftIcon,
}: CustomButtonsProps) => {
  if (isLoading)
    return (
      <ActivityIndicator
        className={`mt-10 ${styles}`}
        size={"large"}
        color={"#299d91"}
      ></ActivityIndicator>
    );

  return (
    <TouchableOpacity
      onPress={onPress}
      className={` bg-primary h-16 rounded-full flex-row items-center justify-center  ${
        isLoading ? "opacity-50" : ""
      } ${styles}`}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {leftIcon && leftIcon}
      {title && (
        <Text
          className={`text-white font-bold text-2xl text-center ${textStyle}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
export default CustomButton;
