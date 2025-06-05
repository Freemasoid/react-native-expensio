import { useTheme } from "@/hooks/useTheme";
import { Plus } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

export const AddButton = () => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={styles(colors).button}>
      <Plus
        size={24}
        color="white"
      />
    </TouchableOpacity>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    button: {
      backgroundColor: colors.primary[500],
      position: "absolute",
      top: -20,
      left: "50%",
      transform: [{ translateX: -40 }],
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: "center",
      alignItems: "center",
    },
  });
