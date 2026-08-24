/* eslint-disable @typescript-eslint/no-explicit-any */

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../lib/graph/llmModels";

export const chatAgent = async (state: any) => {
  const llm = await getModel("chat");
  const userPrompt = typeof state?.prompt === "string" ? state.prompt : "";

  const searchContext = state?.searchResults?.length
    ? `Web Search Result: ${JSON.stringify(state.searchResults)} Answer the user using only the above search results.`
    : "";

  const systemPrompt = `You are TalenzoX AI, an intelligent AI assistant.

  ${searchContext}

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
