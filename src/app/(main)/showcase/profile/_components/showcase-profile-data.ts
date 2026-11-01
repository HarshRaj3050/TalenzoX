export interface ShowcaseUser {
  full_name?: string | null;
  name?: string | null;
  email?: string | null;
  location?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  bio?: string | null;
  summary?: string | null;
  characterImage?: string | null;
  bannerColor?: string | null;
  skills?: string[];
}

export interface ThemeDraft {
  characterImage: string;
  bannerColor: string;
}

export const defaultBio =
  "I’m a curious software engineer who enjoys turning big ideas into simple, thoughtful digital experiences. When I’m away from my keyboard, I’m usually exploring new design tools, learning something new, or sharing inspiration with the community.";
export const defaultSummary =
  "Software engineer passionate about turning ideas into thoughtful digital experiences.";
export const defaultCharacterImage = "/showcase/profile/cat_girl.png";
export const characterImages = [
  { src: "/showcase/profile/cat_girl.png", name: "Cat girl" },
  { src: "/showcase/profile/zenitsu.png", name: "Zenitsu" },
  { src: "/showcase/profile/muichiroTokito.png", name: "Muichiro Tokito" },
] as const;
export const maxUploadedImageBytes = 250_000;
export const maxSourceImageBytes = 15_000_000;
export const bannerColors = [
  { name: "Ocean blue", value: "#55799d" },
  { name: "Violet", value: "#7656a8" },
  { name: "Teal", value: "#018D9E" },
  { name: "Rose", value: "#a85870" },
  { name: "Yellow", value: "#FFBF00" },
] as const;

const uploadedImagePrefix = "data:image/jpeg;base64,";

export function isUploadedCharacterImage(value: string) {
  if (!value.startsWith(uploadedImagePrefix)) return false;
  const encoded = value.slice(uploadedImagePrefix.length);
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) return false;
  const padding = encoded.endsWith("==") ? 2 : encoded.endsWith("=") ? 1 : 0;
  return Math.floor((encoded.length * 3) / 4) - padding <= maxUploadedImageBytes;
}
