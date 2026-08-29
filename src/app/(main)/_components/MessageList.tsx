
import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from "react";
import { VoicePoweredOrb } from "@/app/(main)/ai-assistant/_components/VoicePoweredOrb";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  images?: string[];
};

type MessageListProps = {
  messages: ChatMessage[];
};

const MessageList = ({ messages }: MessageListProps) => {
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={messageListRef}
      className="h-full flex flex-col items-center overflow-y-auto px-6 py-6 space-y-5 scrollbar-none [&::-webkit-scrollbar]:hidden"
    >
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="relative flex h-52 w-52 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.45),rgba(255,255,255,0.08)_24%,rgba(15,23,42,0.02)_55%,transparent_80%)] shadow-[0_0_80px_rgba(99,102,241,0.12)] ring-1 ring-white/30 sm:h-64 sm:w-64">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.23),_transparent_58%)] blur-2xl" />
            <div className="relative h-full w-full">
              <VoicePoweredOrb
                className="h-full w-full"
                hue={220}
                enableVoiceControl={false}
                maxRotationSpeed={1.1}
                maxHoverIntensity={0.9}
              />
            </div>
          </div>

          <div className="flex max-w-md flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              TalenzoX Agent
            </h1>
            <p className="text-base text-slate-600">How can I help you?</p>
            <p className="text-sm text-slate-500">
              Ask me anything - news, ideas, explanations, or just a quick
              question.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl lg:min-w-3xl">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`}>
              <MessageBubble
                role={message.role}
                content={message.content}
                images={message.images || []}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;