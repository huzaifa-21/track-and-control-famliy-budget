import CustomButton from "../../components/CustomButton";
import InputField from "../../components/InputField";
import { images } from "../../constants/images";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, Image, StatusBar, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login: loginUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      alert("Please fill all the fields");
      return;
    }
    setIsLoading(true);
    const response = await loginUser(formData.email, formData.password);
    setIsLoading(false);
    if (!response.success) {
      return Alert.alert("Login", response.msg);
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView className="px-8">
      <View className="w-full items-center justify-between h-[120px] mt-10">
        <Image source={images.logo} resizeMode="contain" className="w-1/2" />
        {/* <Animated.Text
          entering={FadeInUp.duration(1000).springify().damping(6).delay(200)}
          className="text-3xl text-secondary font-bold mb-10 -my-10"
        >
          Sign In
        </Animated.Text> */}
      </View>
      <Animated.View
        entering={FadeInUp.duration(1000).springify().damping(6).delay(400)}
        className="mt-10"
      >
        <InputField
          type="email"
          label="Email Address"
          placeholder="example@gmail.com"
          handleChangeText={(e) => setFormData({ ...formData, email: e })}
          value={formData.email}
          labelStyle="text-base"
        />
        <InputField
          type="password"
          label="Password"
          placeholder="Enter your password"
          handleChangeText={(e) => setFormData({ ...formData, password: e })}
          value={formData.password}
          otherStyles="mt-5"
        />
      </Animated.View>
      <Animated.View
        entering={FadeInUp.duration(1000).springify().damping(6).delay(600)}
      >
        <CustomButton
          title="Sign In"
          onPress={handleLogin}
          styles="mt-20 rounded-lg"
          isLoading={isLoading}
        />
        <Text className="text-center mt-5 text-base ">
          Don't have an account?{" "}
          <Pressable onPress={() => router.replace("/(auth)/sign-up")}>
            <Text className="text-primary font-bold -mb-1">Create account</Text>
          </Pressable>
        </Text>
      </Animated.View>
      <StatusBar />
    </SafeAreaView>
  );
};
export default SignIn;
