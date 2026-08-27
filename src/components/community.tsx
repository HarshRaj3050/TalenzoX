/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"

const reviews = [
  // Image only
  {
    img: "/community/community4.jpg",
  },

  // Normal card
  {
    img: "/community/community1.avif"
  },

  // Image only
  {
    img: "/images/hero_image_6.avif",
  },

  // Normal card
  {
    name: "Mrs. W",
    username: "@artwithmrs_k",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "/avatar/pfp2.png",
  },

  // Image only
  {
    img: "/community/community3.avif",
  },

  // Normal card
  {
    name: "Mrs. K",
    username: "@artwithmrs_k",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/avatar/pfp3.png",
  },

  // Image only
  {
    img: "/community/community5.jpg",
  },

  // Normal card
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/avatar/pfp5.png",
  },

  // Normal card
  {
    img: "/community/community2.avif"
  },

  // Image only
  {
    img: "/community/community6.avif",
  },

  // Normal card
  {
    name: "Katie E.",
    username: "@katieerb",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/avatar/pfp4.png",
  },
]

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2))
const secondRow = reviews.slice(Math.ceil(reviews.length / 2))

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name?: string
  username?: string
  body?: string
}) => {
  const isImageOnly = !name && !username && !body

  /* ------------------------------------------------------------------------ */
  /* Image only                                                               */
  /* ------------------------------------------------------------------------ */

  if (isImageOnly) {
    return (
      <figure
        className={cn(
          "relative h-60 w-80 shrink-0",
          "cursor-pointer overflow-hidden rounded-xl",
          "border border-gray-950/10",
          "dark:border-gray-50/10",
          "transition-transform duration-300",
          "hover:scale-[1.02] "
        )}
      >
        <img
          src={img}
          alt=""
          loading="lazy"
          draggable={false}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />
      </figure>
    )
  }

  /* ------------------------------------------------------------------------ */
  /* Normal card                                                              */
  /* ------------------------------------------------------------------------ */

  return (
    <figure
      className={cn(
        "relative h-60 w-auto shrink-0",
        "cursor-pointer overflow-hidden rounded-xl",
        "border p-4 flex flex-col justify-center",

        "border-gray-950/10",
        "bg-white/85",
        "hover:bg-white",

        "dark:border-gray-50/10",
        "dark:bg-white/90",
        "dark:hover:bg-gray-50/15",

        "transition-transform duration-300",
        "hover:scale-[1.02]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="size-14 shrink-0 rounded-full  object-cover"
          width={64}
          height={64}
          alt=""
          src={img}
        />

        <div className="flex min-w-0 flex-col ">
          {name && (
            <figcaption className="truncate text-3xl font-medium dark:text-white ">
              {name}
            </figcaption>
          )}

          {username && (
            <p className="truncate text-md font-medium text-muted-foreground dark:text-white/40">
              {username}
            </p>
          )}
        </div>
      </div>

      {body && (
        <blockquote className="mt-2 line-clamp-6 text-md leading-relaxed">
          {body}
        </blockquote>
      )}
    </figure>
  )
}

export function CommunityReview() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee
        pauseOnHover
        className="[--duration:25s]"
      >
        {firstRow.map((review, index) => (
          <ReviewCard
            key={`${review.img}-${index}`}
            {...review}
          />
        ))}
      </Marquee>

      <Marquee
        reverse
        pauseOnHover
        className="[--duration:25s]"
      >
        {secondRow.map((review, index) => (
          <ReviewCard
            key={`${review.img}-${index}`}
            {...review}
          />
        ))}
      </Marquee>
    </section>
  )
}