"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nav";
import { useAppStore } from "@/app/store/appStore";

export default function DesktopNav() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);

  const filteredLinks = navLinks.filter(
    (link) =>
      (user && link.postAuthVisibility) || (!user && link.preAuthVisibility)
  );

  return (
    <div className="hidden md:flex items-center space-x-1">
      {filteredLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
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
  );
}
