"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  Share2,
  MoreHorizontal,
  Repeat2,
  ArrowLeft,
} from "lucide-react";
import type { PostResponse } from "@/types/apiResponseTypes";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import CommentSection from "@/app/components/PostComponents/CommentSection";
import ReactionPicker from "@/app/components/ReactionComponents/ReactionPicker";
import apiClient from "@/lib/api/apiclient";

export default function SinglePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await apiClient.posts.fetchPostById(
          id as unknown as string
        );

        if (!response.data) {
          throw new Error(response.error);
        }

        setPost(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading post</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Post not found</h2>
          <p className="text-muted-foreground">
            {"The post you're looking for doesn't exist."}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="theme-button flex items-center gap-2  transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div
          className="rounded-xl transition-all duration-200 hover:shadow-md overflow-hidden"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  {post.profilePicture ? (
                    <Image
                      src={post.profilePicture || "/placeholder.svg"}
                      alt={post.username}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: "var(--primary-color)" }}
                    >
                      {post.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-lg">
                      {post.username}
                    </span>
                    <span
                      className="text-sm ml-3"
                      style={{ color: "var(--muted-color)" }}
                    >
                      {post.createdAt}
                    </span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowOptions(!showOptions)}
                      className="p-2 rounded-full  transition-colors duration-200"
                    >
                      <MoreHorizontal
                        size={20}
                        style={{ color: "var(--muted-color)" }}
                      />
                    </button>

                    {showOptions && (
                      <div
                        className="absolute right-0 mt-1 py-2 w-48 rounded-lg shadow-lg z-10"
                        style={{
                          backgroundColor: "var(--card-bg)",
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        <button
                          className="w-full text-left px-4 py-2 text-sm  transition-colors duration-200"
                          onClick={() => setShowOptions(false)}
                        >
                          Report post
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm transition-colors duration-200"
                          onClick={() => setShowOptions(false)}
                        >
                          Hide post
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  {post.content.textContent && (
                    <p className="mb-4 whitespace-pre-wrap text-base leading-relaxed">
                      {post.content.textContent}
                    </p>
                  )}

                  {post.content.mediaContent &&
                    post.content.mediaContent.length > 0 && (
                      <div className="mt-4 rounded-xl overflow-hidden">
                        <div className="grid gap-2">
                          {post.content.mediaContent.map((media, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={media || "/placeholder.svg"}
                                alt={`Media content ${index + 1}`}
                                width={600}
                                height={400}
                                className="object-contain w-full rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ReactionPicker
                      reactionOnId={post.postId.toString()}
                      reactionOnType="post"
                      initialReactionCount={post.totalReaction}
                      reactions={post.reactions}
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowComments(!showComments)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full  transition-colors duration-200"
                    >
                      <MessageCircle size={20} />
                      <span className="text-sm">Comments</span>
                    </button>

                    <button className="flex items-center gap-1 p-2 rounded-full  transition-colors duration-200">
                      <Repeat2 size={20} />
                    </button>

                    <button className="flex items-center gap-1 p-2 rounded-full  transition-colors duration-200">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CommentSection
            postId={post.postId}
            isOpen={showComments}
            onToggle={() => setShowComments(!showComments)}
          />
        </div>
      </div>
    </div>
  );
}
