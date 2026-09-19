"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  ArrowLeft,
  Languages,
  Volume2,
  Sparkles,
  Home,
  RotateCcw,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Option = {
  id: string;
  title: string;
  isCorrect: boolean;
  description: string;
  color: string;
};

const options: Option[] = [
  {
    id: "yes",
    title: "Yes",
    isCorrect: true,
    description: "Great job! You chose the kind and helpful answer! 🌟",
    color: "from-emerald-400 to-green-500",
  },
  {
    id: "no",
    title: "No",
    isCorrect: false,
    description: "Good try! Let’s watch the kind answer together! ❤️",
    color: "from-rose-400 to-red-500",
  },
];

type LanguageCode = "en" | "hi" | "bn" | "mr" | "te" | "ta";

type BehaviourAnalysis = {
  score: number;
  previousScore: number;
  improvement: number;
  summary: string;
  strengths: string[];
  improvements: string[];
};

const languageOptions: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
];

const languageContent: Record<
  LanguageCode,
  { question1: string; question2: string; yes: string; no: string }
> = {
  en: {
    question1: "Are you okay? Do you need help?",
    question2: "If you accidentally break something, would you tell the truth and apologize?",
    yes: "Yes",
    no: "No",
  },

  hi: {
    question1: "क्या आप ठीक हैं? क्या आपको मदद चाहिए?",
    question2: "अगर आपसे गलती से कुछ टूट जाए, तो क्या आप सच बताएँगे और माफ़ी माँगेंगे?",
    yes: "हाँ",
    no: "नहीं",
  },

  bn: {
    question1: "তুমি কি ঠিক আছো? তোমার কি সাহায্য দরকার?",
    question2: "তুমি যদি ভুল করে কিছু ভেঙে ফেলো, তাহলে কি সত্যি কথা বলবে এবং ক্ষমা চাইবে?",
    yes: "হ্যাঁ",
    no: "না",
  },

  mr: {
    question1: "तुम्ही ठीक आहात का? तुम्हाला मदत हवी आहे का?",
    question2: "तुमच्याकडून चुकून काही तुटले, तर तुम्ही खरं सांगाल आणि माफी मागाल का?",
    yes: "होय",
    no: "नाही",
  },

  te: {
    question1: "మీరు బాగున్నారా? మీకు సహాయం కావాలా?",
    question2: "మీరు అనుకోకుండా ఏదైనా పగలగొడితే, నిజం చెప్పి క్షమాపణ చెబుతారా?",
    yes: "అవును",
    no: "కాదు",
  },

  ta: {
    question1: "நீங்கள் நலமாக இருக்கிறீர்களா? உங்களுக்கு உதவி தேவையா?",
    question2: "நீங்கள் தவறுதலாக ஏதாவது உடைத்துவிட்டால், உண்மையைச் சொல்லி மன்னிப்பு கேட்பீர்களா?",
    yes: "ஆம்",
    no: "இல்லை",
  },
};

