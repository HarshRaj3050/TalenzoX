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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AiOutlinePlus } from "react-icons/ai";
import { FaArrowUp } from "react-icons/fa6";
import { Mic, MicOff } from "lucide-react";
import MessageList, { ChatMessage } from "../_components/MessageList";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import api from "@/lib/axios";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";


export default function Page() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const conversationIdRef = useRef("");
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef("");

  useEffect(() => {
    let isMounted = true;

    const loadConversation = async () => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !isMounted) return;

      conversationIdRef.current = user.id;

      try {
        const response = await api.get("/ai-assistant/agentResponse");

        if (isMounted && Array.isArray(response.data?.messages)) {
          setMessages(response.data.messages as ChatMessage[]);
        }
      } catch (error) {
        console.error("Failed to load conversation memory:", error);
      }
    };

    void loadConversation();

    return () => {
      isMounted = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (error) {
        console.error("Failed to stop recognition:", error);
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      baseTextRef.current = value;
      const prefix = baseTextRef.current
        ? baseTextRef.current.endsWith(" ")
          ? baseTextRef.current
          : `${baseTextRef.current} `
        : "";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setValue(prefix + currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setIsListening(false);
    }
  };

  const handleSendMessage = async () => {
    const prompt = value.trim();
    if (!prompt || isLoading) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop error
      }
      setIsListening(false);
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: "user", content: prompt },
    ]);
    setValue("");
    setIsLoading(true);

    try {
      const response = await api.post("/ai-assistant/agentResponse", {
        value: prompt,
        conversationId: conversationIdRef.current || undefined,
      });

      const { answer, images } = response.data as {
        answer?: string;
        images?: string[];
      };

      if (answer?.trim()) {
        if (typeof response.data.conversationId === "string") {
          conversationIdRef.current = response.data.conversationId;
        }
        setMessages((currentMessages) => [
          ...currentMessages,
          { role: "assistant", content: answer, images },
        ]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
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
                  <BreadcrumbLink href="#">AI Assistant</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Chat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col">
          <div className="min-h-0 flex-1 overflow-hidden">
            <MessageList messages={messages} />
          </div>
          <div className="sticky bottom-0 shrink-0 bg-white pb-5 pt-2">
            <div className="mx-auto w-full max-w-4xl px-4">
              <div className="flex items-end gap-2 rounded-4xl bg-[#e4eeff] px-4 ">
                <span className="mb-1.5 hover:bg-gray-900 p-2 rounded-2xl">
                  <AiOutlinePlus size={20} />
                </span>

                {/* Input Text Area */}
                <div className="flex-1 mt-1.5">
                  <TextareaAutosize
                    minRows={1}
                    maxRows={10}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={value}
                    placeholder="Type a message..."
                    className="w-full resize-none rounded-lg px-3 py-2 text-sm outline-none"
                    disabled={isLoading}
                  />
                </div>

                {/* Mic Option */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`mb-2 p-2 rounded-3xl cursor-pointer transition-all flex items-center justify-center ${
                    isListening
                      ? "bg-red-500 text-white shadow-md animate-pulse ring-2 ring-red-300"
                      : "bg-[#fafafa] text-zinc-700 hover:bg-gray-200 hover:text-black"
                  }`}
                  title={isListening ? "Listening... (click to stop)" : "Voice input"}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                  disabled={isLoading}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                {/* Send Button */}
                <button
                  type="button"
                  className="mb-2 bg-[#fafafa] text-black p-2 rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={handleSendMessage}
                  disabled={isLoading || !value.trim()}
                  title="Send message"
                  aria-label="Send message"
                >
                  <FaArrowUp />
                </button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

{
  /*
  
  <div>
      <h2>{user?.full_name ?? "No profile found"}</h2>
      <p>{user?.email ?? "No email available"}</p>
      <p>{user?.id ?? "No Id available"}</p>
  </div>  
  
*/
}
