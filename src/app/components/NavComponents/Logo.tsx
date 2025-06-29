import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
        <span className="text-white font-bold text-sm">R</span>
      </div>
      <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-lime-600 to-emerald-600 bg-clip-text text-transparent">
        RudyClub
      </span>
    </Link>
  );
}
