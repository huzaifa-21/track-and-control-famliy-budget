import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Pressable, StatusBar, Text, View } from "react-native";
import { images } from "../../constants/images";
import CustomButton from "../../components/CustomButton";

const Welcome = () => {
  return (
    <SafeAreaView className="flex-1 px-5">
      <View className="flex-1 gap-28">
        <Pressable
          onPress={() => router.replace("/(auth)/sign-in")}
          className=""
        >
          <Text className="text-primary text-xl self-end font-semibold">
            {" "}
            Sign in
          </Text>
        </Pressable>
        <Animated.Image
          entering={FadeInUp.duration(1000)}
          source={images.welcome}
          className="w-full mx-auto"
        />
      </View>
      <View>
        <Animated.Text
          entering={FadeInUp.duration(1000).springify().damping(6).delay(200)}
          className="text-gray-700 text-5xl text-center font-bold"
        >
          Always take control of your finance
        </Animated.Text>
        <Animated.Text
          entering={FadeInUp.duration(1000).springify().damping(6).delay(400)}
          className="text-gray-400 text-xl text-center px-4 mt-6"
        >
          Finance must be arranged to set a better lifestyle in future
        </Animated.Text>
        <Animated.View
          entering={FadeInUp.duration(1000).springify().delay(600).damping(6)}
        >
          <CustomButton
            title="Get Started"
            onPress={() => router.replace("/(auth)/sign-up")}
            styles="mt-8 mb-16"
          />
        </Animated.View>
      </View>
      <StatusBar backgroundColor={"#191919"} />
    </SafeAreaView>
  );
};

export default Welcome;
