export const router = async (state: { prompt: string }) => {
    const realtimePattern =
        /\b(today|now|current|latest|recent|news|weather|price|stock|score|schedule|live|trending|this year|202[4-9])\b/i;
    const finalResponse = realtimePattern.test(state.prompt) ? "search" : "chat";

    return {
        ...state,
        agent: finalResponse
    }
}