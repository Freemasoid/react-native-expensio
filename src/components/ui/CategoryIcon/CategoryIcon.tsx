import React from "react";

import { iconMap, type IconName } from "./icon-map";

interface CategoryIconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  size = 24,
  color = "#FFFFFF",
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    const FallbackIcon = iconMap.default;

    return (
      <FallbackIcon
        size={size}
        color={color}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
    />
  );
};

export default CategoryIcon;
