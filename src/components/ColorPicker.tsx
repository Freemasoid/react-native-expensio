import { BANK_COLOR_OPTIONS } from "@/constants/bank-colors";
import { GlobalColors } from "@/constants/styles";
import { useTheme } from "@/hooks/useTheme";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
}) => {
  const { colors } = useTheme();

  const renderItem = (item: any) => {
    return (
      <View style={styles(colors).dropdownItem}>
        <Text
          style={[
            styles(colors).dropdownColorItem,
            { backgroundColor: item.value },
          ]}
        ></Text>
        <Text style={styles(colors).dropdownSelectedText}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View>
      <View style={styles(colors).colorContainer}>
        {BANK_COLOR_OPTIONS.slice(21, 28).map((color) => (
          <TouchableOpacity
            key={color.value}
            style={[
              styles(colors).colorItem,
              { backgroundColor: color.value },
              selectedColor === color.value && styles(colors).selectedColorItem,
            ]}
            onPress={() => onColorSelect(color.value)}
            activeOpacity={0.8}
          >
            {selectedColor === color.value && (
              <View style={styles(colors).selectedIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles(colors).dropdownWrapper}>
        <Dropdown
          style={styles(colors).dropdown}
          containerStyle={styles(colors).dropdownContainer}
          data={BANK_COLOR_OPTIONS}
          search
          searchPlaceholder="Search..."
          maxHeight={300}
          dropdownPosition="top"
          labelField="label"
          valueField="value"
          selectedTextStyle={styles(colors).dropdownSelectedText}
          itemTextStyle={{ textTransform: "capitalize", fontSize: 18 }}
          inputSearchStyle={{ borderRadius: 6, fontSize: 18 }}
          placeholderStyle={{ fontSize: 18 }}
          value={selectedColor}
          onChange={(item) => {
            onColorSelect(item.value);
          }}
          renderLeftIcon={() =>
            selectedColor ? (
              <Text
                style={[
                  styles(colors).dropdownColorItem,
                  { backgroundColor: selectedColor },
                ]}
              ></Text>
            ) : null
          }
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    colorContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    colorItem: {
      width: 40,
      height: 40,
      borderRadius: 9999,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    selectedColorItem: {
      borderColor: GlobalColors.gray[400],
    },
    selectedIndicator: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: "white",
      borderWidth: 2,
      borderColor: "rgba(0,0,0,0.2)",
    },
    dropdownWrapper: {
      marginTop: 8,
    },
    dropdown: {
      borderRadius: 12,
      borderWidth: 2,
      borderColor: GlobalColors.gray[200],
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 18,
      color: GlobalColors.gray[900],
      height: 50,
      backgroundColor: "white",
      alignItems: "center",
      ...(Platform.OS === "ios" && {
        shadowColor: GlobalColors.gray[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      }),
      elevation: Platform.OS === "android" ? 2 : 0,
    },
    dropdownContainer: {
      borderRadius: 12,
      borderColor: GlobalColors.gray[200],
      borderWidth: 1,
      top: 65,
      ...(Platform.OS === "ios" && {
        shadowColor: GlobalColors.gray[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }),
      elevation: Platform.OS === "android" ? 3 : 0,
      fontSize: 18,
    },
    dropdownSelectedText: {
      flex: 1,
      fontSize: 18,
      fontWeight: "400",
      color: GlobalColors.gray[900],
      padding: 0,
      textTransform: "capitalize",
      marginLeft: 16,
    },
    dropdownColorItem: {
      height: 30,
      width: 30,
      borderRadius: 9999,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    dropdownItem: {
      flexDirection: "row",
      marginHorizontal: 8,
      marginVertical: 6,
      alignItems: "center",
    },
  });

export default ColorPicker;
