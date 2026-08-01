
import MessageBubble from "./MessageBubble";

const MessageList = () => {

    const selectedConversation = 0;
    const messages = [1,2];

  return (
    <div className=" h-full flex flex-col items-center overflow-y-auto px-6 py-6 space-y-5 scrollbar-none [&::-webkit-scrollbar]:hidden ">
      {!selectedConversation || messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1>Kizuna Agent</h1>
            <p>How can I help you?</p>
            <p>
              Ask me anything - code, ideas, explanations, or just a quick
              question.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl lg:min-w-3xl">
          {/* {messages.map((mes, i) => (
            <div key={i} className="">
              <MessageBubble role={mes?.role} content={mes?.content} images={mes?.images || []}/>
            </div>
          ))} */}
        </div>
      )}
    </div>
  );
};

export default MessageList;