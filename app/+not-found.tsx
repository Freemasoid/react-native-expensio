import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NotFound = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[{ paddingTop: insets.top }]}>
      <Text>NotFound</Text>
    </View>
  );
};
export default NotFound;
