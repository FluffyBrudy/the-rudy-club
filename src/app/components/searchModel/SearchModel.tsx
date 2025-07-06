import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import apiClient from "@/lib/api/apiclient";
import type {
  SearchPostsResponse,
  SearchUsersResponse,
} from "@/types/apiResponseTypes";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import FilterTabs from "./FilterTabs";
import UserSearchResults from "./UserSearchResults";
import PostSearchResults from "./PostSearchResults";
import { FEEDS_ROUTE, USER_PROFILE } from "@/lib/navigation/router";

const DEBOUNCE_INTERVAL = 350;
const MIN_QUERY_LENGTH = 3;

export default function SearchModal({
  isOpen = true,
  onClose = () => {},
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Users");
  const [userResults, setUserResults] = useState<SearchUsersResponse[]>([]);
  const [postResults, setPostResults] = useState<SearchPostsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setShowResults(false);
      setUserResults([]);
      setCursor(undefined);
      setHasMore(false);
      setError(null);
      setPostResults([]);
      setPostError(null);
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

  useEffect(() => {
    if (!query || query.length < MIN_QUERY_LENGTH) {
      setShowResults(query.length > 0);
      setUserResults([]);
      setPostResults([]);
      setCursor(undefined);
      setHasMore(false);
      setError(null);
      setPostError(null);
      return;
    }

    setShowResults(true);

    let debounceTimeout: NodeJS.Timeout;

    if (activeFilter === "Users") {
      setLoading(true);
      setError(null);
      debounceTimeout = setTimeout(() => {
        apiClient.search
          .searchUsers(query)
          .then((res) => {
            if (res.error) {
              setError(res.error);
              setUserResults([]);
              setHasMore(false);
            } else {
              setUserResults(res.data || []);
              setHasMore((res.data?.length ?? 0) > 0);
              setCursor(
                res.data && res.data.length > 0
                  ? res.data[res.data.length - 1].id
                  : undefined
              );
            }
          })
          .catch(() => {
            setError("Failed to search users");
            setUserResults([]);
            setHasMore(false);
          })
          .finally(() => setLoading(false));
      }, DEBOUNCE_INTERVAL);
    } else if (activeFilter === "Posts") {
      setPostLoading(true);
      setPostError(null);
      debounceTimeout = setTimeout(() => {
        apiClient.search
          .searchPosts(query)
          .then((res) => {
            if (res.error) {
              setPostError(res.error);
              setPostResults([]);
            } else {
              setPostResults(res.data || []);
            }
          })
          .catch(() => {
            setPostError("Failed to search posts");
            setPostResults([]);
          })
          .finally(() => setPostLoading(false));
      }, DEBOUNCE_INTERVAL);
    }

    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [query, activeFilter]);

  const handleLoadMore = () => {
    if (!query || query.length < MIN_QUERY_LENGTH || !cursor) return;
    setLoading(true);
    apiClient.search
      .searchUsers(query, cursor)
      .then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setUserResults((prev) => [...prev, ...(res.data || [])]);
          setHasMore((res.data?.length ?? 0) > 0);
          setCursor(
            res.data && res.data.length > 0
              ? res.data[res.data.length - 1].id
              : undefined
          );
        }
      })
      .catch(() => setError("Failed to load more users"))
      .finally(() => setLoading(false));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length > 0);
  };

  const handlePostClick = (postId: string) => {
    router.push(`${FEEDS_ROUTE}/post/${postId}`);
    onClose();
  };

  const handleUserClick = (userId: string) => {
    router.push(`${USER_PROFILE}/${userId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4"
      style={{
        backgroundColor: "var(--bg-color, rgba(0,0,0,0.6))",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="relative w-full max-w-2xl mt-8 sm:mt-16">
        <div
          className="border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300"
          style={{
            background: "var(--card-bg, #1e293b)",
            borderColor: "var(--border-color, #334155)",
          }}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{
              borderColor: "var(--border-color, #334155)",
              background: "var(--card-bg, #1e293b)",
            }}
          >
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-all duration-200"
              style={{ background: "transparent" }}
            >
              <X
                className="h-5 w-5"
                style={{ color: "var(--primary-color, #ef4444)" }}
              />
            </button>
          </div>

          <div
            className="px-6 py-4 border-b"
            style={{
              borderColor: "var(--border-color, #334155)",
              background: "var(--card-bg, #1e293b)",
            }}
          >
            <FilterTabs
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>

          <div
            className="px-6 py-4 border-b"
            style={{
              borderColor: "var(--border-color, #334155)",
              background: "var(--card-bg, #1e293b)",
            }}
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                style={{ color: "var(--muted-color, #94a3b8)" }}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for user, post or poll"
                className="w-full pl-12 pr-4 py-3 rounded-xl"
                style={{
                  background: "var(--input-bg, #334155)",
                  color: "var(--text-color, #fff)",
                  border: "1px solid var(--input-border, #334155)",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div
            className="max-h-96 overflow-y-auto"
            style={{ background: "var(--card-bg, #1e293b)" }}
          >
            {query.length > 0 && query.length < MIN_QUERY_LENGTH ? (
              <div className="p-6 flex flex-col items-center justify-center py-12">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "var(--input-bg, #334155)" }}
                >
                  <Search
                    className="h-8 w-8"
                    style={{ color: "var(--muted-color, #94a3b8)" }}
                  />
                </div>
                <p
                  className="text-center"
                  style={{ color: "var(--muted-color, #94a3b8)" }}
                >
                  Please enter at least {MIN_QUERY_LENGTH} characters to search.
                </p>
              </div>
            ) : activeFilter === "Users" ? (
              showResults ? (
                <UserSearchResults
                  onUserClick={handleUserClick}
                  results={userResults}
                  loading={loading}
                  error={error}
                  onClose={onClose}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                />
              ) : (
                <div className="p-6 flex flex-col items-center justify-center py-12">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "var(--input-bg, #334155)" }}
                  >
                    <Search
                      className="h-8 w-8"
                      style={{ color: "var(--muted-color, #94a3b8)" }}
                    />
                  </div>
                  <p
                    className="text-center"
                    style={{ color: "var(--muted-color, #94a3b8)" }}
                  >
                    Start typing to search for users.
                  </p>
                </div>
              )
            ) : activeFilter === "Posts" ? (
              <PostSearchResults
                results={postResults}
                loading={postLoading}
                error={postError}
                onClose={onClose}
                searchTerm={query}
                onPostClick={handlePostClick}
              />
            ) : (
              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "var(--input-bg, #334155)" }}
                  >
                    <Search
                      className="h-8 w-8"
                      style={{ color: "var(--muted-color, #94a3b8)" }}
                    />
                  </div>
                  <p
                    className="text-center"
                    style={{ color: "var(--muted-color, #94a3b8)" }}
                  >
                    No results for this filter yet.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div
            className="px-6 py-3 border-t"
            style={{
              borderColor: "var(--border-color, #334155)",
              background: "var(--input-bg, #334155)",
            }}
          >
            <div className="flex items-center justify-center">
              <span
                className="text-xs"
                style={{ color: "var(--muted-color, #94a3b8)" }}
              >
                Press ESC to close • ↵ to select
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
