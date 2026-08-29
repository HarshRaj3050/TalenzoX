import { ChatGroq } from "@langchain/groq"
// import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "qwen/qwen3.8-27b",
    temperature: 0,
    maxTokens: 1024,
    maxRetries: 0,
})

/* 
const gemini = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-flash",
    temperature: 0,
    maxRetries: 2,
})
*/

export const getModel =  async (agent: string)=>{
    switch(agent){
        case "chat":
            return groq;
        case "search":
            return groq;
        default:
            return groq;
    }
}