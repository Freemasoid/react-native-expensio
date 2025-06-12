import { GlobalStyles } from "@/constants/styles";
import ProfileScreen from "@/screens/ProfileScreen";
import { StatusBar, View } from "react-native";

const Profile = () => {
  return (
    <View style={[GlobalStyles.screenContainer]}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
      />
      <ProfileScreen />
    </View>
  );
};
export default Profile;
