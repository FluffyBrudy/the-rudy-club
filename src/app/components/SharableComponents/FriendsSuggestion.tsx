"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import Image from "next/image";
import apiClient from "@/lib/api/apiclient";
import FollowButton from "./FollowUserButton";

interface SuggestedFriendsResponse {
  suggestedUser: string;
  username: string;
  imageUrl: string;
}

export default function FriendsSuggestion() {
  const [suggestions, setSuggestions] = useState<SuggestedFriendsResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const fetchSuggestions = async (pageNum = 0) => {
    try {
      setLoading(true);
      const response = await apiClient.social.getFriendsSuggestion(pageNum);
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        console.log(response.data);
        if (pageNum === 0) {
          setSuggestions(response.data);
        } else {
          setSuggestions((prev) => [...prev, ...response.data]);
        }
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch friends suggestions");
      console.error("Error fetching friends suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSuggestions(nextPage);
  };

  if (error && suggestions.length === 0) {
    return (
      <div
        className="p-4 rounded-xl"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center mb-4">
          <Users
            className="h-5 w-5 mr-2"
            style={{ color: "var(--primary-color)" }}
          />
          <h3 className="font-medium">Who to follow</h3>
        </div>
        <p
          className="text-sm text-center py-4"
          style={{ color: "var(--muted-color)" }}
        >
          Failed to load suggestions
        </p>
        <button
          onClick={() => fetchSuggestions(0)}
          className="w-full mt-2 text-sm font-medium py-2 rounded-lg transition-colors duration-200 hover:bg-accent/50"
          style={{ color: "var(--primary-color)" }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-xl"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-center mb-4">
        <Users
          className="h-5 w-5 mr-2"
          style={{ color: "var(--primary-color)" }}
        />
        <h3 className="font-medium">Who to follow</h3>
      </div>

      {loading && suggestions.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full mr-2"
                  style={{ backgroundColor: "var(--accent-color)" }}
                />
                <div>
                  <div
                    className="h-3 w-20 rounded mb-1"
                    style={{ backgroundColor: "var(--accent-color)" }}
                  />
                  <div
                    className="h-2 w-16 rounded"
                    style={{ backgroundColor: "var(--accent-color)" }}
                  />
                </div>
              </div>
              <div
                className="h-6 w-12 rounded-full"
                style={{ backgroundColor: "var(--accent-color)" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((user, index) => (
            <div
              key={user.suggestedUser || index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white overflow-hidden"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl || "/placeholder.svg"}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                      width={32}
                      height={32}
                    />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">@{user.username}</p>
                </div>
              </div>
              <FollowButton userId={user.suggestedUser} />
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="w-full mt-4 text-sm font-medium py-2 rounded-lg transition-colors duration-200 hover:bg-accent/50 disabled:opacity-50"
          style={{ color: "var(--primary-color)" }}
        >
          {loading ? "Loading..." : "Show more"}
        </button>
      )}
    </div>
  );
}
