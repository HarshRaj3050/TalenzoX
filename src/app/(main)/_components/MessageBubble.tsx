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
        className={`${isUser ? "bg-[#1a1a1a] text-white p-2.5 px-4.5 rounded-full mb-10" : "mb-10"}`}
      >
        {images.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {images.map((image, index) => (
              <a
                key={`${image}-${index}`}
                href={image}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  onError={(event) => event.currentTarget.remove()}
                  className="h-28 w-35 rounded-xl border border-black/10 object-cover transition hover:opacity-90 md:w-40"
                />
              </a>
            ))}
          </div>
        )}
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
};

export default messageBubble;