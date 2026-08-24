import { getModel } from './llmModels';

export const router = async (state: { prompt: string }) => {
    const llm = await getModel("router")
    const prompt = `
        You are an agent router.
        Available agents:

        - chat
        - search

        Rules:

        chat:
            General conversation,
            explanations,
            learning,
            questions.

        search:
            Current events,
            latest information,
            news,
            recent developments,
            internet lookup.

        Return ONLY one word:

        chat
        search

        User Query:
        ${state.prompt}
    `

    const response = await llm.invoke(prompt)
    const finalResponse = response.content.toString().trim().toLowerCase();

    return {
        ...state,
        agent: finalResponse
    }
}