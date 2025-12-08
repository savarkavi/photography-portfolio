"use client";
import { gralice } from "@/fonts/fonts";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import Image from "next/image";

gsap.registerPlugin(useGSAP, SplitText);

type IntroProps = {
  onComplete: () => void;
};

const Intro = ({ onComplete }: IntroProps) => {
  const images = [
    {
      src: "/intro-img-1.webp",
    },
    {
      src: "/intro-img-2.webp",
    },
    {
      src: "/intro-img-3.webp",
    },
    {
      src: "/intro-img-4.webp",
    },
  ];

  useGSAP(
    () => {
      const imageContainers =
        gsap.utils.toArray<HTMLDivElement>(".image-container");

      const split = new SplitText(".title", { type: "chars" });

      const firstChar = split.chars[0];
      const lastChar = split.chars[split.chars.length - 1];

      const middleCharcters = split.chars.filter((char) => {
        return char !== firstChar && char !== lastChar;
      });

      const masterTl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });
      const imagesTl = gsap.timeline();

      gsap.set(".title", { opacity: 1 });

      const charctersIntroTl = gsap.timeline().from(split.chars, {
        y: gsap.utils.wrap([100, -100]),
        opacity: 0,
        stagger: 0.05,
      });

      const middleCharctersTl = gsap
        .timeline({ defaults: { ease: "power3.inOut" } })
        .to(middleCharcters, {
          y: gsap.utils.wrap([100, -100]),
          stagger: 0.05,
        })
        .to(middleCharcters, {
          width: 0,
          margin: 0,
          padding: 0,
        });

      imageContainers.forEach((container) => {
        const image = container.querySelector(".image");

        if (!image) return;

        const imageTl = gsap
          .timeline({ defaults: { duration: 1, ease: "expo.inOut" } })
          .to(container, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          })
          .to(image, { scale: 1.2 }, "<");

        imagesTl.add(imageTl);
      });

      const collapseImagesTl = gsap
        .timeline({ defaults: { ease: "expo.inOut", duration: 1 } })
        .to(imageContainers, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        })
        .to(".title", { bottom: "50%", translateY: "50%" }, "-=0.8");

      const outroTl = gsap.timeline().to(".intro-container", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        ease: "power3.in",
        duration: 0.8,
      });

      masterTl
        .add(imagesTl)
        .add(charctersIntroTl, "<")
        .add(middleCharctersTl)
        .add(collapseImagesTl, "-=0.4")
        .add(outroTl);
    },
    { dependencies: [onComplete] },
  );

  return (
    <div
      className="intro-container absolute top-0 left-0 z-10 flex h-screen w-full items-center justify-center bg-stone-950"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <div className="relative h-[500px] w-[300px] md:h-[600px] md:w-[400px]">
        {images.map((image, i) => (
          <div
            key={i}
            className="image-container absolute top-0 left-0 h-[400px] w-[300px] md:h-[500px] md:w-[400px]"
            style={{
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            }}
          >
            <Image
              priority
              src={image.src}
              alt="img"
              fill
              className="image object-cover"
            />
          </div>
        ))}
        <h1
          className={`${gralice.className} title absolute bottom-16 left-1/2 -translate-x-1/2 scale-y-180 overflow-hidden text-6xl text-nowrap text-white uppercase opacity-0 mix-blend-difference md:text-7xl`}
        >
          Harsh Jani
        </h1>
      </div>
    </div>
  );
};

export default Intro;
