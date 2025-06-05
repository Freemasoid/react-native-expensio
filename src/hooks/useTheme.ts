import { GlobalColors } from "@/constants/styles";
import { useAppSelector } from "@/store/hooks";

export const useTheme = () => {
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  const colors = GlobalColors[currentTheme];

  return { colors };
};
