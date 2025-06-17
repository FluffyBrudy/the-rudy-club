"use client";

import { useEffect, useState } from "react";
import SearchModal from "@/app/components/ui/SearchModel";

import Logo from "@/app/components/ui/NavComponents/Logo";
import DesktopNav from "@/app/components/ui/NavComponents/DesktopNav";
import NavIcons from "@/app/components/ui/NavComponents/NavIcons";
import MobileMenu from "@/app/components/ui/NavComponents/MobileMenu";
import ToggleMenuIcon from "@/app/components/ui/NavComponents/MobileMenuIcon";
import ThemeSwitcher from "./ThemeSwitcher";
import { useAppStore } from "@/app/store/appStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const user = useAppStore((state) => state.user);

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

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={closeSearch} />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b shadow-lg shadow-black/5"
            : "bg-background/60 backdrop-blur-md border-b border-border/40"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />

            <DesktopNav />

            <div className="hidden md:flex items-center space-x-3">
              {user && <NavIcons onSearch={openSearch} />}
              <ThemeSwitcher />
            </div>

            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={openSearch}
                className="p-2 rounded-xl hover:bg-accent/50 transition-colors duration-200"
              >
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              {user && <NavIcons onSearch={() => {}} />}
              <ThemeSwitcher />
              <button
                onClick={toggleMenu}
                className="p-2 rounded-xl hover:bg-accent/50 transition-all duration-200 active:scale-95"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <ToggleMenuIcon isOpen={isOpen} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} closeMenu={closeMenu} />

      <div className="h-16"></div>
    </>
  );
}
