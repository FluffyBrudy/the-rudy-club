"use client";

import Link from "next/link";
import { Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nav";

interface MobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
}

export default function MobileMenu({ isOpen, closeMenu }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-background/95 backdrop-blur-xl border-l shadow-2xl transform transition-transform duration-300 ease-out z-50 md:hidden ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="capitalize">{link.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-lime-500 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t space-y-3">
          <button className="flex items-center w-full px-4 py-3 rounded-xl hover:bg-accent/50 transition-colors duration-200">
            <Bell className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="text-sm font-medium">Notifications</span>
            <div className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button className="flex items-center w-full px-4 py-3 rounded-xl hover:bg-accent/50 transition-colors duration-200">
            <User className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="text-sm font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
