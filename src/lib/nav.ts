import {
  CONNECTED_FRIENDS_ROUTE,
  FEEDS_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  ROOT_ROUTE,
} from "./router";

export type NavItemType = "link" | "button" | "component";

export type NavItem = {
  id: string;
  name: string;
  type: NavItemType;
  href?: string;
  icon?: string;
  postAuthVisibility: boolean;
  preAuthVisibility: boolean;
  desktopOnly?: boolean;
  mobileOnly?: boolean;
  action?: string;
  component?: string;
  order: number;
  section?: "main" | "actions" | "user";
};

export const navItems: Array<NavItem> = [
  {
    id: "home",
    name: "homepage",
    type: "link",
    href: ROOT_ROUTE,
    icon: "Home",
    postAuthVisibility: false,
    preAuthVisibility: true,
    order: 1,
    section: "main",
  },
  {
    id: "feeds",
    name: "feeds",
    type: "link",
    href: FEEDS_ROUTE,
    icon: "Home",
    postAuthVisibility: true,
    preAuthVisibility: false,
    order: 1,
    section: "main",
  },
  {
    id: "friends",
    name: "friends",
    type: "link",
    href: CONNECTED_FRIENDS_ROUTE,
    icon: "Users",
    postAuthVisibility: true,
    preAuthVisibility: false,
    order: 2,
    section: "main",
  },
  {
    id: "login",
    name: "login",
    type: "link",
    href: LOGIN_ROUTE,
    postAuthVisibility: false,
    preAuthVisibility: true,
    order: 3,
    section: "main",
  },
  {
    id: "register",
    name: "register",
    type: "link",
    href: REGISTER_ROUTE,
    postAuthVisibility: false,
    preAuthVisibility: true,
    order: 4,
    section: "main",
  },

  {
    id: "search",
    name: "search",
    type: "button",
    icon: "Search",
    postAuthVisibility: true,
    preAuthVisibility: true,
    action: "openSearch",
    order: 10,
    section: "actions",
  },
  {
    id: "notifications",
    name: "notifications",
    type: "component",
    component: "NotificationBell",
    postAuthVisibility: true,
    preAuthVisibility: false,
    order: 11,
    section: "actions",
  },
  {
    id: "profile",
    name: "profile",
    type: "button",
    icon: "User",
    postAuthVisibility: true,
    preAuthVisibility: false,
    action: "openProfile",
    order: 12,
    section: "actions",
  },
  {
    id: "theme",
    name: "theme",
    type: "component",
    component: "ThemeSwitcher",
    postAuthVisibility: true,
    preAuthVisibility: true,
    order: 13,
    section: "actions",
  },
  {
    id: "logout",
    name: "sign out",
    type: "button",
    icon: "LogOut",
    postAuthVisibility: true,
    preAuthVisibility: false,
    action: "logout",
    order: 14,
    section: "actions",
  },
];

export const navLinks = navItems.filter((item) => item.type === "link");
