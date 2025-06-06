import { GlobalStyles } from "@/constants/styles";
import HomeScreen from "@/screens/HomeScreen";
import { StatusBar, View } from "react-native";

export default function Index() {
  return (
    <View style={[GlobalStyles.screenContainer]}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
      />
      <HomeScreen />
    </View>
  );
}
