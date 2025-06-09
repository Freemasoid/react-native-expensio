import {
  BanknoteArrowUp,
  BusFront,
  Coffee,
  Film,
  Gamepad2,
  Heart,
  Home,
  Plane,
  ShoppingCart,
  Sparkles,
  Utensils,
} from "lucide-react-native";

export const iconMap = {
  food: Utensils,
  transport: BusFront,
  shopping: ShoppingCart,
  entertainment: Film,
  income: BanknoteArrowUp,
  home: Home,
  coffee: Coffee,
  gaming: Gamepad2,
  travel: Plane,
  health: Heart,
  default: Sparkles,
};

export type IconName = keyof typeof iconMap;
