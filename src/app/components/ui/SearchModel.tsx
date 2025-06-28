"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Search, X, Hash, Sparkles, ArrowUpRight } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const recentSearches = [
  {
    type: "user",
    name: "sarah_dev",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { type: "hashtag", name: "webdev" },
  {
    type: "user",
    name: "john_designer",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { type: "hashtag", name: "reactjs" },
];

const trendingTopics = [
  { name: "javascript", posts: "2.1k posts" },
  { name: "design", posts: "1.8k posts" },
  { name: "startup", posts: "956 posts" },
  { name: "ai", posts: "3.2k posts" },
  { name: "coding", posts: "1.5k posts" },
];

const searchResults = [
  {
    id: 1,
    type: "user",
    name: "Alex Chen",
    username: "alexchen_dev",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    followers: "12.5k followers",
  },
  {
    id: 2,
    type: "user",
    name: "Maria Garcia",
    username: "maria_ux",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: false,
    followers: "8.2k followers",
  },
  {
    id: 3,
    type: "hashtag",
    name: "webdevelopment",
    posts: "45.2k posts",
  },
];

const filterTabs = ["All", "Users", "Posts", "Polls"];

export default function SearchModal({
  isOpen = true,
  onClose = () => {},
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setShowResults(false);
    }
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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-opacity-60 backdrop-blur-sm"
      style={{ backgroundColor: "var(--bg-color" }}
    >
      <div className="relative w-full max-w-2xl mt-8 sm:mt-16">
        <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-600">
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-700 transition-all duration-200"
            >
              <X className="h-5 w-5 text-red-400" />
            </button>
          </div>

          <div className="px-6 py-4 border-b border-slate-600">
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
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 border-b border-slate-600">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for user, post or poll"
                className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!showResults ? (
              <div className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-center">
                    Try similar hashtag
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center text-white">
                    <div className="w-2 h-2 rounded-full mr-2 bg-pink-400" />
                    Recent
                  </h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search.name)}
                        className="flex items-center w-full p-3 text-left rounded-xl hover:bg-slate-700 transition-all duration-200 group"
                      >
                        {search.type === "user" ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mr-3 flex-shrink-0">
                              <span className="text-white text-sm font-medium">
                                {search.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="flex-1 text-white">
                              @{search.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 bg-pink-500">
                              <Hash className="h-4 w-4 text-white" />
                            </div>
                            <span className="flex-1 text-white">
                              #{search.name}
                            </span>
                          </>
                        )}
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center text-white">
                    <Sparkles className="h-4 w-4 mr-2 text-pink-400" />
                    Trending
                  </h3>
                  <div className="space-y-2">
                    {trendingTopics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(topic.name)}
                        className="flex items-center justify-between w-full p-3 text-left rounded-xl hover:bg-slate-700 transition-all duration-200"
                      >
                        <div className="flex items-center flex-1">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 bg-pink-500">
                            <Hash className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white">#{topic.name}</div>
                            <div className="text-xs text-slate-400">
                              {topic.posts}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-slate-400">
                    {searchResults.length} results for {`'${query}'`}
                  </p>
                </div>
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        onClose();
                      }}
                      className="flex items-center w-full p-4 text-left rounded-xl hover:bg-slate-700 transition-all duration-200 group"
                    >
                      {result.type === "user" ? (
                        <>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="text-white text-lg font-medium">
                              {result.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-semibold text-white">
                                {result.name}
                              </span>
                              {result.verified && (
                                <div className="w-4 h-4 rounded-full flex items-center justify-center ml-1 flex-shrink-0 bg-pink-500">
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-slate-400">
                              @{result.username}
                            </div>
                            <div className="text-xs text-slate-400">
                              {result.followers}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 bg-pink-500">
                            <Hash className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">
                              #{result.name}
                            </div>
                            <div className="text-sm text-slate-400">
                              {result.posts}
                            </div>
                          </div>
                        </>
                      )}
                      <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 text-pink-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-3 border-t border-slate-600 bg-slate-700">
            <div className="flex items-center justify-center">
              <span className="text-xs text-slate-400">
                Press ESC to close • ↵ to select
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
