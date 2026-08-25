/* eslint-disable @typescript-eslint/no-explicit-any */

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../lib/graph/llmModels";

export const chatAgent = async (state: any) => {
  const llm = await getModel("chat");
  const userPrompt = typeof state?.prompt === "string" ? state.prompt.slice(0, 6000) : "";

  const searchContext = state?.searchResults?.length
    ? `Web Search Result: ${JSON.stringify(state.searchResults).slice(0, 4000)} Answer the user using only the above search results.`
    : "";
  const memoryContext = state?.memorySummary
    ? `Long-term memory (use only when relevant): ${JSON.stringify(state.memorySummary).slice(0, 2000)}`
    : "";
  const recentConversation = Array.isArray(state?.recentMessages)
    ? state.recentMessages.slice(-4)
      .map((message: { role: string; content: string }) => `${message.role}: ${message.content.slice(0, 600)}`)
        .join("\n")
    : "";

  const systemPrompt = `You are TalenzoX AI, an intelligent AI assistant.

  ${searchContext}

  ${memoryContext}

  Recent conversation:
  ${recentConversation}

  if searchContext exists:
  - use search result to answer.
  - do not mention internal tools.
  
  Rules:
  
- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.

Formatting:

- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ];

  const response = await llm.invoke(messages);
  const answer =
    typeof response.content === "string"
      ? response.content
      : Array.isArray(response.content)
        ? response.content
            .map((item) =>
              typeof item === "string" ? item : JSON.stringify(item)
            )
            .join("")
        : JSON.stringify(response.content);

  return {
    ...state,
    aiResponse: answer,
  };
};
