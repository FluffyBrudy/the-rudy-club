"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/app/store/appStore";
import apiClient from "@/lib/api";
import PostCard from "@/app/components/PostComponents/PostCard";
import CreatePostForm from "@/app/components/PostComponents/CreatePostForm";
import FeedSidebar from "@/app/components/PostComponents/FeedSidebar";
import { Loader2 } from "lucide-react";

export default function Feeds() {
  const router = useRouter();
  const posts = useAppStore((state) => state.posts);
  const setPosts = useAppStore((state) => state.setPosts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.fetchPosts();

        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [setPosts, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CreatePostForm />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2
                className="h-8 w-8 animate-spin"
                style={{ color: "var(--primary-color)" }}
              />
              <span
                className="ml-2 text-lg"
                style={{ color: "var(--muted-color)" }}
              >
                Loading posts...
              </span>
            </div>
          ) : error ? (
            <div
              className="p-6 rounded-xl text-center"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded-lg font-medium"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                }}
              >
                Try Again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div
              className="p-6 rounded-xl text-center"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <p
                className="text-lg mb-4"
                style={{ color: "var(--muted-color)" }}
              >
                No posts yet
              </p>
              <p>Be the first to share something with the community!</p>
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <PostCard key={post.postId} post={post} />
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:block">
          <FeedSidebar />
        </div>
      </div>
    </div>
  );
}
