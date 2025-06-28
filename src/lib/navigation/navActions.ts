export type NavActionHandler = {
  openSearch: () => void;
  openProfile: () => void;
  logout: () => void;
};

export const createNavActions = (
  onSearchOpen: () => void,
  onProfileOpen: () => void,
  onLogout: () => void
): NavActionHandler => ({
  openSearch: onSearchOpen,
  openProfile: onProfileOpen,
  logout: onLogout,
});
