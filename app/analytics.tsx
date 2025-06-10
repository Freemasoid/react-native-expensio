import { GlobalStyles } from "@/constants/styles";
import AnalyticsScreen from "@/screens/AnalyticsScreen";
import { StatusBar, View } from "react-native";

const Analytics = () => {
  return (
    <View style={[GlobalStyles.screenContainer]}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
      />
      <AnalyticsScreen />
    </View>
  );
};
export default Analytics;
