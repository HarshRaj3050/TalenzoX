"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Check,
  FolderKanban,
  MapPin,
  Pencil,
  Plus,
  Settings,
  Share2,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShowcasePostList } from "@/app/(main)/showcase/_components/showcase-post-list";

export function ProfileBanner({
  displayName,
  summary,
  location,
  characterImage,
  bannerColor,
  onEditProfile,
  onEditTheme,
}: {
  displayName: string;
  summary: string;
  location: string;
  characterImage: string;
  bannerColor: string;
  onEditProfile: () => void;
  onEditTheme: () => void;
}) {
  return (
    <section
      className="relative isolate min-h-90 overflow-hidden rounded-[1.75rem] text-white shadow-[0_20px_60px_-38px_rgba(15,23,42,0.4)] sm:min-h-[340px]"
      style={{ backgroundColor: bannerColor }}
    >
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-[72%] w-[58%] sm:h-full sm:w-[48%]">
        <Image
          src={characterImage}
          alt="Selected profile character"
          fill
          priority
          unoptimized
          sizes="(max-width: 640px) 55vw, 430px"
          className="object-contain object-bottom sm:object-right-bottom"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/20 via-black/10 to-transparent" />
      <div className="relative z-10 flex min-h-[360px] flex-col items-start p-6 sm:min-h-[340px] sm:max-w-[68%] sm:p-10">
        <p className="text-xs font-semibold tracking-[0.18em] text-blue-100">
          SHOWCASE PROFILE
        </p>
        <h1 className="mt-3 max-w-full break-words text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Hi, {displayName}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-blue-50 sm:text-base">
          {summary}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-blue-100 sm:text-sm">
          <span>Software Engineer</span>
          {location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {location}
            </span>
          )}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <Button
            type="button"
            onClick={onEditProfile}
            className="rounded-full bg-white px-5 font-semibold text-[#345879] hover:bg-blue-50"
          >
            <Pencil />
            Edit profile
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/settings" />}
            variant="outline"
            className="rounded-full border-white/70 bg-white/10 px-5 text-white hover:bg-white/20 hover:text-white"
          >
            <Settings />
            Settings
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onEditTheme}
            className="rounded-full border-white/70 bg-white/10 px-5 text-white hover:bg-white/20 hover:text-white"
          >
            <Pencil />
            Edit profile theme
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ProfileBio({
  bio,
  onEdit,
}: {
  bio: string;
  onEdit: () => void;
}) {
  return (
    <section
      aria-labelledby="profile-bio-heading"
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="profile-bio-heading"
          className="text-base font-bold text-slate-900"
        >
          About me
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-slate-600 hover:text-slate-900"
        >
          <Pencil />
          Edit
        </Button>
      </div>
      <p className="mt-2 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-slate-600">
        {bio}
      </p>
    </section>
  );
}

