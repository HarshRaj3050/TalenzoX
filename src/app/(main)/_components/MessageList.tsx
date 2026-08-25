
import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from "react";

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
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1>TalenzoX Agent</h1>
            <p>How can I help you?</p>
            <p>
              Ask me anything - code, ideas, explanations, or just a quick
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