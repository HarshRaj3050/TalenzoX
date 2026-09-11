export type AuthAudience = "learner" | "teacher"

export const AUTH_STORAGE_KEYS: Record<AuthAudience, string> = {
  learner: "talenzo-learner-auth-token",
  teacher: "talenzo-teacher-auth-token",
}