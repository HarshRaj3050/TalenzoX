import { searchTool } from "@/config/tavily";

type SearchAgentState = {
	prompt: string;
	[key: string]: unknown;
};

export const searchAgent = async (state: SearchAgentState) => {
	const result = await searchTool.invoke({ query: state.prompt });
	const searchData = (() => {
		if (typeof result === "string") {
			try {
				return JSON.parse(result) as {
					results?: unknown[];
					images?: string[];
				};
			} catch {
				return { results: [], images: [] };
			}
		}

		return result as {
			results?: unknown[];
			images?: string[];
		};
	})();

	return {
		...state,
		searchResults: searchData.results ?? [],
		images: searchData.images ?? [],
	};
};
