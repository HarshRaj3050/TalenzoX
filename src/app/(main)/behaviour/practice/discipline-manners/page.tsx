"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Home,
  Languages,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
} from "lucide-react";
import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type LanguageCode = "en" | "hi" | "bn" | "mr" | "te" | "ta";
type Answer = "yes" | "no";

const languageOptions: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
];

const languageContent: Record<LanguageCode, { questions: [string, string]; yes: string; no: string }> = {
  en: { questions: ["Do you put your waste in a dustbin?", "Do you wash your hands before eating?"], yes: "Yes", no: "No" },
  hi: { questions: ["क्या आप अपना कचरा कूड़ेदान में डालते हैं?", "क्या आप खाना खाने से पहले अपने हाथ धोते हैं?"], yes: "हाँ", no: "नहीं" },
  bn: { questions: ["তুমি কি তোমার আবর্জনা ডাস্টবিনে ফেলো?", "তুমি কি খাওয়ার আগে হাত ধুয়ে নাও?"], yes: "হ্যাঁ", no: "না" },
  mr: { questions: ["तुम्ही तुमचा कचरा कचरापेटीत टाकता का?", "तुम्ही जेवण्यापूर्वी हात धुता का?"], yes: "होय", no: "नाही" },
  te: { questions: ["మీరు మీ చెత్తను చెత్తబుట్టలో వేస్తారా?", "మీరు తినే ముందు చేతులు కడుక్కుంటారా?"], yes: "అవును", no: "కాదు" },
  ta: { questions: ["நீங்கள் உங்கள் குப்பையை குப்பைத்தொட்டியில் போடுகிறீர்களா?", "நீங்கள் சாப்பிடுவதற்கு முன் கைகளைக் கழுவுகிறீர்களா?"], yes: "ஆம்", no: "இல்லை" },
};

const answerStyles: Record<Answer, { color: string; isCorrect: boolean }> = {
  yes: { color: "from-emerald-400 to-green-500", isCorrect: true },
  no: { color: "from-rose-400 to-red-500", isCorrect: false },
};

