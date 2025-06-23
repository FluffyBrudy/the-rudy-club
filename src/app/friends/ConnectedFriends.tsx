"use client";

import { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
import User from "@/app/components/ui/User";
import UserCard from "@/app/components/ui/UserCard";
import apiClient from "@/lib/api";

interface Friend {
  id: string;
  username: string;
  picture?: string | null;
}

export default function ConnectedFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const mockFriends: Friend[] = [
    {
      id: "1",
      username: "john_doe",
      picture: null,
    },
    {
      id: "2",
      username: "jane_smith",
      picture: null,
    },
    {
      id: "3",
      username: "alex_wilson",
      picture: null,
    },
    {
      id: "4",
      username: "sarah_johnson",
      picture: null,
    },
    {
      id: "5",
      username: "mike_brown",
      picture: null,
    },
    {
      id: "6",
      username: "emily_davis",
      picture: null,
    },
  ];

  useEffect(() => {
    const fetchFriends = async () => {
      const connectedFriends = await apiClient.RetriveConnectedFriends();
      console.log(connectedFriends);
    };
    fetchFriends();
  }, []);

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (userId: string) => {
    console.log("User clicked:", userId);
  };

  const handleMessageClick = (userId: string) => {
    console.log("Message user:", userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "var(--primary-color)" }}
        ></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users
            className="h-8 w-8"
            style={{ color: "var(--primary-color)" }}
          />
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-color)" }}
          >
            Connected Friends
          </h1>
        </div>
        <p style={{ color: "var(--muted-color)" }}>
          {friends.length} {friends.length === 1 ? "friend" : "friends"}{" "}
          connected
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--muted-color)" }}
          />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border transition-colors duration-200  focus:outline-none focus:ring-2 ring-[var(--primary-color)]"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--input-border)",
              color: "var(--text-color)",
            }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-3 rounded-xl transition-colors duration-200 ${
              viewMode === "grid" ? "text-white" : ""
            }`}
            style={{
              backgroundColor:
                viewMode === "grid"
                  ? "var(--primary-color)"
                  : "var(--accent-color)",
              color: viewMode === "grid" ? "white" : "var(--text-color)",
            }}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-3 rounded-xl transition-colors duration-200 ${
              viewMode === "list" ? "text-white" : ""
            }`}
            style={{
              backgroundColor:
                viewMode === "list"
                  ? "var(--primary-color)"
                  : "var(--accent-color)",
              color: viewMode === "list" ? "white" : "var(--text-color)",
            }}
          >
            List
          </button>
        </div>
      </div>

      {filteredFriends.length === 0 ? (
        <div className="text-center py-12">
          <Users
            className="h-16 w-16 mx-auto mb-4 opacity-50"
            style={{ color: "var(--muted-color)" }}
          />
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "var(--text-color)" }}
          >
            {searchQuery ? "No friends found" : "No friends yet"}
          </h3>
          <p style={{ color: "var(--muted-color)" }}>
            {searchQuery
              ? "Try adjusting your search terms"
              : "Start connecting with people to see them here"}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {filteredFriends.map((friend) =>
            viewMode === "grid" ? (
              <UserCard
                key={friend.id}
                id={friend.id}
                username={friend.username}
                picture={friend.picture}
                onUserClick={handleUserClick}
                onMessageClick={handleMessageClick}
              />
            ) : (
              <div
                key={friend.id}
                className="p-4 rounded-xl border transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <User
                  id={friend.id}
                  username={friend.username}
                  picture={friend.picture}
                  size="md"
                  onClick={handleUserClick}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
