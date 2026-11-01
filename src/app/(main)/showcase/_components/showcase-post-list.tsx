"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ImagePlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShowcasePost {
  id: string;
  auth_uid: string;
  author_name: string;
  caption: string;
  media_url: string | null;
  created_at: string;
}

export function ShowcasePostList({
  limit,
  compact = false,
  ownPostsOnly = false,
}: {
  limit?: number;
  compact?: boolean;
  ownPostsOnly?: boolean;
}) {
  const [posts, setPosts] = useState<ShowcasePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadPosts = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(
          ownPostsOnly ? "/api/showcase/posts?scope=mine" : "/api/showcase/posts",
          {
          signal: controller.signal,
          },
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "We could not load Showcase posts.");
        }
        setPosts(result.posts as ShowcasePost[]);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "We could not load Showcase posts.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadPosts();
    return () => controller.abort();
  }, [ownPostsOnly]);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  const visiblePosts = typeof limit === "number" ? posts.slice(0, limit) : posts;

  if (isLoading) {
    return (
      <p className="px-5 py-10 text-center text-sm text-slate-500 sm:px-6">
        Loading posts…
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="px-5 py-10 text-center text-sm text-red-600 sm:px-6">
        {error}
      </p>
    );
  }

  if (visiblePosts.length === 0) {
    return (
      <div className="mx-5 mb-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center sm:mx-6">
        <ImagePlus className="mx-auto size-6 text-slate-500" aria-hidden="true" />
        <p className="mt-2 text-sm font-semibold text-slate-800">No posts yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Share something you&apos;re working on to get started.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/showcase/upload" />}
          variant="outline"
          className="mt-4 rounded-full border-slate-300"
        >
          Create a post
        </Button>
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2 sm:px-6"
          : "space-y-3 px-5 pb-5 sm:px-6"
      }
    >
      {visiblePosts.map((post, index) => (
        <article
          key={post.id}
          className={`min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white ${
            compact && index > 0 ? "hidden sm:block" : ""
          }`}
        >
          <div className={`flex items-center justify-between gap-3 ${compact ? "p-3" : "p-4"}`}>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {post.author_name}
              </p>
              <time
                dateTime={post.created_at}
                className="text-xs text-slate-500"
              >
                {new Date(post.created_at).toLocaleString()}
              </time>
            </div>
          </div>
          {post.caption && (
            <p className={`whitespace-pre-wrap text-sm leading-6 text-slate-700 ${compact ? "px-3 pb-3" : "px-4 pb-4"}`}>
              {post.caption}
            </p>
          )}
          {post.media_url && (
            <div className={`w-full bg-slate-100 ${compact ? "relative aspect-square" : ""}`}>
              <button
                type="button"
                onClick={() => {
                  setSelectedImage({
                    src: post.media_url!,
                    alt: `Image shared by ${post.author_name}`,
                  });
                }}
                aria-label={`View image shared by ${post.author_name}`}
                className={
                  compact
                    ? "absolute inset-0 cursor-zoom-in"
                    : "block w-full cursor-zoom-in"
                }
              >
                <Image
                  src={post.media_url}
                  alt={`Image shared by ${post.author_name}`}
                  {...(compact
                    ? { fill: true }
                    : { width: 1600, height: 1200 })}
                  unoptimized
                  className={
                    compact
                      ? "object-contain"
                      : "block h-auto w-full object-contain"
                  }
                  sizes={
                    compact
                      ? "(max-width: 640px) 50vw, 384px"
                      : "(max-width: 640px) 100vw, 768px"
                  }
                />
              </button>
            </div>
          )}
        </article>
      ))}
      {typeof limit === "number" && posts.length > limit && !compact && (
        <Link
          href="/showcase/feed"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          Show all posts
          <ArrowRight className="size-4" />
        </Link>
      )}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            className="flex max-h-full w-full max-w-6xl flex-col gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                aria-label="Close image viewer"
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="relative min-h-0 flex-1 overflow-auto">
              <div className="flex min-h-full min-w-full items-center justify-center">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1600}
                  height={1200}
                  unoptimized
                  className="max-h-[calc(100vh-7rem)] w-auto max-w-full object-contain"
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