export default function DisciplineMannersPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [isQuestionComplete, setIsQuestionComplete] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questionNumber, setQuestionNumber] = useState<1 | 2>(1);
  const [videoSource, setVideoSource] = useState("question1.mp4");

  const readQuestionAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(languageContent[language].questions[questionNumber - 1]);
    utterance.lang = language === "en" ? "en-IN" : `${language}-IN`;
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectAnswer = (answer: Answer) => {
    setSelectedAnswer(answer);
    void fetch("/api/behaviour/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activity_slug: "discipline-manners",
        question_number: questionNumber,
        question_text: languageContent[language].questions[questionNumber - 1],
        language,
        answer_key: answer,
        answer_text: languageContent[language][answer],
        response_video: `question${questionNumber}_${answer === "yes" ? "Yes" : "No"}.mp4`,
      }),
    }).catch((error) => {
      console.error("Failed to save discipline manners response:", error);
    });
    setVideoSource(`question${questionNumber}_${answer === "yes" ? "Yes" : "No"}.mp4`);
  };

  const handleVideoEnded = () => {
    if (!selectedAnswer) {
      setIsQuestionComplete(true);
      return;
    }
    if (questionNumber === 1) {
      setQuestionNumber(2);
      setSelectedAnswer(null);
      setIsQuestionComplete(false);
      setVideoSource("question2.mp4");
      return;
    }

    setShowResultModal(true);
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      router.push("/home");
      return;
    }
    const timer = setInterval(() => {
      setCountdown((current) => current !== null && current > 0 ? current - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, router]);

  const resetPractice = () => {
    setShowResultModal(false);
    setSelectedAnswer(null);
    setCountdown(null);
    setIsQuestionComplete(false);
    setQuestionNumber(1);
    setVideoSource("question1.mp4");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex min-h-screen flex-col bg-amber-50/40">
        <SidebarTrigger className="absolute left-6 top-6 z-20 cursor-pointer rounded-2xl border border-amber-100 bg-white p-4 shadow-md transition-all hover:bg-amber-50" />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-amber-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <Link href="/behaviour/practice" className="flex items-center justify-center rounded-2xl bg-amber-100/70 p-3 text-amber-900 transition-all hover:bg-amber-200" title="Back to Behaviour Practice">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-amber-900">Discipline Manners</span>
                  <span className="text-xs font-bold text-amber-600">Question {questionNumber} of 2</span>
                </div>
                <h1 className="mt-1 text-xl font-black text-slate-800 sm:text-2xl">Practice Question</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 rounded-2xl bg-amber-100/70 px-3 py-2.5 text-sm font-bold text-amber-900">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Select language</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)} className="cursor-pointer bg-transparent outline-none" aria-label="Select language">
                  {languageOptions.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}
                </select>
              </label>
              <button type="button" onClick={readQuestionAloud} className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-sm transition-all ${isSpeaking ? "animate-pulse bg-amber-500 text-white" : "bg-amber-100 text-amber-900 hover:bg-amber-200"}`}>
                <Volume2 className="h-5 w-5" />
                <span>{isSpeaking ? "Listening..." : "Read Aloud"}</span>
              </button>
            </div>
          </header>

          <section className="rounded-3xl border-4 border-white bg-white shadow-2xl">
            <div className="border-b border-amber-100 px-5 py-5 text-center sm:px-8">
              <h2 className="text-xl font-black text-slate-800 sm:text-2xl">{languageContent[language].questions[questionNumber - 1]}</h2>
            </div>
            <div className="relative w-full overflow-hidden rounded-b-2xl bg-slate-950">
              <video key={videoSource} autoPlay playsInline onEnded={handleVideoEnded} className="block aspect-video w-full object-contain">
                <source src={`/behaviour/practice/discipline-manners/${videoSource}`} type="video/mp4" />
              </video>
              {!selectedAnswer && isQuestionComplete && (
                <div className="absolute bottom-5 left-1/2 z-10 grid w-[min(90%,32rem)] -translate-x-1/2 grid-cols-2 gap-4">
                  {(["yes", "no"] as Answer[]).map((answer) => (
                    <button key={answer} type="button" onClick={() => handleSelectAnswer(answer)} className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-4 border-black bg-white py-4 text-lg font-black text-black shadow-lg transition-transform hover:scale-[1.02] hover:bg-gray-50">
                      <Sparkles className="h-5 w-5" />
                      {languageContent[language][answer]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <AnimatePresence>
          {showResultModal && selectedAnswer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
              <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-md overflow-hidden rounded-3xl border-4 border-amber-200 bg-white p-6 text-center shadow-2xl sm:p-8">
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`mb-4 flex h-20 w-20 rotate-3 items-center justify-center rounded-3xl bg-linear-to-tr ${answerStyles[selectedAnswer].color} text-white shadow-xl`}>
                    {answerStyles[selectedAnswer].isCorrect ? <Star className="h-10 w-10 fill-white" /> : <Heart className="h-10 w-10 fill-white" />}
                  </div>
                  <span className="mb-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-900">{answerStyles[selectedAnswer].isCorrect ? "Perfect Choice!" : "Good Try!"}</span>
                  <h3 className="text-2xl font-black text-slate-800 sm:text-3xl">{languageContent[language][selectedAnswer]}</h3>
                  <p className="mt-3 text-base font-semibold leading-relaxed text-slate-600">{answerStyles[selectedAnswer].isCorrect ? "Great job! You chose the kind and helpful answer!" : "Good try! Let’s watch the kind answer together!"}</p>
                  <div className="mt-6 flex w-full flex-col gap-3">
                    <button type="button" onClick={() => router.push("/home")} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-base font-extrabold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl">
                      <Home className="h-5 w-5" />
                      Finish &amp; Return to Home
                    </button>
                    <button type="button" onClick={resetPractice} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-200">
                      <RotateCcw className="h-4 w-4" />
                      Try Again
                    </button>
                  </div>
                  {countdown !== null && <p className="mt-4 text-xs font-medium text-slate-400">Redirecting to Home in {countdown} seconds...</p>}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  );
}