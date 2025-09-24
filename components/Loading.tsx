import { View, ActivityIndicator, ActivityIndicatorProps } from "react-native";
const Loading = ({
  size = "large",
  color = "#299d91",
}: ActivityIndicatorProps) => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};
export default Loading;
