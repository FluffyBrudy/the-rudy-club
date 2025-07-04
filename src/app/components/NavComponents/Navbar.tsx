"use client";

import { useEffect, useState } from "react";
import SearchModal from "@/app/components/searchModel/SearchModel";
import Logo from "@/app/components/NavComponents/Logo";
import DesktopNav from "@/app/components/NavComponents/DesktopNav";
import MobileNav from "@/app/components/NavComponents/MobileNav";
import { useAppStore } from "@/app/store/appStore";
import { useRouter } from "next/navigation";
import type { NavActionHandler } from "@/lib/navigation/navActions";
import { USER_PROFILE } from "@/lib/navigation/router";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenSearch = () => setSearchOpen(true);
  const handleOpenProfile = () => {
    if (user) {
      router.push(`${USER_PROFILE}/${user.userId}`);
    }
  };
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const actions: NavActionHandler = {
    openSearch: handleOpenSearch,
    openProfile: handleOpenProfile,
    logout: handleLogout,
  };

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b shadow-lg shadow-black/5"
            : "bg-background/60 backdrop-blur-md border-b border-border/40"
        }`}
        style={{
          backgroundColor: scrolled ? "var(--card-bg)/80" : "var(--card-bg)/60",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <DesktopNav actions={actions} />
            <MobileNav actions={actions} />
          </div>
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  );
}
