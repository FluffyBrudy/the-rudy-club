"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Users,
  Grid3X3,
  List,
  Filter,
  UserPlus,
  MessageCircle,
  Sparkles,
  RefreshCcw,
} from "lucide-react";
import User from "@/app/components/ui/User";
import UserCard from "@/app/components/ui/UserCard";
import apiClient from "@/lib/api/apiclient";
import type { ConnectedFriendsResponse } from "@/types/apiResponseTypes";
import { useRouter } from "next/navigation";
import { USER_PROFILE } from "@/lib/navigation/router";

export default function ConnectedFriends() {
  const router = useRouter();
  const [friends, setFriends] = useState<ConnectedFriendsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [sortBy, setSortBy] = useState<"name" | "recent">("name");
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFriends = async () => {
    setRefreshing(true);
    try {
      const connectedFriends = await apiClient.social.getConnectedFriends();
      if (connectedFriends.data) {
        setFriends(connectedFriends.data);
      }
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const filteredAndSortedFriends = useMemo(() => {
    const filtered = friends.filter((friend) =>
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.username.localeCompare(b.username));
    }

    return filtered;
  }, [friends, searchQuery, sortBy]);

  const handleUserClick = (userId: string) => {
    router.push(`${USER_PROFILE}/${userId}`);
  };

  const handleMessageClick = (userId: string) => {
    if (typeof window === "undefined") return "";

    const currentUrl = window.location.hostname;
    console.log(currentUrl);
    const baseUrl = "https://pigeon-messanger-frontend.vercel.app/";
    const url = `${baseUrl}?userId=${encodeURIComponent(
      userId
    )}&from=${encodeURIComponent(currentUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)]/5 to-emerald-500/5 rounded-3xl -z-10"></div>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-br from-[var(--primary-color)] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--text-color)] to-[var(--secondary-color)] bg-clip-text text-transparent">
                Connected Friends
              </h1>
              <p className="text-[var(--muted-color)] text-sm">
                {friends.length}{" "}
                {friends.length === 1 ? "connection" : "connections"} •{" "}
                {filteredAndSortedFriends.length} visible
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!refreshing) fetchFriends();
            }}
            disabled={refreshing}
            aria-label="Refresh connected friends"
            title="Refresh connected friends"
            className={`p-3 rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all duration-300 hover:bg-[var(--accent-color)] hover:text-[var(--primary-color)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] ${
              refreshing ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <RefreshCcw
              className={`h-5 w-5 transform transition-transform duration-700 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-color)] group-focus-within:text-[var(--primary-color)] transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search your connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:border-[var(--primary-color)] focus:shadow-lg focus:shadow-[var(--primary-color)]/10 hover:border-[var(--primary-color)]/50"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--input-border)",
                color: "var(--text-color)",
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-4 rounded-2xl transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                showFilters ? "shadow-lg" : ""
              }`}
              style={{
                backgroundColor: showFilters
                  ? "var(--primary-color)"
                  : "var(--accent-color)",
                color: showFilters ? "white" : "var(--text-color)",
              }}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            <div className="flex bg-[var(--accent-color)] rounded-2xl p-1 shadow-inner">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  viewMode === "grid"
                    ? "shadow-md transform scale-105"
                    : "hover:bg-white/50"
                }`}
                style={{
                  backgroundColor:
                    viewMode === "grid"
                      ? "var(--primary-color)"
                      : "transparent",
                  color: viewMode === "grid" ? "white" : "var(--text-color)",
                }}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  viewMode === "list"
                    ? "shadow-md transform scale-105"
                    : "hover:bg-white/50"
                }`}
                style={{
                  backgroundColor:
                    viewMode === "list"
                      ? "var(--primary-color)"
                      : "transparent",
                  color: viewMode === "list" ? "white" : "var(--text-color)",
                }}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] shadow-lg animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[var(--text-color)]">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "name" | "recent")
                  }
                  className="px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                >
                  <option value="name">Name</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredAndSortedFriends.length === 0 ? (
        <div className="text-center py-16">
          <div className="relative mb-6">
            <div className="h-24 w-24 mx-auto bg-gradient-to-br from-[var(--accent-color)] to-[var(--border-color)] rounded-full flex items-center justify-center">
              <Users className="h-12 w-12 text-[var(--muted-color)]" />
            </div>
            <div className="absolute top-0 right-1/2 transform translate-x-8 -translate-y-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                <UserPlus className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[var(--text-color)] mb-3">
            {searchQuery ? "No matches found" : "Your network awaits"}
          </h3>
          <p className="text-[var(--muted-color)] mb-6 max-w-md mx-auto">
            {searchQuery
              ? `No friends match "${searchQuery}". Try a different search term.`
              : "Start building meaningful connections. Your friends will appear here once you connect."}
          </p>
          {!searchQuery && (
            <button className="px-6 py-3 bg-gradient-to-r from-[var(--primary-color)] to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
              Find Friends
            </button>
          )}
        </div>
      ) : (
        <div
          className={`transition-all duration-500 ${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }`}
        >
          {filteredAndSortedFriends.map((friend, index) =>
            viewMode === "grid" ? (
              <div
                key={friend.userId}
                className="group animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] shadow-sm hover:shadow-xl hover:shadow-[var(--primary-color)]/5 transition-all duration-300 hover:-translate-y-1 group-hover:border-[var(--primary-color)]/20">
                  <UserCard
                    id={friend.userId}
                    username={friend.username}
                    picture={friend.imageUrl}
                    onUserClick={handleUserClick}
                    onMessageClick={handleMessageClick}
                  />
                </div>
              </div>
            ) : (
              <div
                key={friend.userId}
                className="group animate-in fade-in-0 slide-in-from-left-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] shadow-sm hover:shadow-lg hover:shadow-[var(--primary-color)]/5 transition-all duration-300 group-hover:border-[var(--primary-color)]/20">
                  <div className="flex items-center justify-between">
                    <User
                      id={friend.userId}
                      username={friend.username}
                      picture={friend.imageUrl}
                      size="md"
                      onClick={handleUserClick}
                    />
                    <button
                      onClick={() => handleMessageClick(friend.userId)}
                      className="p-3 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--primary-color)] hover:text-white transition-all duration-300 hover:scale-110"
                      style={{ color: "var(--text-color)" }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {filteredAndSortedFriends.length > 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--accent-color)] to-[var(--border-color)] rounded-full">
            <div className="h-2 w-2 bg-[var(--primary-color)] rounded-full animate-pulse"></div>
            <span className="text-sm text-[var(--muted-color)]">
              Showing {filteredAndSortedFriends.length} of {friends.length}{" "}
              connections
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--primary-color)] to-emerald-600 animate-pulse"></div>
          <div className="h-8 w-48 bg-[var(--accent-color)] rounded-lg animate-pulse"></div>
        </div>
        <div className="h-4 w-32 bg-[var(--accent-color)] rounded animate-pulse"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="h-12 flex-1 bg-[var(--accent-color)] rounded-xl animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-12 w-16 bg-[var(--accent-color)] rounded-xl animate-pulse"></div>
          <div className="h-12 w-16 bg-[var(--accent-color)] rounded-xl animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-[var(--card-bg)] rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-[var(--card-bg)] rounded animate-pulse mb-2"></div>
                <div className="h-3 w-16 bg-[var(--card-bg)] rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 flex-1 bg-[var(--card-bg)] rounded-lg animate-pulse"></div>
              <div className="h-8 w-8 bg-[var(--card-bg)] rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