export function ProfileActivity() {
  return (
    <section
      aria-labelledby="profile-activity-heading"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div>
            <h2
              id="profile-activity-heading"
              className="text-lg font-bold text-slate-900"
            >
              Activity
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            nativeButton={false}
            render={<Link href="/showcase/upload" />}
            variant="outline"
            className="h-8 rounded-full border-sky-600 px-3 text-xs font-semibold text-sky-700 hover:bg-sky-50 hover:text-sky-800"
          >
            Create a post
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/user-details" />}
            variant="ghost"
            size="icon"
            aria-label="Edit activity"
            className="size-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-5 pb-5 pt-3 sm:px-6">
        {["Posts", "Comments", "Videos", "Images"].map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              index === 0
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-slate-300 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <ShowcasePostList limit={2} compact ownPostsOnly />
      <Link
        href="/showcase/feed"
        className="flex items-center justify-center gap-2 border-t border-slate-200 px-4 py-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        Show all
        <ArrowRight className="size-4" />
      </Link>
    </section>
  );
}

export function ProfileProjects() {
  return (
    <section
      aria-labelledby="profile-projects-heading"
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="profile-projects-heading"
          className="text-lg font-bold text-slate-900"
        >
          Projects
        </h2>
        <Button
          nativeButton={false}
          render={<Link href="/showcase/upload" />}
          variant="outline"
          className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        >
          Add project
        </Button>
      </div>
      <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <FolderKanban className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-semibold text-slate-800">
          No projects yet
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Add a project to showcase your work and experience.
        </p>
      </div>
    </section>
  );
}

export function ProfileSkills({
  skills,
  isAddingSkill,
  skillDraft,
  skillError,
  onStartAdding,
  onDraftChange,
  onSave,
  onDelete,
  onCancel,
}: {
  skills: string[];
  isAddingSkill: boolean;
  skillDraft: string;
  skillError: string;
  onStartAdding: () => void;
  onDraftChange: (value: string) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (index: number) => void;
  onCancel: () => void;
}) {
  return (
    <section
      aria-labelledby="profile-skills-heading"
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Star className="size-5 text-slate-500" aria-hidden="true" />
          <h2
            id="profile-skills-heading"
            className="text-lg font-bold text-slate-900"
          >
            Skills
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          onClick={onStartAdding}
        >
          <Plus />
          Add skill
        </Button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {skills.map((skill, index) => (
          <div
            key={skill}
            className={`inline-flex items-center gap-1 rounded-full py-1 pl-4 pr-1 text-sm font-semibold ${
              index % 2 === 0
                ? "bg-slate-100 text-slate-700"
                : "bg-zinc-100 text-zinc-700"
            }`}
          >
            <span>{skill}</span>
            <button
              type="button"
              aria-label={`Delete ${skill}`}
              onClick={() => onDelete(index)}
              className="rounded-full p-1.5 transition hover:bg-black/5"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      {skillError && !isAddingSkill && (
        <p role="alert" className="mt-3 text-xs text-red-600">
          {skillError}
        </p>
      )}
      {isAddingSkill && (
        <form onSubmit={onSave} className="mt-4 flex flex-wrap items-start gap-2">
          <div className="min-w-48 flex-1">
            <input
              autoFocus
              value={skillDraft}
              onChange={(event) => onDraftChange(event.target.value)}
              maxLength={40}
              aria-label="Skill name"
              placeholder="Enter a skill"
              className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
            />
            {skillError && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {skillError}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="rounded-lg bg-slate-700 text-white hover:bg-slate-800"
          >
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-lg"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </form>
      )}
    </section>
  );
}

export function ProfileShortcuts({
  isAvailable,
  onAvailabilityChange,
}: {
  isAvailable: boolean;
  onAvailabilityChange: () => void;
}) {
  return (
    <section
      aria-label="Profile shortcuts"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <button
        type="button"
        aria-pressed={isAvailable}
        onClick={onAvailabilityChange}
        className="group flex min-h-28 items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
      >
        <span>
          <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span
              className={`size-2.5 rounded-full ${
                isAvailable ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
            {isAvailable ? "Ready for work" : "Not available"}
          </span>
          <span className="mt-1.5 block max-w-52 text-xs leading-relaxed text-slate-500">
            {isAvailable
              ? "Your profile is visible to people looking for your skills."
              : "Your profile is hidden from new opportunities."}
          </span>
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
          {isAvailable ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-4" aria-hidden="true" />
          )}
        </span>
      </button>
      <Link
        href="/showcase/feed"
        className="group flex min-h-28 items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
      >
        <span>
          <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Share2 className="size-4 text-violet-600" aria-hidden="true" />
            Share posts
          </span>
          <span className="mt-1.5 block max-w-52 text-xs leading-relaxed text-slate-500">
            Share what you are working on with the community.
          </span>
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700 transition group-hover:bg-violet-100">
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </Link>
      <Link
        href="/showcase/upload"
        className="group flex min-h-28 items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md sm:col-span-2 lg:col-span-1"
      >
        <span>
          <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Pencil className="size-4 text-sky-600" aria-hidden="true" />
            Update your profile
          </span>
          <span className="mt-1.5 block max-w-52 text-xs leading-relaxed text-slate-500">
            Keep your profile up to date so people can get to know you.
          </span>
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700 transition group-hover:bg-sky-100">
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </Link>
    </section>
  );
}
