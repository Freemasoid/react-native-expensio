import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Cards = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[{ paddingTop: insets.top }]}>
      <Text>Cards</Text>
    </View>
  );
};
export default Cards;
