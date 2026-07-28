"use client";

import { useState } from "react";
import Link from "next/link";

import { GalleryVerticalEndIcon } from "lucide-react";
import { siteConfig } from "@/config/site";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface ForgotPasswordFormProps {
  className?: string;
}

export default function ForgotPasswordForm({
  className,
}: ForgotPasswordFormProps) {
  const supabase = getSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        `We've sent you a password reset link. Please check your email.`,
      );
    }

    setLoading(false);
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href={siteConfig.url}
            className="flex items-center gap-2 font-medium"
          >
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            {siteConfig.name}
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form
              className={cn("flex flex-col gap-6", className)}
              onSubmit={handleSubmit}
            >
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Forgot your password?</h1>

                  <p className="text-sm text-balance text-muted-foreground">
                    Enter your email address and we will send you a link to reset
                    your password.
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>

                {message && (
                  <FieldDescription className="text-center">
                    {message}
                  </FieldDescription>
                )}

                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Remember your password?{" "}
                  <Link
                    href="/auth/login"
                    className="underline underline-offset-4"
                  >
                    Back to Login
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">{/* right box */}</div>
    </div>
  );
}
