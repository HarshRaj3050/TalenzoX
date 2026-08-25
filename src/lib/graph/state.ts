import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({
  prompt: Annotation<string>(),
  aiResponse: Annotation<string>(),
  agent: Annotation<"chat" | "search">(),
  conversationId: Annotation<string>(),
  memorySummary: Annotation<Record<string, unknown>>(),
  recentMessages: Annotation<Array<{ role: "user" | "assistant"; content: string }>>(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchResults: Annotation<any[]>(),
  images: Annotation<string[]>(),
});

export type AgentState = typeof agentState.State;