import { LOGIN_ROUTE, REGISTER_ROUTE, ROOT_ROUTE } from "./constants";

export const navLinks = [
  {
    name: "home",
    href: ROOT_ROUTE,
    postAuthVisibility: true,
    preAuthVisibility: false,
  },
  {
    name: "login",
    href: LOGIN_ROUTE,
    postAuthVisibility: false,
    preAuthVisibility: true,
  },
  {
    name: "register",
    href: REGISTER_ROUTE,
    postAuthVisibility: false,
    preAuthVisibility: true,
  },
];
