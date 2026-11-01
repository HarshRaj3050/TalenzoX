"use client";

import Image from "next/image";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  bannerColors,
  characterImages,
  type ThemeDraft,
} from "./showcase-profile-data";

export function EditThemeDialog({
  draft,
  setDraft,
  isSaving,
  isProcessingPhoto,
  error,
  onClose,
  onAddPhoto,
  onSubmit,
}: {
  draft: ThemeDraft;
  setDraft: Dispatch<SetStateAction<ThemeDraft>>;
  isSaving: boolean;
  isProcessingPhoto: boolean;
  error: string;
  onClose: () => void;
  onAddPhoto: (file: File | undefined) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-theme-title"
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="edit-profile-theme-title"
              className="text-xl font-bold text-slate-950"
            >
              Edit profile theme
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose the banner character and background color.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close profile theme editor"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-700">
              Banner character
            </legend>
            <div className="flex flex-wrap gap-3">
              {[
                ...characterImages,
                ...(draft.characterImage &&
                !characterImages.some(
                  (image) => image.src === draft.characterImage,
                )
                  ? [{ src: draft.characterImage, name: "Your photo" }]
                  : []),
              ].map((image) => (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`Choose ${image.name}`}
                  aria-pressed={draft.characterImage === image.src}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      characterImage: image.src,
                    }))
                  }
                  className={`flex w-28 flex-col items-center overflow-hidden rounded-xl border-2 transition ${
                    draft.characterImage === image.src
                      ? "border-slate-600 ring-2 ring-slate-300"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <span className="relative h-24 w-full bg-[#55799d]">
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      unoptimized
                      sizes="112px"
                      className="object-contain object-bottom"
                    />
                  </span>
                  <span className="w-full bg-white px-2 py-1.5 text-xs font-medium text-slate-700">
                    {image.name}
                  </span>
                </button>
              ))}
              <label className="flex w-28 cursor-pointer flex-col items-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 text-slate-600 transition hover:border-slate-500 hover:text-slate-800">
                <span className="flex h-24 w-full flex-col items-center justify-center gap-2 bg-slate-50">
                  <ImagePlus className="size-6" aria-hidden="true" />
                  <span className="text-xs font-semibold">
                    {isProcessingPhoto ? "Processing..." : "Add photo"}
                  </span>
                </span>
                <span className="w-full bg-white px-2 py-1.5 text-center text-xs text-slate-500">
                  JPG, PNG, WebP
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={isProcessingPhoto || isSaving}
                  onChange={(event) => {
                    onAddPhoto(event.currentTarget.files?.[0]);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-700">
              Banner color
            </legend>
            <div className="flex flex-wrap gap-3">
              {bannerColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  aria-label={`Choose ${color.name} banner`}
                  aria-pressed={draft.bannerColor === color.value}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      bannerColor: color.value,
                    }))
                  }
                  className={`size-10 rounded-full border-2 transition ${
                    draft.bannerColor === color.value
                      ? "border-slate-900 ring-2 ring-slate-300"
                      : "border-white shadow hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save theme"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export interface ProfileDraft {
  name: string;
  bio: string;
  location: string;
  summary: string;
}

export function EditProfileDialog({
  draft,
  setDraft,
  isSaving,
  error,
  onClose,
  onSubmit,
}: {
  draft: ProfileDraft;
  setDraft: Dispatch<SetStateAction<ProfileDraft>>;
  isSaving: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !isSaving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="edit-profile-title"
              className="text-xl font-bold text-slate-950"
            >
              Edit profile
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update the details shown on your Showcase profile.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close edit profile"
            disabled={isSaving}
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="showcase-profile-name"
              className="text-sm font-semibold text-slate-700"
            >
              Name
            </label>
            <input
              id="showcase-profile-name"
              autoFocus
              required
              maxLength={80}
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({ ...current, name: event.target.value }))
              }
              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="showcase-profile-location"
              className="text-sm font-semibold text-slate-700"
            >
              Location
            </label>
            <input
              id="showcase-profile-location"
              maxLength={120}
              value={draft.location}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
              placeholder="City, country"
              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="showcase-profile-summary"
              className="text-sm font-semibold text-slate-700"
            >
              Profile intro
            </label>
            <textarea
              id="showcase-profile-summary"
              maxLength={180}
              rows={2}
              value={draft.summary}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  summary: event.target.value,
                }))
              }
              className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm leading-6 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
            <p className="text-right text-xs text-slate-400">
              {draft.summary.length}/180
            </p>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="showcase-profile-bio"
              className="text-sm font-semibold text-slate-700"
            >
              About me
            </label>
            <textarea
              id="showcase-profile-bio"
              maxLength={500}
              rows={5}
              value={draft.bio}
              onChange={(event) =>
                setDraft((current) => ({ ...current, bio: event.target.value }))
              }
              className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm leading-6 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
            <p className="text-right text-xs text-slate-400">
              {draft.bio.length}/500
            </p>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
