import { ImageUploadProps } from "../types/types";
import { View, Text, TouchableOpacity } from "react-native";
import * as Icons from "phosphor-react-native";
import { Image } from "expo-image";
import { getFilePath } from "../services/imageServices";
import * as ImagePicker from "expo-image-picker";

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  placeholder = "",
  containerStyle,
  imageStyle,
}: ImageUploadProps) => {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      onSelect(result.assets[0]);
    }
  };

  return (
    <View>
      {!file && (
        <TouchableOpacity
          className="flex-row gap-3 p-3 items-center justify-center bg-gray-200 rounded-lg mt-2"
          onPress={pickImage}
        >
          <Icons.UploadSimple />
          {placeholder && <Text className="text-secondary">{placeholder}</Text>}
        </TouchableOpacity>
      )}
      {file && (
        <View
          className={` w-[150px] h-[150px] relative rounded-lg overflow-hidden mt-2 ${imageStyle} `}
        >
          <Image
            style={{ flex: 1 }}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
          />
          <TouchableOpacity
            className="items-center w-10 h-10 justify-center absolute top-1 right-0   shadow-lg z-10"
            onPress={onClear}
          >
            <Icons.XCircle size={24} weight="fill" color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default ImageUpload;
