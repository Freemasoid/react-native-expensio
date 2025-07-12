import { getContrastTextColor } from "@/utils/colorUtils";
import { useMemo } from "react";

interface ContrastColors {
  textColor: string;
  secondaryTextColor: string;
  invertedColor: string;
}

export const useContrastColor = (backgroundColor: string): ContrastColors => {
  return useMemo(() => {
    const textColor = getContrastTextColor(backgroundColor);
    const secondaryTextColor =
      textColor === "#FFFFFF"
        ? "rgba(255, 255, 255, 0.8)"
        : "rgba(0, 0, 0, 0.6)";
    const invertedColor = textColor === "#FFFFFF" ? "#000000" : "#FFFFFF";

    return {
      textColor,
      secondaryTextColor,
      invertedColor,
    };
  }, [backgroundColor]);
};
