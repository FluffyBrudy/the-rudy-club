"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  ArrowRight,
  Command,
} from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const recentSearches = [
  "React components",
  "Next.js routing",
  "Tailwind CSS",
  "TypeScript tips",
];

const trendingSearches = [
  "AI integration",
  "Dark mode",
  "Authentication",
  "Database setup",
  "API routes",
];

const searchResults = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    description:
      "Learn the basics of Next.js and how to build modern web applications",
    category: "Tutorial",
    url: "/tutorials/nextjs-basics",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description:
      "Explore advanced React patterns and best practices for scalable applications",
    category: "Guide",
    url: "/guides/react-patterns",
  },
  {
    id: 3,
    title: "Building APIs with Next.js",
    description:
      "Create robust APIs using Next.js API routes and server actions",
    category: "Tutorial",
    url: "/tutorials/nextjs-api",
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setShowResults(false);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setShowResults(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length > 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl mx-4 mt-16 sm:mt-24">
        <div className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="flex items-center px-6 py-4 border-b border-border/50">
            <Search className="h-5 w-5 text-muted-foreground mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search anything..."
              className="flex-1 bg-transparent text-lg placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="flex items-center space-x-2">
              <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
                <Command className="h-3 w-3" />K
              </kbd>
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent/50 rounded-xl transition-colors duration-200"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!showResults ? (
              /* Default State - Recent & Trending */
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Recent
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="flex items-center w-full px-3 py-2 text-left rounded-xl hover:bg-accent/50 transition-colors duration-200 group"
                      >
                        <span className="text-sm">{search}</span>
                        <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-3">
                    <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Trending
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="px-3 py-1.5 bg-accent/30 hover:bg-accent/50 rounded-full text-sm transition-colors duration-200"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Search Results */
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {searchResults.length} results for &quot;{query}&quot;
                  </p>
                </div>
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        onClose();
                      }}
                      className="flex flex-col items-start w-full p-4 text-left rounded-xl hover:bg-accent/50 transition-colors duration-200 group"
                    >
                      <div className="flex items-center w-full mb-1">
                        <span className="text-xs font-medium text-lime-600 dark:text-lime-400 bg-lime-100 dark:bg-lime-900/30 px-2 py-0.5 rounded-full">
                          {result.category}
                        </span>
                        <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                      <h4 className="font-medium mb-1 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors duration-200">
                        {result.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {result.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-3 border-t border-border/50 bg-accent/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Press ESC to close</span>
              <div className="flex items-center space-x-4">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
