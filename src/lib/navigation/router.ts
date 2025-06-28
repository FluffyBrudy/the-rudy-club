export const ROOT_ROUTE = "/";
export const LOGIN_ROUTE = "/auth/login";
export const REGISTER_ROUTE = "/auth/register";
export const FEEDS_ROUTE = "/feeds";
export const CONNECTED_FRIENDS_ROUTE = "/friends";

export const USER_STORE = "user-store";

export const authProtectedRoutes = Object.freeze([
  FEEDS_ROUTE,
  CONNECTED_FRIENDS_ROUTE,
]);

export const preAuthRenderableRoutes = Object.freeze([
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  ROOT_ROUTE,
]);
