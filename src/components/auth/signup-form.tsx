"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { signupSchema } from "@/validation/userSchema";

type SignupFormProps = React.ComponentProps<"form">;

type FormErrors = {
  name?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
};

export function SignupForm({ className, ...props }: SignupFormProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove the error for this field when the user starts typing again.
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});
    setServerError("");

    try {
      const result = signupSchema.safeParse(formData);

      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          data: {
            name: result.data.name,
          },
          emailRedirectTo: `${window.location.origin}/user-details`,
        },
      });

      if (error) {
        console.error("Supabase signup error:", error);
        setServerError(error.message);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        setServerError("Account creation failed. Please try again.");
        return;
      }

      const { error: insertError } = await supabase.from("user_details").insert([
        {
          auth_uid: userId,
          name: result.data.name,
          email: result.data.email,
          onGoingProcess: false,
        },
      ] as never);

      if (insertError) {
        console.error("User profile insert error:", insertError);

        setServerError(
          "Your account was created, but your profile could not be saved.",
        );

        return;
      }

      router.push("/auth/login");
    } catch (error) {
      console.error("Signup error:", error);

      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setServerError("");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/user-details`,
      },
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    if (data.url) {
      window.location.assign(data.url);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>

          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>

          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Harsh Raj"
            autoComplete="name"
            required
            disabled={loading}
            className="bg-background"
            value={formData.name}
            onChange={handleChange}
          />

          {errors.name?.[0] && (
            <p className="text-sm text-red-500">{errors.name[0]}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            required
            disabled={loading}
            className="bg-background"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email?.[0] && (
            <p className="text-sm text-red-500">{errors.email[0]}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            disabled={loading}
            className="bg-background"
            value={formData.password}
            onChange={handleChange}
          />

          {errors.password?.[0] && (
            <p className="text-sm text-red-500">{errors.password[0]}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>

          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            disabled={loading}
            className="bg-background"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {errors.confirmPassword?.[0] && (
            <p className="text-sm text-red-500">{errors.confirmPassword[0]}</p>
          )}
        </Field>

        {serverError && (
          <p className="text-center text-sm text-red-500">{serverError}</p>
        )}

        <Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            disabled={loading}
            onClick={handleGoogleSignup}
            className="w-full"
          >
            <FcGoogle />
            Sign up with Google
          </Button>

          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
