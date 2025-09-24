import CustomButton from "../../components/CustomButton";
import InputField from "../../components/InputField";
import { images } from "../../constants/images";
import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { register: registerUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all the fields");
      return;
    }
    setIsLoading(true);

    const response = await registerUser(
      formData.email,
      formData.password,
      formData.name
    );
    setIsLoading(false);
    router.replace("/(tabs)");
    if (!response.success) {
      Alert.alert("Sign up", response.msg);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView className="px-8">
        <View className="w-full items-center  justify-between h-[120px] mt-10">
          <Image source={images.logo} resizeMode="contain" className="w-1/2 " />
          <Animated.Text
            entering={FadeInUp.duration(1000).springify().damping(6).delay(200)}
            className="text-3xl text-secondary font-bold mb-10 -my-10"
          >
            Create account
          </Animated.Text>
        </View>
        <Animated.View
          entering={FadeInUp.duration(1000).springify().damping(6).delay(400)}
          className="mt-10"
        >
          <InputField
            type="name"
            label="Name"
            placeholder="Huzaifa Ali"
            handleChangeText={(e) => setFormData({ ...formData, name: e })}
            value={formData.name}
            otherStyles=""
          />
          <InputField
            type="email"
            label="Email Address"
            placeholder="example@gmail.com"
            handleChangeText={(e) => setFormData({ ...formData, email: e })}
            value={formData.email}
            otherStyles="mt-5"
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
            title="Sign Up"
            onPress={handleSignUp}
            styles="mt-20 rounded-lg h-16"
            isLoading={isLoading}
          />
          <Text className="text-center mt-5 text-base">
            Already have an account?{" "}
            <TouchableWithoutFeedback
              onPress={() => router.replace("/(auth)/sign-in")}
            >
              <Text className="font-bold text-primary text-lg">Login</Text>
            </TouchableWithoutFeedback>
          </Text>
        </Animated.View>
      </SafeAreaView>
    </ScrollView>
  );
};
export default SignUp;
