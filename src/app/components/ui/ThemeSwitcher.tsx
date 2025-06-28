"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Waves, Trees, Ghost, Sparkle, Gem } from "lucide-react";

const themes = [
  { name: "light", label: "Light", icon: Sun },
  { name: "dark", label: "Dark", icon: Moon },
  { name: "dracula", label: "Dracula", icon: Ghost },
  { name: "ocean", label: "Ocean", icon: Waves },
  { name: "forest", label: "Forest", icon: Trees },
  { name: "neon", label: "Neon", icon: Sparkle },
  { name: "purple", label: "purple", icon: Gem },
];

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.name === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].name);
  };

  const getCurrentTheme = () => {
    return themes.find((t) => t.name === theme) || themes[0];
  };

  if (!mounted) {
    return (
      <div className="flex items-center">
        <div className="w-10 h-8 rounded-md border border-current/20 opacity-50 animate-pulse" />
      </div>
    );
  }

  const currentTheme = getCurrentTheme();
  const IconComponent = currentTheme.icon;

  return (
    <div>
      <button
        onClick={cycleTheme}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-transparent hover:border-current/40 hover:bg-accent"
        aria-label={`Current theme: ${currentTheme.label}. Click to cycle themes.`}
        style={{
          backgroundColor: "var(--accent-color)",
          borderColor: "var(--border-color)",
        }}
      >
        <IconComponent className="w-5 h-5" />
        <span className="hidden sm:inline">{currentTheme.label}</span>
      </button>
    </div>
  );
}
