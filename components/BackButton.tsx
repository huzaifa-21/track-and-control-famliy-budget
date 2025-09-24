import { useRouter } from "expo-router";
import { ArrowLeft } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";

const BackButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="h-10 w-10 bg-primary items-center justify-center rounded-lg "
      onPress={() => router.back()}
      activeOpacity={0.7}
    >
      <ArrowLeft color="white" weight="bold" />
    </TouchableOpacity>
  );
};
export default BackButton;
