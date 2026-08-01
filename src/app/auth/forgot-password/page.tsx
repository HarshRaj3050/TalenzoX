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
import { MarqueeDemo } from "@/components/ui/marquee-demo";

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
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
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
    <div className="grid min-h-svh lg:grid-cols-[45%_55%]">
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
      <div className="relative hidden bg-muted lg:block">
        {/* right box */}
        <div className="relative hidden overflow-hidden lg:block">
        {/* Background */}
        <div className="relative h-dvh w-full bg-blue-700">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 70% 20%, rgba(90,70,200,0.85), transparent 70%),
                radial-gradient(ellipse 70% 60% at 20% 80%, rgba(40,120,220,0.75), transparent 70%),
                radial-gradient(ellipse 65% 55% at 60% 65%, rgba(0,180,255,0.55), transparent 70%),
                radial-gradient(ellipse 65% 40% at 50% 60%, rgba(180,60,200,0.45), transparent 70%),
                linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)
              `,
            }}
          />


          {/* Heading */}
          <div className="absolute left-1/2 top-[35%] w-full -translate-x-1/2 -translate-y-1/2 px-8">
            <h1 className="text-center font-sora text-[58px] font-bold leading-tight tracking-wide text-white/80">
              “Action Today,
              <br />
              <span>Success Tomorrow.”</span>
            </h1>
          </div>

          {/* Bottom Marquee */}
          <div className="absolute bottom-2 w-full">
            <MarqueeDemo />
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}
