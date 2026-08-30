/* eslint-disable react-hooks/purity */
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Send, RefreshCw, Star, Mic, MicOff, Loader2, History, Clock,
  Camera, Upload, X, Trash2, Image as ImageIcon, Sparkles
} from "lucide-react";
import Link from "next/link";
import GradientPurpleBackground from "@/components/background/gradient-purple";

// ─── Data & Types ────────────────────────────────────────────────────────────

interface WeatherEmotion {
  id: string;
  emoji: string;
  label: string;
  emotion: string;
  color: string;
  bg: string;
  ring: string;
  affirmation: string;
  tip: string;
  particles: string[];
}

interface WeatherReportHistoryItem {
  id: string;
  weather_id: string;
  weather_label: string;
  emotion: string;
  emoji: string;
  intensity: number;
  note: string;
  image_url?: string;
  created_at: string;
}

const weatherEmotions: WeatherEmotion[] = [
  {
    id: "sunny",
    emoji: "☀️",
    label: "Sunny",
    emotion: "Happy",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800",
    ring: "ring-yellow-400",
    affirmation: "Your sunshine is contagious! 🌻",
    tip: "Share your joy with someone today — happiness grows when you spread it!",
    particles: ["☀️", "🌻", "✨", "🌟", "🌈"],
  },
  {
    id: "rainbow",
    emoji: "🌈",
    label: "Rainbow",
    emotion: "Excited",
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800",
    ring: "ring-pink-400",
    affirmation: "You're bursting with color! 🎉",
    tip: "Channel that excitement into something creative — draw, dance, or sing!",
    particles: ["🌈", "🎊", "🎉", "✨", "💫"],
  },
  {
    id: "partly-cloudy",
    emoji: "🌤️",
    label: "Partly Cloudy",
    emotion: "Okay",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800",
    ring: "ring-sky-400",
    affirmation: "It's okay to feel 'just okay'! 🌤️",
    tip: "Neutral days are rest days. Do one small thing that makes you smile.",
    particles: ["🌤️", "☁️", "🌿", "🍃", "🌸"],
  },
  {
    id: "cloudy",
    emoji: "☁️",
    label: "Cloudy",
    emotion: "Thoughtful",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700",
    ring: "ring-slate-400",
    affirmation: "Deep thinking is a superpower! 🤔",
    tip: "Write down what's on your mind. Getting thoughts out can help clear the clouds.",
    particles: ["☁️", "📝", "💭", "🌫️", "🔮"],
  },
  {
    id: "drizzle",
    emoji: "🌦️",
    label: "Light Rain",
    emotion: "Sad",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
    ring: "ring-blue-400",
    affirmation: "It's brave to feel your feelings. 💙",
    tip: "Talk to someone you trust about how you feel. You don't have to be okay all the time.",
    particles: ["🌧️", "💧", "🌊", "🫂", "💙"],
  },
  {
    id: "stormy",
    emoji: "⛈️",
    label: "Stormy",
    emotion: "Angry",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
    ring: "ring-red-400",
    affirmation: "Storms don't last forever! ⚡",
    tip: "Take 5 deep breaths — in through your nose, out through your mouth. Let it out safely.",
    particles: ["⛈️", "⚡", "🌩️", "💨", "🌪️"],
  },
  {
    id: "snowy",
    emoji: "❄️",
    label: "Snowy",
    emotion: "Calm",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800",
    ring: "ring-cyan-400",
    affirmation: "Peace is beautiful and powerful. 🕊️",
    tip: "Enjoy this quiet feeling. Listen to soft music or sit somewhere cozy.",
    particles: ["❄️", "🌨️", "⛄", "🕊️", "🌿"],
  },
  {
    id: "windy",
    emoji: "🌬️",
    label: "Windy",
    emotion: "Nervous",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    ring: "ring-emerald-400",
    affirmation: "Wind bends but trees don't break! 💪",
    tip: "Wiggle your fingers and toes. Grounding yourself in your body helps calm nervousness.",
    particles: ["🌬️", "🍃", "🌀", "💨", "🎋"],
  },
];

