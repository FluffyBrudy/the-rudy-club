"use client";

import Link from "next/link";
import { User, Home, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { navLinks } from "@/lib/nav";
import { useAppStore } from "@/app/store/appStore";
import { FEEDS_ROUTE, ROOT_ROUTE } from "@/lib/constants";
import Image from "next/image";

interface MobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
}

export default function MobileMenu({ isOpen, closeMenu }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const filteredLinks = navLinks.filter(
    (link) =>
      (user && link.postAuthVisibility) || (!user && link.preAuthVisibility)
  );

  const handleLogout = () => {
    logout();
    closeMenu();
    router.push("/");
  };

  return (
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
        {/* User Profile Section */}
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

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-4">
            {user && (
              <Link
                href={FEEDS_ROUTE}
                onClick={closeMenu}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  pathname === FEEDS_ROUTE ? "text-white" : "hover:bg-accent/50"
                }`}
                style={{
                  backgroundColor:
                    pathname === FEEDS_ROUTE
                      ? "var(--primary-color)"
                      : "transparent",
                  color:
                    pathname === FEEDS_ROUTE ? "white" : "var(--text-color)",
                }}
              >
                <Home className="h-5 w-5 mr-3" />
                <span>Home</span>
                {pathname === FEEDS_ROUTE && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            )}

            {filteredLinks.map((link) => {
              const isActive = pathname === link.href;
              const href =
                user && link.href === ROOT_ROUTE ? FEEDS_ROUTE : link.href;

              // Skip home link if user is logged in (already handled above)
              if (user && link.href === ROOT_ROUTE) return null;

              return (
                <Link
                  key={link.name}
                  href={href}
                  onClick={closeMenu}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive ? "text-white" : "hover:bg-accent/50"
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? "var(--primary-color)"
                      : "transparent",
                    color: isActive ? "white" : "var(--text-color)",
                  }}
                >
                  <span className="capitalize">{link.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div
          className="p-4 border-t space-y-3"
          style={{ borderColor: "var(--border-color)" }}
        >
          {/* Profile */}
          {user && (
            <button className="flex items-center w-full px-4 py-3 rounded-xl hover:bg-accent/50 transition-colors duration-200">
              <User
                className="h-5 w-5 mr-3"
                style={{ color: "var(--muted-color)" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-color)" }}
              >
                Profile
              </span>
            </button>
          )}

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-red-600 dark:text-red-400"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
