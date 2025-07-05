import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { SearchUsersResponse } from "@/types/apiResponseTypes";

interface UserSearchResultsProps {
  results: SearchUsersResponse[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function UserSearchResults({
  results,
  loading,
  error,
  onClose,
  onLoadMore,
  hasMore,
}: UserSearchResultsProps) {
  return (
    <div className="p-6">
      <div className="mb-4">
        <p className="text-sm" style={{ color: "var(--muted-color, #94a3b8)" }}>
          {results.length} results
        </p>
      </div>
      <div className="space-y-3">
        {results.map((user) => (
          <button
            key={user.id}
            onClick={onClose}
            className="flex items-center w-full p-4 text-left rounded-xl transition-all duration-200 group"
            style={{ background: "transparent" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
              style={{
                background:
                  "linear-gradient(to bottom right, var(--primary-color, #ec4899), var(--secondary-color, #a21caf))",
              }}
            >
              <span
                style={{
                  color: "var(--btn-text-color, #fff)",
                  fontSize: "1.125rem",
                  fontWeight: 500,
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-color, #fff)" }}
                >
                  {user.username || user.username}
                </span>
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--muted-color, #94a3b8)" }}
              >
                @{user.username}
              </div>
            </div>
            <ArrowUpRight
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
              style={{ color: "var(--primary-color, #ec4899)" }}
            />
          </button>
        ))}
        {loading && (
          <div
            className="py-4 text-center"
            style={{ color: "var(--muted-color, #94a3b8)" }}
          >
            Loading...
          </div>
        )}
        {error && (
          <div
            className="py-4 text-center"
            style={{ color: "var(--primary-color, #ec4899)" }}
          >
            {error}
          </div>
        )}
        {hasMore && !loading && (
          <div className="flex justify-center mt-4">
            <button
              onClick={onLoadMore}
              className="px-6 py-2 rounded-full font-medium"
              style={{
                background:
                  "linear-gradient(to right, var(--primary-color, #ec4899), var(--secondary-color, #a21caf))",
                color: "var(--btn-text-color, #fff)",
              }}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
