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
            internet lookup,
            also if LLM is know the answer you can search and give me answer.

        Return ONLY one word:

        chat
        search

        User Query:
        ${state.prompt.slice(0, 4000)}
    `

    const response = await llm.invoke(prompt)
    const finalResponse = response.content.toString().trim().toLowerCase();

    return {
        ...state,
        agent: finalResponse
    }
}