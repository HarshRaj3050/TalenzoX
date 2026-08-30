"use client";

import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Bot,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  X,
  User,
} from "lucide-react";
import Vapi from "@vapi-ai/web";
import { cn } from "@/lib/utils";
import { useEffect, useEffectEvent, useRef, useState } from "react";

const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

type CallStatus = "idle" | "connecting" | "active";
type TranscriptMessage = {
  role: "user" | "assistant";
  text: string;
  isFinal?: boolean;
};
type CallSummary = {
  summary: string;
  score: number;
  strengths?: string[];
  improvements?: string[];
};

function Message({
  from,
  className,
  children,
}: {
  from: TranscriptMessage["role"];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group flex w-full items-end gap-2 py-2",
        from === "user"
          ? "justify-end"
          : "flex-row-reverse justify-end",
        "[&>div]:max-w-[80%]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MessageContent({
  from,
  children,
}: {
  from: TranscriptMessage["role"];
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 overflow-hidden rounded-lg px-4 py-3 text-sm",
        from === "user"
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-foreground",
      )}
    >
      {children}
    </div>
  );
}

function MessageAvatar({ from }: { from: TranscriptMessage["role"] }) {
  return (
    <Avatar className="size-8 ring-1 ring-border">
      <AvatarFallback>
        {from === "user" ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}

function getTranscriptMessage(message: unknown): TranscriptMessage | null {
  if (!message || typeof message !== "object") return null;
  const value = message as Record<string, unknown>;
  if (value.type !== "transcript" || typeof value.transcript !== "string")
    return null;
  return {
    role: value.role === "user" ? "user" : "assistant",
    text: value.transcript,
    isFinal: value.transcriptType !== "partial",
  };
}

function createFallbackSummary(messages: TranscriptMessage[]): CallSummary {
  const userMessages = messages.filter((message) => message.role === "user");
  const assistantMessages = messages.filter((message) => message.role === "assistant");
  const score = Math.min(100, 40 + userMessages.length * 10 + assistantMessages.length * 5);
  const highlights = userMessages
    .slice(0, 2)
    .map((message) => message.text)
    .join(" ");

  return {
    score,
    summary: highlights
      ? `You discussed: ${highlights}`
      : "The conversation ended before a transcript was captured.",
  };
}

export default function VoiceAgentPage() {
  const vapiRef = useRef<Vapi | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<TranscriptMessage[]>([]);
  const [topic, setTopic] = useState("");
  const [topicDraft, setTopicDraft] = useState("");
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [callSummary, setCallSummary] = useState<CallSummary | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const summaryRequestedRef = useRef(false);
  const [error, setError] = useState("");

  const isListening = status === "active";

  const generateCallSummary = useEffectEvent(async (transcript: TranscriptMessage[]) => {
    if (summaryRequestedRef.current) return;
    summaryRequestedRef.current = true;
    setCallSummary(null);
    setIsSummaryOpen(true);

    try {
      const response = await fetch("/api/ai-assistant/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, transcript }),
      });
      if (!response.ok) throw new Error("Summary request failed.");
      const result = (await response.json()) as CallSummary;
      setCallSummary(result);
    } catch (summaryError) {
      console.error("Failed to generate conversation summary:", summaryError);
      setCallSummary(createFallbackSummary(transcript));
    }
  });

  useEffect(() => {
    if (isCameraEnabled && videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
    }
  }, [isCameraEnabled]);

  useEffect(() => {
    messagesRef.current = messages;
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!vapiPublicKey) return;

    const vapi = new Vapi(vapiPublicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setStatus("active");
      setError("");
    });
    vapi.on("call-end", () => {
      setStatus("idle");
      setIsSpeaking(false);
      void generateCallSummary(messagesRef.current);
    });
    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));
    vapi.on("message", (message) => {
      const transcript = getTranscriptMessage(message);
      if (transcript?.text.trim()) {
        setMessages((current) => {
          const last = current[current.length - 1];
          const isPreviousPartial = last && !last.isFinal;

          if (isPreviousPartial && last.role === transcript.role) {
            return [...current.slice(0, -1), transcript];
          }

          return [...current, transcript];
        });
      }
    });
    vapi.on("error", (vapiError) => {
      console.error("Vapi error:", vapiError);
      setStatus("idle");
      setIsSpeaking(false);
      setError(
        "The voice conversation could not be started. Please try again.",
      );
    });

    return () => {
      void vapi.stop();
      vapi.removeAllListeners();
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      vapiRef.current = null;
    };
  }, []);

  const openTopicDialog = () => {
    setTopicDraft(topic);
    setError("");
    setIsTopicDialogOpen(true);
  };

  const startConversation = async (topicValue: string) => {
    const selectedTopic = topicValue.trim();
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

    if (!selectedTopic) {
      setError("Enter a topic before starting the conversation.");
      return;
    }
    if (!assistantId) {
      setError(
        "Vapi is not configured. Add NEXT_PUBLIC_VAPI_ASSISTANT_ID to .env.",
      );
      return;
    }
    if (!vapiRef.current || status !== "idle") return;

    setTopic(selectedTopic);
    summaryRequestedRef.current = false;
    setCallSummary(null);
    setIsTopicDialogOpen(false);
    setStatus("connecting");
    setError("");
    setMessages([]);

    try {
      await vapiRef.current.start(assistantId, {
        variableValues: { topic: selectedTopic },
      });
      vapiRef.current.setMuted(!isMicEnabled);
    } catch (startError) {
      console.error("Failed to start Vapi conversation:", startError);
      setStatus("idle");
      setError(
        "The voice conversation could not be started. Please try again.",
      );
    }
  };

  const handleTopicSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void startConversation(topicDraft);
  };

  const stopConversation = () => {
    void vapiRef.current?.stop();
    setStatus("idle");
    setIsSpeaking(false);
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    setIsCameraEnabled(false);
  };

  const toggleMicrophone = () => {
    const nextEnabled = !isMicEnabled;
    setIsMicEnabled(nextEnabled);
    vapiRef.current?.setMuted(!nextEnabled);
  };

  const toggleCamera = async () => {
    if (isCameraEnabled) {
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsCameraEnabled(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraEnabled(true);
      setError("");
    } catch (cameraError) {
      console.error("Could not access camera:", cameraError);
      setError("Camera permission was denied or is unavailable.");
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-white dark:bg-background border-b-2 border-black hover:border-black transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Models</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>AI Voice Agent</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="grid gap-4 h-[calc(100dvh-4rem)] min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-muted/30 p-4 md:px-6 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.4fr)] lg:grid-rows-[auto_minmax(0,1fr)]">
          <div className=" flex items-end justify-between gap-4 lg:col-span-2">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Voice conversation
              </h1>
            </div>
            <span className="text-sm text-muted-foreground">
              {status === "active"
                ? "In conversation"
                : status === "connecting"
                  ? "Connecting"
                  : "Ready when you are"}
            </span>
          </div>
          <section className="grid min-h-0 gap-4 overflow-hidden lg:col-start-1 lg:row-start-2 lg:grid-cols-1 lg:grid-rows-2">
            <div
              className={`relative flex min-h-65 flex-col justify-between overflow-hidden rounded-2xl border p-5 shadow-sm ${isSpeaking ? "border-blue-400 bg-blue-50/70" : "bg-card"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">AI Assistant</p>
                  <p className="text-xs text-muted-foreground">
                    {isSpeaking ? "Speaking" : "Listening"}
                  </p>
                </div>
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                  AI
                </span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg ${isSpeaking ? "animate-pulse" : ""}`}
                >
                  <Bot className="h-11 w-11" />
                </div>
                <p className="max-w-xs text-center text-sm text-muted-foreground">
                  {topic.trim() || "Your topic will appear here"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Voice
                agent {isListening ? "online" : "offline"}
              </div>
            </div>
            <div className="relative flex min-h-65 flex-col justify-between overflow-hidden rounded-2xl border bg-zinc-950 p-5 text-white shadow-sm">
              {isCameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-700">
                    <User className="h-11 w-11 text-zinc-300" />
                  </div>
                </div>
              )}
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">You</p>
                  <p className="text-xs text-zinc-300">Participant</p>
                </div>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
                  You
                </span>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-xs text-zinc-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Your
                media
              </div>
            </div>
          </section>
          <section className="mt-4 flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm lg:col-start-2 lg:row-start-2 lg:mt-0">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <div>
                <h2 className="text-sm font-semibold">Conversation</h2>
                <p className="text-xs text-muted-foreground">Live transcript</p>
              </div>
              {messages.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {messages.length} turns
                </span>
              )}
            </div>
            <div className="scrollbar-hide min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-24 items-center justify-center text-center text-sm text-muted-foreground">
                  Start the conversation to see both sides here.
                </div>
              ) : (
                messages.map((message, index) => (
                  <Message
                    key={`${message.role}-${index}`}
                    from={message.role}
                  >
                    <MessageContent from={message.role}>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                        {message.role === "user" ? "You" : "AI Assistant"}
                      </p>
                      {message.text}
                    </MessageContent>
                    <MessageAvatar from={message.role} />
                  </Message>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>
            <div className="border-t bg-background p-4">
              <div className="mx-auto flex max-w-3xl flex-col gap-3">
                {(error || !vapiPublicKey) && (
                  <p className="text-sm text-red-600">
                    {error ||
                      "Add NEXT_PUBLIC_VAPI_PUBLIC_KEY to your .env file."}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant={isMicEnabled ? "outline" : "destructive"}
                    size="icon"
                    type="button"
                    onClick={toggleMicrophone}
                    disabled={status === "idle"}
                    aria-label={
                      isMicEnabled ? "Mute microphone" : "Unmute microphone"
                    }
                  >
                    {isMicEnabled ? (
                      <Mic className="h-4 w-4" />
                    ) : (
                      <MicOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant={isCameraEnabled ? "outline" : "destructive"}
                    size="icon"
                    type="button"
                    onClick={toggleCamera}
                    aria-label={
                      isCameraEnabled ? "Turn camera off" : "Turn camera on"
                    }
                  >
                    {isCameraEnabled ? (
                      <Camera className="h-4 w-4" />
                    ) : (
                      <CameraOff className="h-4 w-4" />
                    )}
                  </Button>
                  {status === "active" ? (
                    <Button
                      variant="destructive"
                      size="lg"
                      type="button"
                      onClick={stopConversation}
                    >
                      <PhoneOff className="h-4 w-4" /> End call
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      type="button"
                      onClick={openTopicDialog}
                      disabled={status === "connecting"}
                    >
                      <Phone className="h-4 w-4" />{" "}
                      {status === "connecting"
                        ? "Connecting..."
                        : "Start conversation"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        {isTopicDialogOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsTopicDialogOpen(false);
              }
            }}
          >
            <form
              onSubmit={handleTopicSubmit}
              role="dialog"
              aria-modal="true"
              aria-labelledby="topic-dialog-title"
              className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-2xl"
            >
              <h2 id="topic-dialog-title" className="text-xl font-semibold">
                Choose a conversation topic
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell the AI assistant what you want to discuss before the call begins.
              </p>
              <label className="mt-5 block text-sm font-medium">
                Topic
                <input
                  autoFocus
                  value={topicDraft}
                  onChange={(event) => setTopicDraft(event.target.value)}
                  placeholder="e.g. Prepare for a frontend interview"
                  className="mt-2 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsTopicDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={status === "connecting"}
                >
                  Start conversation
                </Button>
              </div>
            </form>
          </div>
        )}

        {isSummaryOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsSummaryOpen(false);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="summary-dialog-title"
              className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Call complete
                  </p>
                  <h2 id="summary-dialog-title" className="mt-1 text-xl font-semibold">
                    Conversation summary
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setIsSummaryOpen(false)}
                  aria-label="Close summary"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {callSummary ? (
                <>
                  <div className="mt-5 flex items-center gap-4 rounded-xl bg-muted/60 p-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-blue-600 text-xl font-bold text-blue-600">
                      {callSummary.score}
                    </div>
                    <div>
                      <p className="font-medium">Conversation score</p>
                      <p className="text-sm text-muted-foreground">Based on participation, clarity, and engagement.</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <h3 className="text-sm font-semibold">Summary</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{callSummary.summary}</p>
                  </div>
                  {callSummary.strengths?.length ? (
                    <div className="mt-5">
                      <h3 className="text-sm font-semibold">Strengths</h3>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {callSummary.strengths.map((strength) => <li key={strength}>{strength}</li>)}
                      </ul>
                    </div>
                  ) : null}
                  {callSummary.improvements?.length ? (
                    <div className="mt-5">
                      <h3 className="text-sm font-semibold">Improve next time</h3>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {callSummary.improvements.map((improvement) => <li key={improvement}>{improvement}</li>)}
                      </ul>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">Analyzing your conversation...</p>
              )}
              <Button
                className="mt-6 w-full"
                type="button"
                onClick={() => setIsSummaryOpen(false)}
              >
                Done
              </Button>
            </section>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}