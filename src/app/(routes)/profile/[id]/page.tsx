"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/api/apiclient";
import PostCard from "@/app/components/PostComponents/PostCard";
import { Loader2 } from "lucide-react";
import FriendsSuggestion from "@/app/components/SharableComponents/FriendsSuggestion";
import { PostResponse } from "@/types/apiResponseTypes";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/TabComponents";
import Image from "next/image";
import MediaLightbox from "@/app/components/ui/MediaLightbox";
import { useAppStore } from "@/app/store/appStore";
import FollowButton from "@/app/components/SharableComponents/FollowUserButton";

interface FallbackUserProps {
  fallbackUser: {
    username: string;
    profilePicture: string;
    description: string;
    userId: string;
  };
}

function ProfileInfo({ fallbackUser }: FallbackUserProps) {
  const [user, setUser] =
    useState<FallbackUserProps["fallbackUser"]>(fallbackUser);
  const loggedUserId = useAppStore((state) => state.user?.userId);

  useEffect(() => {
    apiClient.preference.fetchLoggedUserProfile(user.userId).then((res) => {
      const { username, picture, bio, userId } = res.data!;
      setUser({ username, profilePicture: picture, description: bio, userId });
    });
  }, [user.userId]);

  return (
    <div className="rounded-xl shadow p-4 md:p-6 mb-6 flex flex-wrap md:flex-nowrap gap-6 bg-[var(--card-bg)] border border-[var(--border-color)]">
      <div className="flex flex-1 basis-full md:basis-1/2 items-center gap-4">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-[var(--muted-color)] flex items-center justify-center flex-shrink-0">
          {user?.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt="Profile"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl text-[var(--muted-color)]">
              ?
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--text-color)] truncate">
            {user?.username || "User"}
          </h1>
          <p className="text-[var(--muted-color)] mt-1 line-clamp-2 text-sm md:text-base">
            {user?.description || "no description yet"}
          </p>
        </div>
      </div>

      {user.userId !== loggedUserId && (
        <div className="flex flex-1 basis-full md:basis-1/2 items-center">
          <FollowButton userId={user.userId} />
        </div>
      )}
    </div>
  );
}

function MediaGallery({ mediaContent }: { mediaContent: string[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openLightbox = (url: string) => {
    setSelectedImage(url);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="rounded-xl shadow p-4 bg-[var(--card-bg)] border border-[var(--border-color)] mb-4">
      <h3 className="font-semibold mb-2 text-[var(--text-color)]">Media</h3>
      {mediaContent.length === 0 ? (
        <div className="text-[var(--muted-color)]">No media content.</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {mediaContent.map((url, idx) => (
            <div
              key={idx}
              className="relative w-full aspect-[4/3] bg-[var(--muted-color)] rounded border border-[var(--border-color)] overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(url)}
              tabIndex={0}
              aria-label="Expand image"
            >
              <Image
                src={url}
                alt={`media-${idx}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, 300px"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
      <MediaLightbox
        open={lightboxOpen}
        imageUrl={selectedImage || ""}
        onClose={closeLightbox}
        alt="Expanded media"
      />
    </div>
  );
}

function PostsList({ posts }: { posts: PostResponse[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-[var(--text-color)]">
        Posts
      </h2>
      {posts.length === 0 ? (
        <div className="text-[var(--muted-color)]">No posts yet.</div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.postId}
            post={post}
            handleProfileClick={undefined}
          />
        ))
      )}
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.id as string;

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = posts[0]?.username
    ? {
        username: posts[0].username,
        profilePicture: posts[0].profilePicture,
        description: "No description yet.",
        userId: posts[0].authorId,
      }
    : null;

  const mediaContent: string[] = posts
    .flatMap((post) => post.content.mediaContent || [])
    .filter(Boolean);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    apiClient.posts
      .fetchPostByUserId(userId)
      .then((res) => {
        if (res.error) setError(res.error);
        else setPosts(res.data || []);
      })
      .catch((err) => setError((err as { error: string }).error))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[var(--primary-color)]" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-[var(--primary-color)] mt-8">
        Failed to load profile: {error}
      </div>
    );

  return (
    <div className="w-[min(1200px,95vw)] mx-auto mt-8">
      <ProfileInfo fallbackUser={user!} />

      <div className="hidden lg:grid grid-cols-[320px_1fr] gap-8">
        <div className="flex flex-col gap-4">
          <MediaGallery mediaContent={mediaContent} />
          <FriendsSuggestion />
        </div>

        <div>
          <PostsList posts={posts} />
        </div>
      </div>

      <div className="lg:hidden flex flex-col gap-4">
        <Tabs defaultValue="posts">
          <TabsList className="mb-2 w-full flex">
            <TabsTrigger value="posts" className="flex-1">
              Posts
            </TabsTrigger>
            <TabsTrigger value="media" className="flex-1">
              Media
            </TabsTrigger>
            <TabsTrigger value="suggestion" className="flex-1">
              Who to Follow
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <PostsList posts={posts} />
          </TabsContent>
          <TabsContent value="media">
            <MediaGallery mediaContent={mediaContent} />
          </TabsContent>
          <TabsContent value="suggestion">
            <FriendsSuggestion />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
