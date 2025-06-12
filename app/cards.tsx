import { GlobalStyles } from "@/constants/styles";
import CardsScreen from "@/screens/CardsScreen";
import { StatusBar, View } from "react-native";

const Cards = () => {
  return (
    <View style={[GlobalStyles.screenContainer]}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
      />
      <CardsScreen />
    </View>
  );
};
export default Cards;
