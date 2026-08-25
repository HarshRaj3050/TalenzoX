import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state";
import { router } from "./route";
import { chatAgent } from "@/agents/chat.agent";
import { searchAgent } from "@/agents/search.agent";

const graph = new StateGraph(agentState)
  .addNode("router", router)
  .addNode("chat", chatAgent)
  .addNode("search", searchAgent)
  .addEdge("__start__", "router")
  .addConditionalEdges("router", (state) => state.agent, {
    chat: "chat",
    search: "search",
  })
  .addEdge("search", "chat")
  .addEdge("chat", "__end__")
  .compile();

export { graph };
