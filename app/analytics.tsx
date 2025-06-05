import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Analytics = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[{ paddingTop: insets.top }]}>
      <Text>Analytics</Text>
    </View>
  );
};
export default Analytics;
