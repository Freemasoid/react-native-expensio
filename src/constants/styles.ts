import { StyleSheet } from "react-native";

export const GlobalColors = {
  gray: {
    100: "#181818",
    200: "#313131",
    300: "#494949",
    400: "#626262",
    500: "#7a7a7a",
    600: "#959595",
    700: "#afafaf",
    800: "#cacaca",
    900: "#e4e4e4",
  },
  battleship_gray: {
    100: "#191d1a",
    200: "#333935",
    300: "#4c564f",
    400: "#66736a",
    500: "#808f85",
    600: "#99a59d",
    700: "#b3bbb6",
    800: "#ccd2ce",
    900: "#e6e8e7",
  },
  celadon: {
    100: "#182c1b",
    200: "#305936",
    300: "#488551",
    400: "#65ac70",
    500: "#91c499",
    600: "#a7d0ae",
    700: "#bddcc2",
    800: "#d3e7d6",
    900: "#e9f3eb",
  },
  linen: {
    100: "#443219",
    200: "#886432",
    300: "#c09456",
    400: "#dabf9a",
    500: "#f2e9dc",
    600: "#f5eee4",
    700: "#f8f2eb",
    800: "#faf7f2",
    900: "#fdfbf8",
  },
  pear: {
    100: "#292a05",
    200: "#52540a",
    300: "#7b7d0f",
    400: "#a5a715",
    500: "#cfd11a",
    600: "#e4e73b",
    700: "#ebed6c",
    800: "#f1f39d",
    900: "#f8f9ce",
  },
};

export const GlobalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: GlobalColors.gray[100],
  },
});
