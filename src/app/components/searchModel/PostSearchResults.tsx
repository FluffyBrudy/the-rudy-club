import { SearchPostsResponse } from "@/types/apiResponseTypes";
import React from "react";
import { ArrowUpRight } from "lucide-react"; // Add an icon for UX hint

function highlightTerm(text: string, searchTerm: string) {
  if (!searchTerm) return text;
  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-black rounded px-1">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function getFriendlySnippet(post: SearchPostsResponse, searchTerm: string) {
  const content = post.fullContent || post.matchedContent || "";
  if (!content)
    return <span className="italic text-gray-400">No preview available</span>;

  const lowerContent = content.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const idx = lowerContent.indexOf(lowerTerm);

  if (idx !== -1) {
    const start = Math.max(0, idx - 30);
    const end = Math.min(content.length, idx + lowerTerm.length + 30);
    let snippet = content.slice(start, end);
    if (start > 0) snippet = "..." + snippet;
    if (end < content.length) snippet = snippet + "...";
    return highlightTerm(snippet, searchTerm);
  }

  let snippet = content.slice(0, 80);
  if (content.length > 80) snippet += "...";
  return highlightTerm(snippet, searchTerm);
}

interface PostSearchResultsProps {
  results: SearchPostsResponse[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
  searchTerm: string;
  onPostClick?: (postId: string) => void;
}

export default function PostSearchResults({
  results,
  loading,
  error,
  onClose,
  searchTerm,
  onPostClick,
}: PostSearchResultsProps) {
  function handleClick(postId: string) {
    if (onPostClick) {
      onPostClick(postId);
    } else {
      onClose();
    }
  }
  return (
    <div className="p-6">
      <div className="mb-4">
        <p className="text-sm" style={{ color: "var(--muted-color, #94a3b8)" }}>
          {results.length === 0 && !loading && !error
            ? "No posts found"
            : `${results.length} result${results.length === 1 ? "" : "s"}`}
        </p>
      </div>
      <div className="space-y-3">
        {results.map((post, i) => (
          <button
            key={`${post.postId}-${i}`}
            onClick={() => handleClick(post.postId)}
            className="flex flex-col w-full p-4 text-left rounded-xl transition-all duration-200 group border border-slate-700 bg-slate-800/60 hover:bg-slate-700/90 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm relative"
            style={{
              background: "var(--result-bg, rgba(30,41,59,0.85))",
              borderColor: "var(--border-color, #334155)",
              cursor: "pointer",
            }}
            tabIndex={0}
            aria-label={`View post ${post.postId}`}
          >
            <div className="flex items-center justify-between">
              <div
                className="font-semibold break-words mb-1"
                style={{ color: "var(--text-color, #fff)" }}
              >
                {getFriendlySnippet(post, searchTerm)}
              </div>
              <span className="ml-3 flex items-center gap-1 text-xs text-blue-400 opacity-80 group-hover:opacity-100 group-hover:text-blue-300 transition-all">
                View post
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-400 opacity-80 group-hover:opacity-100 select-text">
              <span className="font-mono">Post ID: {post.postId}</span>
            </div>
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
        {!loading && !error && results.length === 0 && (
          <div
            className="py-4 text-center italic"
            style={{ color: "var(--muted-color, #94a3b8)" }}
          >
            No posts matched your search.
          </div>
        )}
      </div>
    </div>
  );
}
