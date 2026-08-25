import { searchTool } from "@/config/tavily";

type SearchAgentState = {
	prompt: string;
	[key: string]: unknown;
};

export const searchAgent = async (state: SearchAgentState) => {
	try {
		const result = await searchTool.invoke({ query: state.prompt });
		const searchData = result as {
			results?: unknown[];
			images?: string[];
		};

		return {
			...state,
			searchResults: searchData.results ?? [],
			images: searchData.images ?? [],
		};
	} catch (error) {
		console.error("search agent error:", error);
		return {
			...state,
			searchResults: [],
			images: [],
		};
	}
};
