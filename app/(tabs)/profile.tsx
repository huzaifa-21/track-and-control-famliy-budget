import { useAuth } from "../../context/AuthContext";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { getProfileImage } from "../../services/imageServices";
import { accountOptionType } from "../../types/types";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { signOut } from "firebase/auth";
import { router } from "expo-router";
import { auth } from "../../config/firebase";

const Profile = () => {
  const { user } = useAuth();

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <Icons.User size={26} color="white" weight="fill" />,
      bgColor: "#000",
      routeName: "/(modals)/profileModal",
    },
    {
      title: "Logout",
      icon: <Icons.Power size={26} color="white" weight="fill" />,
      bgColor: "#e84118",
    },
  ];

  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel logout"),
      },
      {
        text: "Logout",
        onPress: async () => {
          await signOut(auth);
        },
        style: "destructive",
      },
    ]);
  };

  const handleOption = (option: accountOptionType) => {
    if (option.title === "Logout") {
      showLogoutAlert();
    }

    if (option.routeName) router.push(option.routeName);
  };

  return (
    <SafeAreaView className="px-5">
      <View>
        {/* add user info here */}
        <View className="mt-8 gap-3 items-center">
          {/* avatar */}
          <View>
            <Image
              source={getProfileImage(user?.image)}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "white",
              }}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* name and email */}
          <View className="gap-0.5 items-center">
            <Text className="text-2xl font-semibold">{user?.name}</Text>
            <Text className="text-sm text-gray-500 -mt-1">{user?.email}</Text>
          </View>
        </View>
        {/* account options */}
        <View className="mt-10">
          {accountOptions.map((option, index) => (
            <Animated.View
              entering={FadeInDown.delay(index * 50)
                .springify()
                .damping(14)}
              key={index}
              className="mb-5"
            >
              <TouchableOpacity
                className="flex-row items-center gap-3 "
                onPress={() => handleOption(option)}
              >
                <View
                  className={`p-3 rounded-2xl `}
                  style={{ backgroundColor: option.bgColor }}
                >
                  {option.icon}
                </View>
                <Text className="text-black text-lg flex-1 font-semibold">
                  {option.title}
                </Text>
                <Icons.CaretRight size={20} color="black" weight="bold" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Profile;
