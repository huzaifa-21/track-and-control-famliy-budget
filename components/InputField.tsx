import { icons } from "../constants/icons";
import { InputProps } from "../interfaces/interfaces";
import { Password } from "phosphor-react-native";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

const InputField = ({
  label,
  type,
  handleChangeText,
  placeholder,
  value,
  otherStyles,
  inputStyle,
  labelStyle,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={` ${otherStyles}`}>
      <Text className={`text-secondary font-pmedium ${labelStyle}`}>
        {label}
      </Text>
      <View
        className={`w-full  h-12 px-4 border border-gray-400 rounded-lg  flex-row mt-1 ${inputStyle} ${
          type == "password" && "items-center"
        } max-w-full text-wrap `}
      >
        <TextInput
          className="flex-1 "
          placeholder={placeholder}
          secureTextEntry={type == "password" && !showPassword}
          onChangeText={handleChangeText}
          value={value}
          placeholderTextColor="#7b7b8b"
          {...props}
        />
        {type == "password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              className="w-8 h-8"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default InputField;