export default function BehaviourTestPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questionNumber, setQuestionNumber] = useState<1 | 2>(1);
  const [videoSource, setVideoSource] = useState("question1.mp4");
  const [isQuestionComplete, setIsQuestionComplete] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [analysis, setAnalysis] = useState<BehaviourAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const pendingResponseRef = useRef<Promise<void> | null>(null);

  // Sound synthesis effect for kids
  const playSound = (isSuccess: boolean) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (isSuccess) {
        // Happy melody (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + idx * 0.12 + 0.25,
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.3);
        });
      } else {
        // Gentle soft chord
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = 440;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Audio context fallthrough
    }
  };

  // Text-to-speech for 5-7 year olds
  const readQuestionAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const text = languageContent[language][`question${questionNumber}`];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "en" ? "en-IN" : `${language}-IN`;
    utterance.rate = 0.9; // slightly slower for young kids
    utterance.pitch = 1.1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    playSound(option.isCorrect);
    pendingResponseRef.current = fetch("/api/behaviour/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activity_slug: "behaviour-test",
        question_number: questionNumber,
        question_text: languageContent[language][`question${questionNumber}`],
        language,
        answer_key: option.id,
        answer_text: languageContent[language][option.id as "yes" | "no"],
        response_video: `question${questionNumber}_${option.id === "yes" ? "Yes" : "No"}.mp4`,
      }),
    }).then((response) => {
      if (!response.ok) throw new Error("Response was not saved");
    }).catch((error) => {
      console.error("Failed to save behaviour test response:", error);
    });
    setVideoSource(
      `question${questionNumber}_${option.id === "yes" ? "Yes" : "No"}.mp4`,
    );
  };

  const analyzeBehaviour = async () => {
    setShowResultModal(true);
    setIsAnalyzing(true);
    try {
      await pendingResponseRef.current;
      const response = await fetch("/api/behaviour/analyze", { method: "POST" });
      if (!response.ok) throw new Error("Analysis request failed");
      const result = (await response.json()) as { analysis: BehaviourAnalysis };
      setAnalysis(result.analysis);
    } catch (error) {
      console.error("Failed to analyze behaviour test:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVideoEnded = () => {
    if (!selectedOption) {
      setIsQuestionComplete(true);
    } else if (questionNumber === 1) {
      setQuestionNumber(2);
      setSelectedOption(null);
      setIsQuestionComplete(false);
      setVideoSource("question2.mp4");
    } else {
      void analyzeBehaviour();
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-amber-50/40 min-h-screen flex flex-col">
        {/* Sidebar Trigger */}
        <SidebarTrigger className="-ml-1 absolute top-6 left-6 p-4 bg-white z-20 shadow-md cursor-pointer rounded-2xl border border-amber-100 hover:bg-amber-50 transition-all" />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto flex flex-col gap-6">
          {/* Top Bar Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-amber-100">
            <div className="flex items-center gap-3">
              <Link
                href="/home"
                className="p-3 rounded-2xl bg-amber-100/70 hover:bg-amber-200 text-amber-900 transition-all cursor-pointer flex items-center justify-center"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-200 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    For 5-7 Years
                  </span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />{" "}
                    Question {questionNumber} of 2
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">
                  Behaviour Test
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 rounded-2xl bg-amber-100/70 px-3 py-2.5 text-sm font-bold text-amber-900">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Select language</span>
                <select
                  value={language}
                  onChange={(event) =>
                    setLanguage(event.target.value as LanguageCode)
                  }
                  className="cursor-pointer bg-transparent outline-none"
                  aria-label="Select language"
                >
                  {languageOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={readQuestionAloud}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm cursor-pointer transition-all shadow-sm ${
                  isSpeaking
                    ? "bg-amber-500 text-white animate-pulse"
                    : "bg-amber-100 hover:bg-amber-200 text-amber-900"
                }`}
              >
                <Volume2 className="w-5 h-5" />
                <span>{isSpeaking ? "Listening..." : "Read Aloud"}</span>
              </button>
            </div>
          </div>

          {/* Animated question video */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
            <video
              key={videoSource}
              autoPlay
              playsInline
              onEnded={handleVideoEnded}
              className="block w-full aspect-video object-contain bg-slate-950"
            >
              <source
                src={`/dashboard/behaviour/question${questionNumber}/${videoSource}`}
                type="video/mp4"
              />
            </video>

            {!selectedOption && isQuestionComplete && (
              <div className="absolute bottom-5 left-1/2 z-10 grid w-[min(90%,32rem)] -translate-x-1/2 grid-cols-2 gap-4">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className={`rounded-2xl bg-white font-black text-lg py-4 shadow-lg hover:scale-[1.02] transition-transform cursor-pointer flex items-center justify-center gap-2 border-4 ${
                      opt.id === "yes"
                        ? "border-black text-black hover:bg-gray-50"
                        : "border-black text-black hover:bg-gray-50"
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    {languageContent[language][opt.id as "yes" | "no"]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Completion / Result Modal */}
        <AnimatePresence>
          {showResultModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-200 text-center relative overflow-hidden"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                    Behaviour Analysis
                  </h3>

                  <div className="mt-6 w-full rounded-2xl bg-amber-50 p-4 text-left">
                    {isAnalyzing ? (
                      <p className="text-sm font-semibold text-amber-900">Analyzing your answers...</p>
                    ) : analysis ? (
                      <div className="space-y-4">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Your progress</p>
                            <p className="text-3xl font-black text-slate-800">{analysis.score}%</p>
                          </div>
                          <p className={`text-sm font-black ${analysis.improvement >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                            {analysis.improvement >= 0 ? "+" : ""}{analysis.improvement}% from last time
                          </p>
                        </div>
                        <p className="text-sm font-semibold leading-6 text-slate-700">{analysis.summary}</p>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-emerald-700">What you do well</p>
                          <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                            {analysis.strengths.map((strength) => <li key={strength}>{strength}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-amber-700">Try next</p>
                          <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                            {analysis.improvements.map((improvement) => <li key={improvement}>{improvement}</li>)}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-slate-600">Your answers were saved. Feedback will be available soon.</p>
                    )}
                  </div>

                  <div className="mt-6 w-full flex flex-col gap-3">
                    <button
                      onClick={() => router.push("/home")}
                      className="w-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-base py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Home className="w-5 h-5" />
                      Finish & Return to Home
                    </button>

                    <button
                      onClick={() => {
                        setShowResultModal(false);
                        setSelectedOption(null);
                        setQuestionNumber(1);
                        setIsQuestionComplete(false);
                        setAnalysis(null);
                        setIsAnalyzing(false);
                        pendingResponseRef.current = null;
                        setVideoSource("question1.mp4");
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  );
}
