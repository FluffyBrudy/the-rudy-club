import { Menu, X } from "lucide-react";

export default function ToggleMenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative w-6 h-6">
      <Menu
        className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
          isOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
        }`}
      />
      <X
        className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
          isOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"
        }`}
      />
    </div>
  );
}
