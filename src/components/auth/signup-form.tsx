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
import { signupSchema } from "@/validation/userSchema";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string[];
    email?: string[];
    password?: string[];
  }>({});

  const supabase = getSupabaseBrowserClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});

    const { data, error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: {
          name: result.data.name,
        },
        emailRedirectTo: `${window.location.origin}/home`,
      },
    });

    if (error) {
      console.error(error.message);
      return;
    }

    console.log("Signed up:", data);
    setLoading(false);
    router.push("/auth/login");
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
            placeholder="John Doe"
            required
            className="bg-background"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name[0]}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email[0]}</p>
          )}
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="bg-background"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password[0]}</p>
          )}
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            required
            className="bg-background"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button">
            <FcGoogle />
            Sign up with Google
          </Button>

          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/auth/login">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
