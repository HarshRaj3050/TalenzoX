import Markdown from "react-markdown";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  images: string[];
};

const messageBubble = ({ role, content, images }: MessageBubbleProps) => {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`${isUser ? "bg-[#1a1a1a] p-2.5 px-4.5 rounded-full" : "mt-10 mb-10"}`}
      >
        {/* {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {images.map((img, i) => (
              <span key={i}>
                <a href={img} target="_blank">
                  <img
                    key={i}
                    src={img}
                    loading="lazy"
                    onError={(e) => e.currentTarget.remove()}
                    className="w-35 md:w-40 h-28 rounded-xl object-cover border-white/10 cursor-zoom-in hover:opacity-90 transition"
                  />
                </a>
              </span>
            ))}
          </div>
        )} */}
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
};

export default messageBubble;