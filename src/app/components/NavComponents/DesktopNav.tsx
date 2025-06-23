"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/lib/nav";
import { getIcon } from "@/lib/navIcons";
import { useAppStore } from "@/app/store/appStore";
import { FEEDS_ROUTE, ROOT_ROUTE } from "@/lib/router";
import ThemeSwitcher from "@/app/components/ui/ThemeSwitcher";
import NotificationBell from "@/app/components/NotificationComponents/NotificationBell";
import type { NavActionHandler } from "@/lib/navActions";

interface DesktopNavProps {
  onSearchOpen: () => void;
}

export default function DesktopNav({ onSearchOpen }: DesktopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const actions: NavActionHandler = {
    openSearch: onSearchOpen,
    openProfile: () => {
      console.log("Profile clicked");
    },
    logout: handleLogout,
  };

  const getFilteredItems = (section: string) => {
    return navItems
      .filter(
        (item) =>
          item.section === section &&
          ((user && item.postAuthVisibility) ||
            (!user && item.preAuthVisibility))
      )
      .sort((a, b) => a.order - b.order);
  };

  const renderNavItem = (item: (typeof navItems)[0]) => {
    const IconComponent = item.icon ? getIcon(item.icon) : null;

    if (item.type === "link") {
      const isActive = pathname === item.href;
      const href = user && item.href === ROOT_ROUTE ? FEEDS_ROUTE : item.href!;

      return (
        <Link
          key={item.id}
          href={href}
          className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group flex items-center gap-2 ${
            isActive
              ? "text-lime-600 dark:text-lime-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {IconComponent && <IconComponent className="h-4 w-4" />}
          <span className="relative z-10 capitalize">{item.name}</span>
          {isActive && (
            <div className="absolute inset-0 bg-lime-100 dark:bg-lime-900/30 rounded-xl" />
          )}
          <div className="absolute inset-0 bg-accent/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </Link>
      );
    }

    if (item.type === "button" && item.action) {
      const actionHandler = actions[item.action as keyof NavActionHandler];
      const isLogout = item.action === "logout";

      return (
        <button
          key={item.id}
          onClick={actionHandler}
          className={`p-2 rounded-xl transition-all duration-200 ${
            isLogout
              ? "hover:bg-red-50 dark:hover:bg-red-900/20"
              : "hover:bg-accent/50"
          }`}
          aria-label={item.name}
        >
          {IconComponent && (
            <IconComponent
              className="h-5 w-5"
              style={{
                color: isLogout ? "rgb(220 38 38)" : "var(--muted-color)",
              }}
            />
          )}
        </button>
      );
    }

    if (item.type === "component") {
      if (item.component === "NotificationBell") {
        return <NotificationBell key={item.id} />;
      }
      if (item.component === "ThemeSwitcher") {
        return <ThemeSwitcher key={item.id} />;
      }
    }

    return null;
  };

  const mainItems = getFilteredItems("main");
  const actionItems = getFilteredItems("actions");

  return (
    <>
      <div className="hidden md:flex items-center space-x-1">
        {mainItems.map(renderNavItem)}
      </div>

      <div className="hidden md:flex items-center space-x-3">
        {actionItems.map(renderNavItem)}
      </div>
    </>
  );
}
