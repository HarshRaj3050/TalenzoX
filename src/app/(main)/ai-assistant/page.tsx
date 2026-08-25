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
import MessageList, { ChatMessage } from "../_components/MessageList";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import api from "@/lib/axios";


export default function Page() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSendMessage = async () => {
    const prompt = value.trim();
    if (!prompt) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: "user", content: prompt },
    ]);
    setValue("");

    try {
      const response = await api.post("/ai-assistant/agentResponse", {
        value: prompt,
      });

      const { answer, images } = response.data as {
        answer?: string;
        images?: string[];
      };

      if (answer?.trim()) {
        setMessages((currentMessages) => [
          ...currentMessages,
          { role: "assistant", content: answer, images },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
                  <BreadcrumbPage>New Chat</BreadcrumbPage>
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
                    value={value}
                    placeholder="Type a message..."
                    className="w-full resize-none rounded-lg  px-3 py-2 text-sm outline-none"
                  />
                </div>

                <button
                  className="mb-2 bg-[#fafafa] text-black p-2 rounded-3xl"
                  onClick={handleSendMessage}
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
