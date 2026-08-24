"use client";
import { useState } from "react";

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
import { useRouter } from "next/navigation";
import { loginSchema } from "@/validation/userSchema";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

import api from "@/lib/axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
    auth?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = loginSchema.safeParse(formData);

      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        return;
      }

      setErrors({});

      const { data, error } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        setErrors({
          auth: "Invalid email or password.",
        });
        return;
      }

      try {
        await api.post("/redis", {
          user: data.user,
          session: data.session,
        });
        router.push("/home");
      } catch (redisError) {
        console.error(redisError);
        setErrors({
          auth: "Login succeeded, but we could not sync your session data.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center ">
          <h1 className="text-2xl font-bold ">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          {errors.auth && <p className="text-red-500 text-sm">{errors.auth}</p>}
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email[0]}</p>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/auth/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password[0]}</p>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={loading} className="cursor-pointer">
            {loading ? "Sending..." : "Login"}
          </Button>
        </Field>

        <FieldSeparator >Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" className="cursor-pointer">
            <FcGoogle />
            Login with Google
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline underline-offset-4 corsor-pointer">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
