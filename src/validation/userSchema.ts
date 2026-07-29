import { z } from "zod";

const email = z
  .string()
  .trim()
  .email("Please enter a valid email address");

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password cannot exceed 100 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const name = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name cannot exceed 50 characters");


export const signupSchema = z.object({
  name,
  email,
  password,
});


export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});


export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;