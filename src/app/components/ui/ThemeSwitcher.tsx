"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getLabel = () => {
    if (theme === "light") {
      return "Light";
    } else if (theme === "dark") {
      return "Dark";
    } else {
      return "System";
    }
  };

  const getIcon = () => {
    if (theme === "light") return <Sun className="w-5 h-5" />;
    if (theme === "dark") return <Moon className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  if (!mounted) {
    return (
      <div className="flex items-center">
        <div className="w-10 h-8 rounded-md border border-current/20 opacity-50 animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={cycleTheme}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-transparent hover:border-current/40 hover:bg-accent"
        aria-label={`Current theme: ${getLabel()}. Click to cycle themes.`}
      >
        {getIcon()}
        <span className="hidden sm:inline">{getLabel()}</span>
      </button>
    </div>
  );
}