const intensityLabels = ["Just a tiny bit", "A little", "Quite a lot", "A whole lot", "Completely!"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FloatingParticle({ emoji, delay }: { emoji: string; delay: number }) {
  return (
    <motion.div
      className="absolute text-2xl pointer-events-none select-none"
      initial={{ opacity: 0, y: 0, x: Math.random() * 300 - 150 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [-20, -120],
        x: [Math.random() * 60 - 30, Math.random() * 120 - 60],
        rotate: [0, Math.random() * 40 - 20],
      }}
      transition={{ duration: 2.2, delay, ease: "easeOut" }}
    >
      {emoji}
    </motion.div>
  );
}

function WeatherCard({
  weather, selected, onClick,
}: { weather: WeatherEmotion; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${selected
        ? `${weather.bg} ring-2 ${weather.ring} ring-offset-2 ring-offset-background border-transparent shadow-lg`
        : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
        }`}
    >
      <motion.span
        className="text-4xl"
        animate={selected ? { scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {weather.emoji}
      </motion.span>
      <div className="text-center">
        <p className="text-xs font-bold text-foreground">{weather.label}</p>
        <p className={`text-[10px] font-medium ${weather.color}`}>{weather.emotion}</p>
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center"
        >
          <div className="h-2 w-2 rounded-full bg-primary-foreground" />
        </motion.div>
      )}
    </motion.button>
  );
}

function IntensityPicker({
  value, onChange,
}: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">How much do you feel this?</p>
        <span className="text-xs text-muted-foreground italic">{intensityLabels[value - 1]}</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(star)}
            className="cursor-pointer"
          >
            <Star
              className={`h-7 w-7 transition-colors duration-150 ${star <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40"
                }`}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Camera Modal Component ───────────────────────────────────────────────────

function CameraModal({
  isOpen,
  onClose,
  onCapture,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera access was denied or unavailable. Please check permissions!");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);

  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      onCapture(dataUrl);
      stopCamera();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md rounded-2xl border bg-card p-5 shadow-2xl flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Take Live Photo 📸</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {cameraError ? (
          <div className="flex flex-col items-center justify-center p-6 rounded-xl border bg-destructive/10 text-center gap-2">
            <p className="text-sm text-destructive font-medium">{cameraError}</p>
            <Button size="sm" onClick={startCamera} className="mt-2 rounded-xl">
              Retry Camera
            </Button>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl bg-black aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="rounded-xl"
          >
            Cancel
          </Button>
          {!cameraError && (
            <Button
              size="sm"
              onClick={handleSnap}
              className="gap-2 rounded-xl font-bold bg-primary"
            >
              <Camera className="h-4 w-4" /> Snap Photo!
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function BroadcastResult({
  weather, intensity, note, imageUrl, onReset, onViewHistory,
}: {
  weather: WeatherEmotion;
  intensity: number;
  note: string;
  imageUrl?: string;
  onReset: () => void;
  onViewHistory: () => void;
}) {
  const particles = weather.particles;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5"
    >
      {/* Broadcast Card */}
      <div className={`relative overflow-hidden rounded-2xl border-2 p-6 ${weather.bg} shadow-lg`}>
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p, i) => (
            <FloatingParticle key={i} emoji={p} delay={i * 0.2} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          {/* Broadcast Header */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 border px-3 py-1 text-xs font-bold text-foreground backdrop-blur-sm">
              📡 LIVE WEATHER REPORT SAVED
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Saved to Supabase ✓
            </span>
          </div>

          {/* Main Emotion Display */}
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              className="text-7xl"
            >
              {weather.emoji}
            </motion.div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Today&lsquo;s Feeling Forecast
              </p>
              <h2 className={`text-3xl font-black ${weather.color}`}>{weather.label}</h2>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                Feeling: <span className={weather.color}>{weather.emotion}</span>
              </p>
            </div>
          </div>

          {/* Intensity Display */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Intensity:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${s <= intensity ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground/30"}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground italic">{intensityLabels[intensity - 1]}</span>
          </div>

          {/* User Note */}
          {note.trim() && (
            <div className="rounded-xl bg-background/60 border border-border/60 p-3 backdrop-blur-sm">
              <p className="text-xs font-medium text-muted-foreground mb-1">Your Message:</p>
              <p className="text-sm text-foreground leading-relaxed italic">&ldquo;{note}&rdquo;</p>
            </div>
          )}

          {/* Attached Photo Display */}
          {imageUrl && (
            <div className="rounded-xl overflow-hidden border border-border/60 bg-background/40 p-2 backdrop-blur-sm flex flex-col gap-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5 text-primary" /> Attached Photo:
              </p>
              <div className="overflow-hidden rounded-lg max-h-64 flex justify-center bg-black/5">
                <img
                  src={imageUrl}
                  alt="Feeling Forecast Attachment"
                  className="w-full object-cover max-h-64 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Affirmation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border bg-card p-5 shadow-xs"
      >
        <p className="text-lg font-bold text-foreground">{weather.affirmation}</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{weather.tip}</p>

        <div className="mt-4 flex gap-2 flex-wrap">
          <Button onClick={onReset} variant="outline" size="sm" className="gap-1.5 cursor-pointer rounded-xl">
            <RefreshCw className="h-3.5 w-3.5" /> Try Another
          </Button>
          <Button onClick={onViewHistory} size="sm" className="gap-1.5 cursor-pointer rounded-xl">
            <History className="h-3.5 w-3.5" /> View Past History 📜
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HistoryView({
  history,
  loading,
  onRefresh,
  onDelete,
}: {
  history: WeatherReportHistoryItem[];
  loading: boolean;
  onRefresh: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Your Weather History Timeline
          </h2>
          <p className="text-xs text-muted-foreground">
            Track how your internal weather forecasts evolve over time
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="gap-1.5 cursor-pointer rounded-xl text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading && history.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border bg-card/50 text-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">Loading your weather logs from Supabase...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed bg-card/30 text-center gap-3">
          <div className="text-4xl">🌤️</div>
          <p className="text-sm font-bold text-foreground">No Forecasts Saved Yet</p>
          <p className="text-xs text-muted-foreground max-w-sm">
            Pick your current feeling weather above and click Broadcast to save your first forecast to Supabase!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {history.map((item) => {
            const dateStr = new Date(item.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border bg-card shadow-xs flex flex-col hover:border-primary/40 transition-all overflow-hidden"
              >
                {/* Image on top if present */}
                {item.image_url && (
                  <div className="relative w-full aspect-video bg-muted">
                    <img
                      src={item.image_url}
                      alt="Forecast photo"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Card body */}
                <div className="flex flex-col gap-2.5 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-3xl shrink-0">{item.emoji}</span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-foreground leading-tight truncate">
                          {item.weather_label} ({item.emotion})
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span className="truncate">{dateStr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stars + Delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex gap-0.5 bg-muted/60 px-2 py-1 rounded-lg">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${star <= item.intensity
                              ? "fill-amber-400 text-amber-400"
                              : "fill-transparent text-muted-foreground/30"
                              }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete this entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {item.note && item.note.trim() && (
                    <div className="rounded-xl bg-muted/40 border border-border/50 px-3 py-2 text-xs text-foreground/90 italic">
                      &ldquo;{item.note}&rdquo;
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Speech Hook ─────────────────────────────────────────────────────────────

type SpeechStatus = "idle" | "listening" | "error";

type SpeechRecognitionResultItem = {
  transcript: string;
};

type SpeechRecognitionResult = {
  isFinal?: boolean;
  length: number;
  [index: number]: SpeechRecognitionResultItem;
};

type SpeechRecognitionEventLike = {
  results: {
    length: number;
    [index: number]: SpeechRecognitionResult;
  };
};

type SpeechRecognitionErrorLike = {
  error: string;
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function SoundWaveVisualizer() {
  return (
    <div className="flex items-center gap-0.5 h-3 px-1">
      {[0.4, 0.9, 0.5, 1, 0.6].map((_, i) => (
        <motion.span
          key={i}
          className="w-0.5 rounded-full bg-red-500"
          animate={{ height: ["25%", "100%", "35%", "85%", "25%"] }}
          transition={{
            duration: 0.5 + i * 0.12,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function useSpeechToText(onTranscript: (t: string) => void) {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const baseTextRef = useRef<string>("");
  const isManualStopRef = useRef<boolean>(false);
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const start = useCallback((currentNote: string) => {
    const SpeechRecognitionCtor: SpeechRecognitionConstructor | undefined =
      (window as typeof window & {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      }).SpeechRecognition ||
      (window as typeof window & {
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setErrorMsg("Your browser doesn't support voice input. Try Chrome or Edge!");
      setStatus("error");
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    baseTextRef.current = currentNote;
    isManualStopRef.current = false;

    const rec = new SpeechRecognitionCtor();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = true;

    rec.onstart = () => {
      setStatus("listening");
      setErrorMsg(null);
    };

    rec.onresult = (e: SpeechRecognitionEventLike) => {
      let liveTranscript = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i] && e.results[i][0]) {
          liveTranscript += e.results[i][0].transcript;
        }
      }

      const base = baseTextRef.current;
      let combined = base;
      if (liveTranscript) {
        if (base && !base.endsWith(" ") && !liveTranscript.startsWith(" ")) {
          combined = base + " " + liveTranscript;
        } else {
          combined = base + liveTranscript;
        }
      }

      onTranscript(combined);
    };

    rec.onerror = (e: SpeechRecognitionErrorLike) => {
      if (e.error === "not-allowed") {
        setErrorMsg("Microphone access was denied. Please allow microphone permissions!");
        setStatus("error");
      } else if (e.error !== "no-speech") {
        setErrorMsg("Voice input error (" + e.error + "). Please try again!");
        setStatus("error");
      }
    };

    rec.onend = () => {
      if (!isManualStopRef.current) {
        setStatus("idle");
      }
    };

    recognitionRef.current = rec;

    try {
      rec.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setErrorMsg("Failed to start recording. Please try again.");
      setStatus("error");
    }
  }, [onTranscript]);

  const stop = useCallback(() => {
    isManualStopRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setStatus("idle");
  }, []);

  return { status, errorMsg, start, stop };
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FeelingsWeatherPage() {
  const [selected, setSelected] = useState<WeatherEmotion | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<"broadcast" | "history">("broadcast");
  const [history, setHistory] = useState<WeatherReportHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/sel/feelings-weather");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.reports || []);
      }
    } catch (err) {
      console.error("Failed to load weather history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleTranscript = useCallback((text: string) => {
    setNote(text.slice(0, 200));
  }, []);

  const { status: micStatus, errorMsg: micError, start: startMic, stop: stopMic } = useSpeechToText(handleTranscript);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setSubmitted(true);

    try {
      const payload = {
        weather_id: selected.id,
        weather_label: selected.label,
        emotion: selected.emotion,
        emoji: selected.emoji,
        intensity,
        note: note.trim(),
        image_url: imageUrl,
      };

      const res = await fetch("/api/sel/feelings-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setHistory((prev) => [data.report, ...prev]);
        }
      }
    } catch (err) {
      console.error("Error saving forecast to Supabase:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelected(null);
    setIntensity(3);
    setNote("");
    setImageUrl("");
    setSubmitted(false);
  };

  const handleDeleteHistory = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/sel/feelings-weather?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error("Failed to delete history item");
      }
    } catch (err) {
      console.error("Error deleting history item:", err);
    }
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative h-screen max-h-screen overflow-hidden flex flex-col bg-transparent">
        <GradientPurpleBackground />

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Live Camera Capture Modal */}
        <CameraModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={(dataUrl) => setImageUrl(dataUrl)}
        />

        {/* Header */}
        <header className="relative z-10 flex h-16 shrink-0 items-center gap-2 border-b-2 border-black hover:border-black px-4 bg-white dark:bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/home">TalenzoX</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">SEL</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/sel/practice">Practice</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Feelings Weather Report</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="relative z-10 flex flex-1  flex-col overflow-y-auto min-h-0 p-4 sm:p-6 gap-5 scrollbar-none [&::-webkit-scrollbar]:hidden pb-16">

          {/* Back button + Title + Tabs */}
          <div className="flex flex-col sm:flex-row bg-white pr-10 pt-5 rounded-2xl  sm:items-center justify-between gap-3 border-b pb-4">
            <div className="flex items-start gap-3 ">
              <Link href="/sel/practice">
                <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-[255,255,255,0] text-xs cursor-pointer rounded-xl -ml-1 mt-0.5">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌤️</span>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    Feelings Weather Report
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  What&lsquo;s the weather like inside you right now? Pick your feeling forecast!
                </p>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-1 bg-muted/80 p-1 rounded-2xl shrink-0 self-start sm:self-auto border">
              <button
                onClick={() => {
                  setActiveTab("broadcast");
                  if (submitted) handleReset();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "broadcast"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                📡 New Broadcast
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "history"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <History className="h-3.5 w-3.5" />
                History
                {history.length > 0 && (
                  <span className="ml-0.5 rounded-full bg-primary/10 text-primary text-[10px] px-1.5 py-0.2 font-mono font-semibold">
                    {history.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {activeTab === "history" ? (
            <HistoryView
              history={history}
              loading={loadingHistory}
              onRefresh={fetchHistory}
              onDelete={handleDeleteHistory}
            />
          ) : (
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="picker"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-5"
                >
                  {/* Step 1 — Weather Picker */}
                  <div className="rounded-2xl border bg-card p-5 shadow-xs">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                      <p className="text-sm font-semibold">Pick your weather today</p>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                      {weatherEmotions.map((w) => (
                        <WeatherCard
                          key={w.id}
                          weather={w}
                          selected={selected?.id === w.id}
                          onClick={() => setSelected(w)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Step 2 — Intensity (visible when selected) */}
                  <AnimatePresence>
                    {selected && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-2xl border bg-card p-5 shadow-xs"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                          <p className="text-sm font-semibold">
                            You picked <span className={selected.color}>{selected.label} ({selected.emotion})</span> — how much?
                          </p>
                        </div>
                        <IntensityPicker value={intensity} onChange={setIntensity} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 3 — Optional Note + Mic */}
                  <AnimatePresence>
                    {selected && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: 0.08 }}
                        className="rounded-2xl border bg-card p-5 shadow-xs"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                          <p className="text-sm font-semibold">Want to say more? <span className="text-muted-foreground font-normal">(optional)</span></p>
                        </div>

                        {/* Textarea + Mic button */}
                        <div className="relative">
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            maxLength={200}
                            rows={3}
                            placeholder={
                              micStatus === "listening"
                                ? "🎙️ Listening live... speak now! Your words will appear here in real time..."
                                : `Tell us more about your ${selected.label.toLowerCase()} day...`
                            }
                            className="w-full resize-none rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 pr-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all duration-200"
                          />

                          {/* Mic Button */}
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            type="button"
                            onClick={() => {
                              if (micStatus === "listening") {
                                stopMic();
                              } else {
                                startMic(note);
                              }
                            }}
                            className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer shadow-sm ${micStatus === "listening"
                              ? "bg-red-500 border-red-400 text-white shadow-red-500/30 shadow-lg"
                              : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5"
                              }`}
                            title={micStatus === "listening" ? "Stop voice recording" : "Start real-time voice recording"}
                          >
                            {micStatus === "listening" ? (
                              <>
                                {/* Pulsing ring animation */}
                                <motion.span
                                  className="absolute inset-0 rounded-full bg-red-400/50"
                                  animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <MicOff className="h-4 w-4 relative z-10" />
                              </>
                            ) : (
                              <Mic className="h-4 w-4" />
                            )}
                          </motion.button>
                        </div>

                        {/* Live mic status / error */}
                        <div className="mt-2 flex items-center justify-between">
                          <AnimatePresence mode="wait">
                            {micStatus === "listening" && (
                              <motion.div
                                key="listening"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -6 }}
                                className="flex items-center gap-2 text-[12px] font-semibold text-red-500"
                              >
                                <SoundWaveVisualizer />
                                <span>Live recording… Speak now! Tap 🎤 to finish</span>
                              </motion.div>
                            )}
                            {micStatus === "error" && micError && (
                              <motion.span
                                key="error"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -6 }}
                                className="text-[11px] font-medium text-destructive"
                              >
                                {micError}
                              </motion.span>
                            )}
                            {micStatus === "idle" && !micError && (
                              <motion.span
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[11px] text-muted-foreground"
                              >
                                🎙️ Tap the mic for real-time voice-to-text
                              </motion.span>
                            )}
                          </AnimatePresence>
                          <span className="text-[11px] text-muted-foreground font-mono">{note.length}/200</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 4 — Image Attachment (Upload or Live Camera) */}
                  <AnimatePresence>
                    {selected && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: 0.12 }}
                        className="rounded-2xl border bg-card p-5 shadow-xs"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                          <p className="text-sm font-semibold">Add a photo <span className="text-muted-foreground font-normal">(optional)</span></p>
                        </div>

                        {!imageUrl ? (
                          <div className="flex flex-wrap gap-2.5">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="gap-2 rounded-xl cursor-pointer hover:border-primary/50"
                            >
                              <Upload className="h-4 w-4 text-primary" />
                              Upload Image 📁
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsCameraOpen(true)}
                              className="gap-2 rounded-xl cursor-pointer hover:border-primary/50"
                            >
                              <Camera className="h-4 w-4 text-primary" />
                              Live Photo 📷
                            </Button>
                          </div>
                        ) : (
                          <div className="relative inline-block rounded-2xl overflow-hidden border bg-muted/30 p-2 max-w-sm">
                            <div className="relative rounded-xl overflow-hidden max-h-48">
                              <img
                                src={imageUrl}
                                alt="Attached preview"
                                className="w-full object-cover max-h-48 rounded-xl"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => setImageUrl("")}
                                className="absolute top-2 right-2 h-7 w-7 rounded-full p-0 shadow-md cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1.5 text-center font-medium">
                              Photo attached ✓
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Broadcast Button */}
                  <AnimatePresence>
                    {selected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.16 }}
                      >
                        <Button
                          onClick={handleSubmit}
                          disabled={submitting}
                          size="lg"
                          className="w-full max-w-100 gap-2 rounded-2xl h-12 text-base font-bold cursor-pointer shadow-md shadow-primary/20"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Saving to Supabase...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Broadcast My Weather Report! 📡
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <BroadcastResult
                    weather={selected!}
                    intensity={intensity}
                    note={note}
                    imageUrl={imageUrl}
                    onReset={handleReset}
                    onViewHistory={() => setActiveTab("history")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
