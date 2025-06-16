import { Bell, Search, User } from "lucide-react";
import ThemeSwitch from "@/app/components/ui/ThemeSwitcher";

export default function NavIcons({ onSearch }: { onSearch: () => void }) {
  return (
    <>
      <button
        onClick={onSearch}
        className="p-2 rounded-xl hover:bg-accent/50 transition-colors duration-200 relative group"
      >
        <Search className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
      </button>
      <button className="p-2 rounded-xl hover:bg-accent/50 transition-colors duration-200 relative">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>
      <ThemeSwitch />
      <button className="p-2 rounded-xl hover:bg-accent/50 transition-colors duration-200">
        <User className="h-5 w-5 text-muted-foreground" />
      </button>
    </>
  );
}
