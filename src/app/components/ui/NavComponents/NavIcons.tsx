import { User } from "lucide-react";
import NotificationBell from "../NotificationComponents/NotificationBell";

export default function NavIcons({ onSearch }: { onSearch: () => void }) {
  return (
    <>
      <button
        onClick={onSearch}
        className="p-2 rounded-xl hover:bg-accent/50 transition-colors duration-200 relative group"
      ></button>
      <div className="p-2 rounded-xl hover:bg-accent/50 transition-colors duration-200 relative">
        <NotificationBell />
      </div>
      <button className="p-2 rounded-xl hover:bg-accent/50 transition-colors duration-200">
        <User className="h-5 w-5 text-muted-foreground" />
      </button>
    </>
  );
}
