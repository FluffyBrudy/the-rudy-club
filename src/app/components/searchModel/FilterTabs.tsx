import React from "react";

const filterTabs = ["Users", "Posts", "Polls"];

interface FilterTabsProps {
  activeFilter: string;
  setActiveFilter: (tab: string) => void;
}

export default function FilterTabs({
  activeFilter,
  setActiveFilter,
}: FilterTabsProps) {
  return (
    <div className="flex space-x-1">
      {filterTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveFilter(tab)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeFilter === tab
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              : "text-slate-300 hover:text-white hover:bg-slate-700"
          }`}
          style={
            activeFilter === tab
              ? {
                  background:
                    "linear-gradient(to right, var(--primary-color, #ec4899), var(--secondary-color, #a21caf))",
                  color: "var(--btn-text-color, #fff)",
                }
              : {
                  color: "var(--muted-color, #cbd5e1)",
                }
          }
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
