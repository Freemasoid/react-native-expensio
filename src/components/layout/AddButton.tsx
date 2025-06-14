import { useTheme } from "@/hooks/useTheme";
import { Plus } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

interface AddButtonProps {
  onPress?: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles(colors).button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Plus
        size={32}
        strokeWidth={3}
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
      left: "55%",
      transform: [{ translateX: -40 }],
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
  });
