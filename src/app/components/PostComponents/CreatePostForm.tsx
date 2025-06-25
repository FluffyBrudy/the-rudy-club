"use client";

import type React from "react";

import { useState, useRef } from "react";
import { ImageIcon, Smile, MapPin, X, Loader2 } from "lucide-react";
import { useAppStore } from "@/app/store/appStore";
import Image from "next/image";
import apiClient from "@/lib/api/apiclient";

export default function CreatePostForm() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useAppStore((state) => state.user);
  const addPost = useAppStore((state) => state.addPost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && previewImages.length === 0) return;

    setIsSubmitting(true);

    try {
      const postData = {
        textContent: content.trim() || undefined,
        mediaContent: previewImages.length > 0 ? previewImages : undefined,
      };

      const response = await apiClient.posts.createPost(postData);

      if (response.data) {
        addPost(response.data);
        setContent("");
        setPreviewImages([]);
      } else {
        console.error("Failed to create post:", response.error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviewImages: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviewImages.push(e.target.result as string);
          if (newPreviewImages.length === files.length) {
            setPreviewImages((prev) => [...prev, ...newPreviewImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="p-5 rounded-xl mb-6"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
              {user?.profilePicture ? (
                <Image
                  src={user.profilePicture || "/placeholder.svg"}
                  alt={user.username}
                  className="w-full h-full object-cover"
                  width={48}
                  height={48}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  {user?.username.charAt(0).toUpperCase() || "A"}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-2 min-h-[80px] resize-none rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                color: "var(--text-color)",
              }}
            />

            {previewImages.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {previewImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden h-32"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-200"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="p-2 rounded-full hover:bg-accent/50 transition-colors duration-200"
                >
                  <ImageIcon
                    size={20}
                    style={{ color: "var(--primary-color)" }}
                  />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-accent/50 transition-colors duration-200"
                >
                  <Smile size={20} style={{ color: "var(--primary-color)" }} />
                </button>

                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-accent/50 transition-colors duration-200"
                >
                  <MapPin size={20} style={{ color: "var(--primary-color)" }} />
                </button>
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  (!content.trim() && previewImages.length === 0)
                }
                className="px-4 py-2 rounded-full text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <span>Post</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
