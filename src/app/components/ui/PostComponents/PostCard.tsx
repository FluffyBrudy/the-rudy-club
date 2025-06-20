"use client";

import { useState } from "react";
import { MessageCircle, Share2, MoreHorizontal, Repeat2 } from "lucide-react";
import type { PostResponse } from "@/types/apiResponseTypes";
import Image from "next/image";
import CommentSection from "./CommentSection";
import ReactionPicker from "../ReactionComponents/ReactionPicker";

interface PostCardProps {
  post: PostResponse;
}

export default function PostCard({ post }: PostCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const formattedDate = post.createdAt!;

  return (
    <div
      className="rounded-xl mb-4 transition-all duration-200 hover:shadow-md overflow-hidden"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="p-5">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
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
                  className="w-full h-full flex items-center justify-center text-white font-bold"
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
                <span className="font-medium">{post.username}</span>
                <span
                  className="text-xs ml-2"
                  style={{ color: "var(--muted-color)" }}
                >
                  {formattedDate}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-2 rounded-full hover:bg-accent/50 transition-colors duration-200"
                >
                  <MoreHorizontal
                    size={18}
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
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent/50 transition-colors duration-200"
                      onClick={() => setShowOptions(false)}
                    >
                      Report post
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent/50 transition-colors duration-200"
                      onClick={() => setShowOptions(false)}
                    >
                      Hide post
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2">
              {post.content.textContent && (
                <p className="mb-3 whitespace-pre-wrap">
                  {post.content.textContent}
                </p>
              )}

              {post.content.mediaContent &&
                post.content.mediaContent.length > 0 && (
                  <div className="mt-3 rounded-xl overflow-hidden flex flex-wrap justify-around gap-1">
                    {post.content.mediaContent.map((media, index) => (
                      <div key={index} className="h-fit">
                        <Image
                          src={media}
                          alt={`Media content ${index + 1}`}
                          width={300}
                          height={200}
                          className="object-contain w-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between">
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
                  className="flex items-center gap-1 p-2 rounded-full hover:bg-accent/50 transition-colors duration-200"
                >
                  <MessageCircle size={18} />
                </button>

                <button className="flex items-center gap-1 p-2 rounded-full hover:bg-accent/50 transition-colors duration-200">
                  <Repeat2 size={18} />
                </button>

                <button className="flex items-center gap-1 p-2 rounded-full hover:bg-accent/50 transition-colors duration-200">
                  <Share2 size={18} />
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
  );
}
