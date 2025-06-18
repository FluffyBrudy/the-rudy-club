"use client";

import { Search, TrendingUp, Users, Calendar } from "lucide-react";
import Image from "next/image";

const trendingTopics = [
  { name: "Pigeon Messanger", posts: 1 },
  { name: "FluffyRudy", posts: 1 },
  { name: "Random shit", posts: 1502 },
  { name: "Another shit", posts: 1245 },
];

const suggestedUsers = [
  { username: "FluffyRudy", name: "FluffyRudy Developer", avatar: "" },
  { username: "FluffyBrudy", name: "FluffyBrudy", avatar: "" },
  { username: "Rudy", name: "Rudy", avatar: "" },
];

const upcomingEvents = [
  { name: "React Conf 2025", date: "Jun 20, 2025" },
  { name: "TypeScript Meetup", date: "Jul 5, 2025" },
];

export default function FeedSidebar() {
  return (
    <div className="space-y-6">
      <div
        className="p-4 rounded-xl"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--muted-color)" }}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20"
            style={{
              backgroundColor: "var(--input-bg)",
              border: "1px solid var(--input-border)",
              color: "var(--text-color)",
            }}
          />
        </div>
      </div>

      <div
        className="p-4 rounded-xl"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center mb-4">
          <TrendingUp
            className="h-5 w-5 mr-2"
            style={{ color: "var(--primary-color)" }}
          />
          <h3 className="font-medium">Trending Topics</h3>
        </div>

        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium">#{topic.name}</span>
              <span className="text-xs" style={{ color: "var(--muted-color)" }}>
                {topic.posts} posts
              </span>
            </div>
          ))}
        </div>

        <button
          className="w-full mt-4 text-sm font-medium py-2 rounded-lg transition-colors duration-200 hover:bg-accent/50"
          style={{ color: "var(--primary-color)" }}
        >
          Show more
        </button>
      </div>

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

        <div className="space-y-4">
          {suggestedUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  {user.avatar ? (
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-full h-full rounded-full"
                      width={48}
                      height={48}
                    />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--muted-color)" }}
                  >
                    @{user.username}
                  </p>
                </div>
              </div>
              <button
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                }}
              >
                Follow
              </button>
            </div>
          ))}
        </div>

        <button
          className="w-full mt-4 text-sm font-medium py-2 rounded-lg transition-colors duration-200 hover:bg-accent/50"
          style={{ color: "var(--primary-color)" }}
        >
          Show more
        </button>
      </div>

      <div
        className="p-4 rounded-xl"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center mb-4">
          <Calendar
            className="h-5 w-5 mr-2"
            style={{ color: "var(--primary-color)" }}
          />
          <h3 className="font-medium">Upcoming Events</h3>
        </div>

        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="p-3 rounded-lg"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              <p className="text-sm font-medium">{event.name}</p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--muted-color)" }}
              >
                {event.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
