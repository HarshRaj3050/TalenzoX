"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  defaultBio,
  defaultCharacterImage,
  defaultSummary,
  maxSourceImageBytes,
  maxUploadedImageBytes,
  bannerColors,
  type ShowcaseUser,
  type ThemeDraft,
} from "./showcase-profile-data";
import {
  EditProfileDialog,
  EditThemeDialog,
} from "./showcase-profile-dialogs";
import {
  ProfileActivity,
  ProfileBanner,
  ProfileBio,
  ProfileProjects,
  ProfileShortcuts,
  ProfileSkills,
} from "./showcase-profile-sections";
export function ShowcaseProfile() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [user, setUser] = useState<ShowcaseUser | null>(null);
  const [bio, setBio] = useState(defaultBio);
  const [summary, setSummary] = useState(defaultSummary);
  const [characterImage, setCharacterImage] = useState<string>(
    defaultCharacterImage,
  );
  const [bannerColor, setBannerColor] = useState<string>(bannerColors[0].value);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [themeDraft, setThemeDraft] = useState<ThemeDraft>({
    characterImage: defaultCharacterImage,
    bannerColor: bannerColors[0].value,
  });
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [themeError, setThemeError] = useState("");
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    name: "",
    bio: defaultBio,
    location: "",
    summary: defaultSummary,
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillDraft, setSkillDraft] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillError, setSkillError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const response = await fetch("/api/getUser");
        if (!response.ok) {
          throw new Error(`Failed to load profile (${response.status})`);
        }

        const profile: ShowcaseUser = await response.json();
        if (isMounted) {
          setUser(profile);
          if (Array.isArray(profile.skills)) setSkills(profile.skills);
          if (typeof profile.bio === "string") setBio(profile.bio);
          if (typeof profile.summary === "string") setSummary(profile.summary);
          if (
            typeof profile.characterImage === "string"
          ) {
            setCharacterImage(profile.characterImage);
          }
          if (typeof profile.bannerColor === "string") {
            setBannerColor(profile.bannerColor);
          }
        }
      } catch (error) {
        console.error("Failed to load showcase profile:", error);
      }
    };

    void loadUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayName =
    user?.full_name?.trim() ||
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Your profile";
  const location =
    user?.location !== null && user?.location !== undefined
      ? user.location.trim()
      : user?.address?.trim() ||
        [user?.city?.trim(), user?.state?.trim()].filter(Boolean).join(", ");

  const openThemeDialog = () => {
    setThemeDraft({ characterImage, bannerColor });
    setThemeError("");
    setIsThemeDialogOpen(true);
  };

  const addThemePhoto = async (file: File | undefined) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setThemeError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > maxSourceImageBytes) {
      setThemeError("Choose an image smaller than 15 MB.");
      return;
    }

    setIsProcessingPhoto(true);
    setThemeError("");
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not process this image.");

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();

      let quality = 0.82;
      let blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
      while (blob && blob.size > maxUploadedImageBytes && quality > 0.35) {
        quality -= 0.12;
        blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", quality),
        );
      }

      if (!blob || blob.size > maxUploadedImageBytes) {
        throw new Error("This photo is too large to use. Choose a smaller image.");
      }

      const photoData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          typeof reader.result === "string"
            ? resolve(reader.result)
            : reject(new Error("Could not read the selected photo."));
        reader.onerror = () =>
          reject(new Error("Could not read the selected photo."));
        reader.readAsDataURL(blob);
      });

      setThemeDraft((current) => ({ ...current, characterImage: photoData }));
    } catch (error) {
      setThemeError(
        error instanceof Error ? error.message : "Could not process this photo.",
      );
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const saveTheme = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingTheme(true);
    setThemeError("");
    try {
      const response = await fetch("/api/getUser", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(themeDraft),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "We could not save your profile theme.");
      }

      setCharacterImage(result.characterImage);
      setBannerColor(result.bannerColor);
      setIsThemeDialogOpen(false);
    } catch (error) {
      console.error("Failed to save showcase profile theme:", error);
      setThemeError(
        error instanceof Error
          ? error.message
          : "We could not save your profile theme. Please try again.",
      );
    } finally {
      setIsSavingTheme(false);
    }
  };

  const openProfileDialog = () => {
    setProfileDraft({
      name:
        user?.full_name?.trim() ||
        user?.name?.trim() ||
        user?.email?.split("@")[0] ||
        "",
      bio,
      location,
      summary,
    });
    setProfileError("");
    setIsProfileDialogOpen(true);
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedProfile = {
      name: profileDraft.name.trim(),
      bio: profileDraft.bio.trim(),
      location: profileDraft.location.trim(),
      summary: profileDraft.summary.trim(),
    };

    if (!updatedProfile.name) {
      setProfileError("Name is required.");
      return;
    }

    setIsSavingProfile(true);
    setProfileError("");
    try {
      const response = await fetch("/api/getUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "We could not save your profile.");
      }

      setUser((current) => ({
        ...current,
        ...result,
      }));
      setBio(updatedProfile.bio);
      setSummary(updatedProfile.summary);
      setIsProfileDialogOpen(false);
    } catch (error) {
      console.error("Failed to save showcase profile:", error);
      setProfileError(
        error instanceof Error
          ? error.message
          : "We could not save your profile. Please try again.",
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const saveSkill = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextSkill = skillDraft.trim();
    if (!nextSkill) return;

    const isDuplicate = skills.some(
      (skill) =>
        skill.toLocaleLowerCase() === nextSkill.toLocaleLowerCase(),
    );
    if (isDuplicate) {
      setSkillError("That skill is already in your list.");
      return;
    }

    const updatedSkills = [...skills, nextSkill];
    try {
      const response = await fetch("/api/getUser", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: updatedSkills }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "We could not save your skills.");
      }

      setSkills(result.skills);
      setSkillDraft("");
      setIsAddingSkill(false);
      setSkillError("");
    } catch (error) {
      console.error("Failed to save Showcase skill:", error);
      setSkillError(
        error instanceof Error
          ? error.message
          : "We could not save your skills. Please try again.",
      );
    }
  };

  const deleteSkill = async (index: number) => {
    const updatedSkills = skills.filter((_, skillIndex) => skillIndex !== index);
    setSkillError("");
    try {
      const response = await fetch("/api/getUser", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: updatedSkills }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "We could not remove this skill.");
      }
      setSkills(result.skills);
    } catch (error) {
      console.error("Failed to delete Showcase skill:", error);
      setSkillError(
        error instanceof Error
          ? error.message
          : "We could not remove this skill. Please try again.",
      );
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-[#f7f8fc]">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-white/90 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden sm:block">
                <BreadcrumbLink href="/home">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/showcase/profile">Showcase</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <ProfileBanner
            displayName={displayName}
            summary={summary}
            location={location}
            characterImage={characterImage}
            bannerColor={bannerColor}
            onEditProfile={openProfileDialog}
            onEditTheme={openThemeDialog}
          />
          <ProfileBio bio={bio} onEdit={openProfileDialog} />
          <ProfileActivity />
          <ProfileProjects />
          <ProfileSkills
            skills={skills}
            isAddingSkill={isAddingSkill}
            skillDraft={skillDraft}
            skillError={skillError}
            onStartAdding={() => {
              setIsAddingSkill(true);
              setSkillDraft("");
              setSkillError("");
            }}
            onDraftChange={(value) => {
              setSkillDraft(value);
              setSkillError("");
            }}
            onSave={saveSkill}
            onDelete={deleteSkill}
            onCancel={() => {
              setIsAddingSkill(false);
              setSkillDraft("");
              setSkillError("");
            }}
          />
          <ProfileShortcuts
            isAvailable={isAvailable}
            onAvailabilityChange={() =>
              setIsAvailable((current) => !current)
            }
          />
        </main>

        {isThemeDialogOpen && (
          <EditThemeDialog
            draft={themeDraft}
            setDraft={setThemeDraft}
            isSaving={isSavingTheme}
            isProcessingPhoto={isProcessingPhoto}
            error={themeError}
            onClose={() => setIsThemeDialogOpen(false)}
            onAddPhoto={addThemePhoto}
            onSubmit={saveTheme}
          />
        )}
        {isProfileDialogOpen && (
          <EditProfileDialog
            draft={profileDraft}
            setDraft={setProfileDraft}
            isSaving={isSavingProfile}
            error={profileError}
            onClose={() => setIsProfileDialogOpen(false)}
            onSubmit={saveProfile}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
