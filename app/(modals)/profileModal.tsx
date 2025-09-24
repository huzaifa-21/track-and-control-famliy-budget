import BackButton from "../../components/BackButton";
import Header from "../../components/Header";
import { getProfileImage } from "../../services/imageServices";
import { Image } from "expo-image";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import { ScrollView } from "react-native";
import * as Icons from "phosphor-react-native";
import InputField from "../../components/InputField";
import { useEffect, useState } from "react";
import { UserDataType } from "../../types/types";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../context/AuthContext";
import { updateUser } from "../../services/userServices";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

const profileModal = () => {
  const { user, updateUserData } = useAuth();

  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setUserData({ ...userData, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    let { name, image } = userData;
    if (!name.trim()) {
      Alert.alert("User", "Please fill the name");
      return;
    }

    setIsLoading(true);
    const response = await updateUser(user?.uid as string, userData);
    setIsLoading(false);
    if (response.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("User", response.msg);
    }
  };

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        image: user.image || null,
      });
    }
  }, [user]);

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
      <Header title="Update Profile" leftIcon={<BackButton />} />
      {/* form  */}
      <ScrollView contentContainerClassName={"gap-5 mt-5 px-7"}>
        <View className="relative self-center">
          <Image
            source={getProfileImage(userData?.image)}
            contentFit="cover"
            transition={100}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "gray",
              alignSelf: "center",
            }}
          />
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.7}
            className="absolute bottom-0 right-1 bg-white p-2 rounded-full"
          >
            <Icons.Pencil size={20} color="black" />
          </TouchableOpacity>
        </View>
        <InputField
          label="Name"
          placeholder="Huzaifa Ali"
          handleChangeText={(text) => setUserData({ ...userData, name: text })}
          value={userData.name}
          type="text"
          otherStyles="mt-10"
        />
      </ScrollView>
      {/* save button */}
      <CustomButton
        title="Update"
        onPress={onSubmit}
        styles={`h-[50px]  mx-5 mb-10 rounded-xl ${
          Platform.OS === "android" && "mb-16"
        }`}
        textStyle="text-xl"
        isLoading={isLoading}
      />
    </View>
  );
};

export default profileModal;
