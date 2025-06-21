import { User } from "lucide-react";

export default function NavIcons() {
  return (
    <>
      <button className="p-2 rounded-xl hover:bg-accent/50 transition-colors duration-200">
        <User className="h-5 w-5 text-muted-foreground" />
      </button>
    </>
  );
}
