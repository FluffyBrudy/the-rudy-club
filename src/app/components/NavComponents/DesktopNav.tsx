"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { navLinks } from "@/lib/nav";
import { useAppStore } from "@/app/store/appStore";
import { FEEDS_ROUTE, ROOT_ROUTE } from "@/lib/constants";
import ThemeSwitcher from "@/app/components/ui/ThemeSwitcher";
import NotificationBell from "@/app/components/NotificationComponents/NotificationBell";

interface DesktopNavProps {
  onSearchOpen: () => void;
}

export default function DesktopNav({ onSearchOpen }: DesktopNavProps) {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);

  const filteredLinks = navLinks.filter(
    (link) =>
      (user && link.postAuthVisibility) || (!user && link.preAuthVisibility)
  );

  return (
    <>
      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-1">
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href;
          const href =
            user && link.href === ROOT_ROUTE ? FEEDS_ROUTE : link.href;
          return (
            <Link
              key={link.name}
              href={href}
              className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "text-lime-600 dark:text-lime-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="relative z-10 capitalize">{link.name}</span>
              {isActive && (
                <div className="absolute inset-0 bg-lime-100 dark:bg-lime-900/30 rounded-xl" />
              )}
              <div className="absolute inset-0 bg-accent/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          );
        })}
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center space-x-3">
        <button
          onClick={onSearchOpen}
          className="p-2 rounded-xl hover:bg-accent/50 transition-all duration-200"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" style={{ color: "var(--muted-color)" }} />
        </button>
        {user && <NotificationBell />}
        <ThemeSwitcher />
      </div>
    </>
  );
}
