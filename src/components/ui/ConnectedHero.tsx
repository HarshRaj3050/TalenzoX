import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

type ImageCard = {
  src: string;
  alt: string;
  className: string;
};

const imageCards: ImageCard[] = [
  {
    src: "/images/hero_image_1.jpg",
    alt: "Children learning in a classroom",
    className: `
      left-[4%] top-[16%] w-[39%] rotate-[7deg]
      sm:left-[5%] sm:top-[15%] sm:w-[24%]
      lg:left-[2%] lg:top-[7%] lg:w-[18%] lg:rotate-[10deg]
    `,
  },
  {
    src: "/images/hero_image_2.avif",
    alt: "Children working together",
    className: `
      left-[3%] top-[40%] w-[39%] rotate-[7deg]
      sm:left-[5%] sm:top-[42%] sm:w-[24%]
      lg:left-[20%] lg:top-[20%] lg:w-[18%] lg:rotate-[8deg]
    `,
  },
  {
    src: "/images/hero_image_3.avif",
    alt: "Children walking together outside",
    className: `
      left-[32%] top-[29%] w-[36%] rotate-[1deg]
      sm:left-[37%] sm:top-[29%] sm:w-[25%]
      lg:left-[40.5%] lg:top-[27%] lg:w-[18%]
    `,
  },
  {
    src: "/images/hero_image_4.avif",
    alt: "Mother and child using a tablet",
    className: `
      right-[3%] top-[17%] w-[39%] rotate-[-7deg]
      sm:left-[67%] sm:right-auto sm:top-[16%] sm:w-[24%]
      lg:left-[60.5%] lg:top-[20%] lg:w-[18%] lg:rotate-[-8deg]
    `,
  },
  {
    src: "/images/hero_image_5.avif",
    alt: "Child using a tablet",
    className: `
      right-[3%] top-[40%] w-[39%] rotate-[-8deg]
      sm:right-[5%] sm:top-[42%] sm:w-[24%]
      lg:right-[3%] lg:top-[7%] lg:w-[18%] lg:rotate-[-10deg]
    `,
  },
  {
    src: "/images/hero_image_6.avif",
    alt: "Family using a tablet together",
    className: `
      left-[4%] top-[66%] w-[39%] rotate-[7deg]
      sm:left-[5%] sm:top-[69%] sm:w-[24%]
      lg:left-[1%] lg:top-[42%] lg:w-[18%] lg:rotate-[9deg]
    `,
  },
  {
    src: "/images/hero_image_7.avif",
    alt: "Mother and daughter together",
    className: `
      left-[32%] top-[72%] w-[36%] rotate-[4deg]
      sm:left-[37%] sm:top-[70%] sm:w-[25%]
      lg:left-[20%] lg:top-[50%] lg:w-[18%]
    `,
  },
  {
    src: "/images/hero_image_8.avif",
    alt: "Children playing outside",
    className: `
      right-[3%] top-[66%] w-[39%] rotate-[-7deg]
      sm:left-[67%] sm:right-auto sm:top-[69%] sm:w-[24%]
      lg:left-[61.5%] lg:top-[50%] lg:w-[18%] lg:rotate-[-7deg]
    `,
  },
  {
    src: "/avatar/pfp3.png",
    alt: "Teacher and children in classroom",
    className: `
      hidden lg:block
      right-[0%] top-[41%] w-[19%] rotate-[-9deg]
    `,
  },
];

export default function ConnectedHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div
        className="
          relative mx-auto h-[720px] w-full
          sm:h-[680px]
          lg:h-[760px]
        "
      >
        {/* Rating */}
        <div
          className="
            absolute left-1/2 top-6 z-30
            -translate-x-1/2 text-center
            sm:top-7
            lg:top-8
          "
        >
          <div
            className="
              flex items-center justify-center
              gap-1 text-[27px] leading-none
              sm:gap-1.5 sm:text-[29px]
              lg:gap-2 lg:text-[30px] mt-5
            "
            aria-label="4.5 out of 5 stars"
          >
            <span className="text-[#f5a800]">★</span>
            <span className="text-[#f5a800]">★</span>
            <span className="text-[#f5a800]">★</span>
            <span className="text-[#f5a800]">★</span>

            <span className="relative inline-block">
              <span className="text-[#dfe3ec]">★</span>

              <span
                className="
                  absolute inset-y-0 left-0
                  w-1/2 overflow-hidden
                  text-[#f5a800]
                "
              >
                ★
              </span>
            </span>
          </div>

          <p
            className="
              mt-2 whitespace-nowrap
              text-sm font-semibold text-[#35436f]
              sm:mt-2.5
              lg:mt-3 lg:text-base
            "
          >
            200+ reviews
          </p>
        </div>

        {/* Image collage */}
        <div className="absolute inset-0">
          {imageCards.map((card, index) => (
            <div
              key={card.src}
              className={`
                absolute overflow-hidden
                rounded-[22px]
                sm:rounded-[26px]
                lg:rounded-[32px]
                ${card.className}
              `}
            >
              <div className="relative aspect-[1.55] w-full">
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  priority={index < 5}
                  sizes="
                    (max-width: 639px) 40vw,
                    (max-width: 1023px) 25vw,
                    18vw
                  "
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Heading */}
        <div
          className="
            absolute left-1/2 top-[51%] z-20
            w-[230px]
            -translate-x-1/2 -translate-y-1/2
            text-center

            sm:top-[54%]
            sm:w-[270px]

            lg:top-[62%]
            lg:w-[330px]
          "
        >
          <h1
            className={`
              text-[29px]
              font-black
              leading-[1.2]
              tracking-[-1px]
              text-black

              sm:text-[31px]

              lg:text-[26px]

              ${poppins.className}
        `}
            
          >
            Keeping teachers,
            <br />
            families, and
            <br />
            kids connected
          </h1>
        </div>
      </div>
    </section>
  );
}
