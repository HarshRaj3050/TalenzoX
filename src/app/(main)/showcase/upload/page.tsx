"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const maxImageBytes = 10 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export default function ShowcaseUploadPage() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (previewUrl) return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const selectMedia = (file: File | undefined) => {
    if (!file) return;
    if (!allowedImageTypes.includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > maxImageBytes) {
      setError("Choose an image smaller than 10 MB.");
      return;
    }
    setError("");
    setPreviewUrl(URL.createObjectURL(file));
    setMedia(file);
  };

  const publishPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!caption.trim() && !media) {
      setError("Write a caption or choose an image for your post.");
      return;
    }
    if (caption.trim().length > 2000) {
      setError("Captions must be 2000 characters or fewer.");
      return;
    }

    setIsPublishing(true);
    setError("");
    try {
      const formData = new FormData();
      formData.set("caption", caption);
      if (media) formData.set("media", media);

      const response = await fetch("/api/showcase/posts", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "We could not publish your post.");
      }

      window.location.assign("/showcase/feed");
    } catch (publishError) {
      console.error("Failed to publish Showcase post:", publishError);
      setError(
        publishError instanceof Error
          ? publishError.message
          : "We could not publish your post. Please try again.",
      );
      setIsPublishing(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-[#f7f8fc]">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-white/90 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <h1 className="text-sm font-semibold text-slate-900">Create a post</h1>
        </header>
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 sm:p-6 lg:p-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Share with the community</h2>
            <p className="mt-1 text-sm text-slate-500">
              Share an update, a project, or an image.
            </p>
          </div>

          <form
            onSubmit={publishPost}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <label
              htmlFor="post-caption"
              className="block text-sm font-semibold text-slate-800"
            >
              Caption
            </label>
            <textarea
              id="post-caption"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              maxLength={2000}
              rows={6}
              placeholder="What are you working on?"
              className="w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
            />
            <p className="text-right text-xs text-slate-500">
              {caption.length}/2000
            </p>

            {previewUrl ? (
              <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={previewUrl}
                  alt="Selected post image preview"
                  fill
                  unoptimized
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl("");
                    setMedia(null);
                  }}
                  aria-label="Remove selected image"
                  className="absolute right-2 top-2 rounded-full bg-white p-2 text-slate-700 shadow hover:bg-slate-100"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:bg-slate-100">
                <ImagePlus className="size-6 text-slate-500" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-700">
                  Add an image
                </span>
                <span className="text-xs text-slate-500">
                  JPG, PNG, or WebP, up to 10 MB
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => selectMedia(event.target.files?.[0])}
                />
              </label>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                nativeButton={false}
                render={<Link href="/showcase/feed" />}
                variant="outline"
                className="rounded-full"
                disabled={isPublishing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPublishing}
                className="rounded-full bg-slate-700 text-white hover:bg-slate-800"
              >
                {isPublishing ? "Publishing…" : "Publish post"}
              </Button>
            </div>
          </form>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
