import React from "react";
import { Search, Hash, Sparkles, ArrowUpRight } from "lucide-react";

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

export default function RecentAndTrending({ onSearch }: { onSearch: (term: string) => void }) {
  return (
    <div className="p-6 space-y-6">
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
          Try similar hashtag
        </p>
      </div>

      <div>
        <h3
          className="text-sm font-semibold mb-4 flex items-center"
          style={{ color: "var(--text-color, #fff)" }}
        >
          <div
            className="w-2 h-2 rounded-full mr-2"
            style={{ background: "var(--primary-color, #ec4899)" }}
          />
          Recent
        </h3>
        <div className="space-y-2">
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => onSearch(search.name)}
              className="flex items-center w-full p-3 text-left rounded-xl transition-all duration-200 group"
              style={{ background: "transparent" }}
            >
              {search.type === "user" ? (
                <>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(to bottom right, var(--primary-color, #ec4899), var(--secondary-color, #a21caf))",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--btn-text-color, #fff)",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      {search.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span
                    className="flex-1"
                    style={{ color: "var(--text-color, #fff)" }}
                  >
                    @{search.name}
                  </span>
                </>
              ) : (
                <>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    style={{ background: "var(--primary-color, #ec4899)" }}
                  >
                    <Hash
                      className="h-4 w-4"
                      style={{ color: "var(--btn-text-color, #fff)" }}
                    />
                  </div>
                  <span
                    className="flex-1"
                    style={{ color: "var(--text-color, #fff)" }}
                  >
                    #{search.name}
                  </span>
                </>
              )}
              <ArrowUpRight
                className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                style={{ color: "var(--muted-color, #94a3b8)" }}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3
          className="text-sm font-semibold mb-4 flex items-center"
          style={{ color: "var(--text-color, #fff)" }}
        >
          <Sparkles
            className="h-4 w-4 mr-2"
            style={{ color: "var(--primary-color, #ec4899)" }}
          />
          Trending
        </h3>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <button
              key={index}
              onClick={() => onSearch(topic.name)}
              className="flex items-center justify-between w-full p-3 text-left rounded-xl transition-all duration-200"
              style={{ background: "transparent" }}
            >
              <div className="flex items-center flex-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  style={{ background: "var(--primary-color, #ec4899)" }}
                >
                  <Hash
                    className="h-4 w-4"
                    style={{ color: "var(--btn-text-color, #fff)" }}
                  />
                </div>
                <div className="flex-1">
                  <div style={{ color: "var(--text-color, #fff)" }}>
                    #{topic.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--muted-color, #94a3b8)" }}
                  >
                    {topic.posts}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
