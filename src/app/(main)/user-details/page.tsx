"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  UserRound,
  GraduationCap,
  Target,
  CircleHelp,
  UsersRound,
  Check,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Copy,
  Share2,
  Activity,
} from "lucide-react";

type FormData = {
  dob: string;
  phone: string;
  college: string;
  status: string;
  focus: string;
  source: string;
  email: string;
};

const steps = [
  { label: "Basics", icon: UserRound },
  { label: "Profile", icon: GraduationCap },
  { label: "Focus", icon: Target },
  { label: "Info", icon: CircleHelp },
  { label: "Invite", icon: UsersRound },
];

const profileOptions = [
  "Primary School Student",
  "Middle School Student",
  "Secondary School Student",
  "Other",
];

const focusOptions = [
  "Learn New Skills",
  "Explore My Interests",
  "Improve My Skills",
  "Others",
];

export default function PersonalizeJourneyForm() {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState<FormData>({
    dob: "",
    phone: "",
    college: "",
    status: "",
    focus: "",
    source: "",
    email: "",
  });

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const updateForm = (field: keyof FormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const canContinue = () => {
    if (step === 0) {
      return form.dob && form.phone && form.college;
    }

    if (step === 1) {
      return form.status;
    }

    if (step === 2) {
      return form.focus;
    }

    return true;
  };

  const nextStep = () => {
    if (!canContinue()) return;

    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      await api.post("/user-details", {
        ...form,
        invite_email: form.email,
      });
      router.push("/home");
    } catch (submissionError) {
      console.error("User details submission failed:", submissionError);
      setError("We could not save your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyReferral = async () => {
    const referralLink = "https://talenzox.app/join/ref123";

    await navigator.clipboard.writeText(referralLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const shareReferral = async () => {
    const referralLink = "https://talenzox.app/join/ref123";

    if (navigator.share) {
      await navigator.share({
        title: "Join TalenzoX",
        text: "Join me on TalenzoX!",
        url: referralLink,
      });
    } else {
      await copyReferral();
    }
  };

  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-slate-950">
      <div className="relative min-h-dvh w-full">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
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

        {/* Form card */}
        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur-sm">
            {/* Header */}
            <div className="px-6 pt-6">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  Let&apos;s personalize your journey
                </h1>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Complete the steps to get tailored guidance for your goals.
              </p>

              {/* Progress bar */}
              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${((step + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="px-4 pt-5 sm:px-6 sm:pt-6">
              <div className="grid grid-cols-5 gap-1">
                {steps.map((item, index) => {
                  const Icon = item.icon;

                  const completed = index < step;
                  const active = index === step;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        if (index <= step) setStep(index);
                      }}
                      aria-current={active ? "step" : undefined}
                      className="flex min-w-0 flex-col items-center gap-2 rounded-lg px-1 py-1 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                          completed
                            ? "border-green-100 bg-green-50 text-green-600"
                            : active
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-200 bg-white text-gray-500"
                        }`}
                      >
                        {completed ? (
                          <Check size={17} strokeWidth={2.5} />
                        ) : (
                          <Icon size={17} />
                        )}
                      </div>

                      <span
                        className={`text-xs ${
                          active
                            ? "font-medium text-blue-600"
                            : completed
                              ? "text-gray-600"
                              : "text-gray-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className="px-4 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-7">
              {/* STEP 1 */}
              {step === 0 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        Date of birth
                      </label>

                      <input
                        type="date"
                        value={form.dob}
                        onChange={(e) => updateForm("dob", e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        Phone number
                      </label>

                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      Current school
                    </label>

                    <input
                      type="text"
                      placeholder="e.g., Delhi Public School"
                      value={form.college}
                      onChange={(e) => updateForm("college", e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Make sure to write full name of your school
                      institution/school.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 1 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    What best describes you Currently?
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) => updateForm("status", e.target.value)}
                    className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select your current status</option>

                    {profileOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* STEP 3 */}
              {step === 2 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Based on your profile, what&apos;s your main focus right
                    now?
                  </h2>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {focusOptions.map((option) => {
                      const selected = form.focus === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateForm("focus", option)}
                          className={`min-h-12 rounded-lg border px-3 text-left text-sm transition ${
                            selected
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 3 && (
                <div>
                  <div className="rounded-lg border border-gray-200 px-5 py-5 text-center">
                    <h2 className="text-base font-semibold text-gray-900">
                      Where did you find TalenzoX?
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Tell us how you found out about TalenzoX
                    </p>

                    <input
                      type="text"
                      placeholder="Eg: blogs..."
                      value={form.source}
                      onChange={(e) => updateForm("source", e.target.value)}
                      className="mt-6 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    Note: This step is optional and can be skipped.
                  </p>
                </div>
              )}

              {/* STEP 5 */}
              {step === 4 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Invite by email
                  </label>

                  <div className="flex w-full gap-2 sm:w-auto">
                    <input
                      type="email"
                      placeholder="friend@example.com"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className="h-11 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 sm:flex-none"
                    >
                      <UserPlus size={16} />
                      Add
                    </button>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-900">
                      Or share a referral link
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={copyReferral}
                        className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {copied ? "Copied!" : "Copy referral link"}
                        <Copy size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={shareReferral}
                        className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <Share2 size={15} />
                        Share
                      </button>
                    </div>

                    <p className="mt-4 text-xs text-gray-500">
                      Friends who join with your link may unlock bonus resources
                      for you.
                    </p>
                  </div>
                </div>
              )}

              {/* Footer */}
              {error && <p className="mt-5 text-sm text-red-600">{error}</p>}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-gray-500">
                  Step {step + 1} of {steps.length}
                </span>

                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={previousStep}
                    disabled={step === 0}
                    className="flex h-10 flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    <ArrowLeft size={15} />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canContinue() || loading}
                    className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    {step === steps.length - 1
                      ? loading
                        ? "Saving..."
                        : "Complete Setup"
                      : "Continue"}

                    {step === steps.length - 1 ? (
                      <Activity size={15} />
                    ) : (
                      <ArrowRight size={15} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
