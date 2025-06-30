"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { navItems } from "@/lib/navigation/nav";
import { getIcon } from "@/lib/navigation/navIcons";
import { useAppStore } from "@/app/store/appStore";
import { FEEDS_ROUTE, ROOT_ROUTE } from "@/lib/navigation/router";
import ThemeSwitcher from "@/app/components/ui/ThemeSwitcher";
import NotificationBell from "@/app/components/NotificationComponents/NotificationBell";
import type { NavActionHandler } from "@/lib/navigation/navActions";

interface MobileNavProps {
  actions: NavActionHandler;
}

export default function MobileNav({ actions }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

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
      if (user && item.href === ROOT_ROUTE) return null;
      return (
        <Link
          key={item.id}
          href={href}
          onClick={closeMenu}
          className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
            isActive ? "text-white" : "hover:bg-accent/50"
          }`}
          style={{
            backgroundColor: isActive ? "var(--primary-color)" : "transparent",
            color: isActive ? "white" : "var(--text-color)",
          }}
        >
          {IconComponent && <IconComponent className="h-5 w-5 mr-3" />}
          <span className="capitalize">{item.name}</span>
          {isActive && (
            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
          )}
        </Link>
      );
    }

    if (item.type === "button" && item.action) {
      const actionHandler = () => {
        actions[item.action as keyof NavActionHandler]();
        closeMenu();
      };
      const isLogout = item.action === "logout";
      return (
        <button
          key={item.id}
          onClick={actionHandler}
          className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors duration-200 ${
            isLogout
              ? "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              : "hover:bg-accent/50"
          }`}
        >
          {IconComponent && (
            <IconComponent
              className="h-5 w-5 mr-3"
              style={{ color: isLogout ? "inherit" : "var(--muted-color)" }}
            />
          )}
          <span
            className="text-sm font-medium capitalize"
            style={{ color: isLogout ? "inherit" : "var(--text-color)" }}
          >
            {item.name}
          </span>
          {item.action === "openSearch" && (
            <span
              className="ml-auto text-xs"
              style={{ color: "var(--muted-color)" }}
            >
              ⌘K
            </span>
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

  const MenuIcon = getIcon("Menu");
  const XIcon = getIcon("X");
  const topBarActions = getFilteredItems("actions").filter(
    (item) =>
      item.component === "NotificationBell" ||
      item.component === "ThemeSwitcher"
  );
  const mainItems = getFilteredItems("main");
  const actionItems = getFilteredItems("actions").filter(
    (item) => item.type === "button" || item.type === "link"
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
        />
      )}
      <div className="flex items-center space-x-2 md:hidden">
        {topBarActions.map(renderNavItem)}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-xl hover:bg-accent/50 transition-all duration-200 active:scale-95"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen
            ? XIcon && (
                <XIcon
                  className="h-6 w-6"
                  style={{ color: "var(--text-color)" }}
                />
              )
            : MenuIcon && (
                <MenuIcon
                  className="h-6 w-6"
                  style={{ color: "var(--text-color)" }}
                />
              )}
        </button>
      </div>
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-background/95 backdrop-blur-xl border-l shadow-2xl transform transition-transform duration-300 ease-out z-50 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col h-full">
          {user && (
            <div
              className="p-4 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture || "/placeholder.svg"}
                      alt={user.username}
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: "var(--primary-color)" }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-base truncate"
                    style={{ color: "var(--text-color)" }}
                  >
                    {user.username}
                  </h3>
                  <p
                    className="text-sm truncate"
                    style={{ color: "var(--muted-color)" }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-4">
              {mainItems.map(renderNavItem)}
              {actionItems.map(renderNavItem)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
