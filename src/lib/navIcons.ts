import {
  Home,
  Users,
  Search,
  User,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Home,
  Users,
  Search,
  User,
  LogOut,
  Menu,
  X,
};

export const getIcon = (iconName: string): LucideIcon | null => {
  return iconMap[iconName] || null;
};
