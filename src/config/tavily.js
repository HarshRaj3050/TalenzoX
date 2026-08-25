import { TavilySearch } from "@langchain/tavily";

export const searchTool = new TavilySearch({
    maxResults: 4,
    topic: "general",
    apiKey: process.env.TAVILY_API_KEY,
    includeImages: true,
})