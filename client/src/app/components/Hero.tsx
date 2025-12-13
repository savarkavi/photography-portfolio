"use client";

import { gralice, oldNewsPaper } from "@/fonts/fonts";
import { FETCH_FEATURED_PROJECTSResult } from "@/sanity/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/all";
import { Url } from "next/dist/shared/lib/router/router";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useTransition } from "./TransitionProvider";
import { urlFor } from "@/sanity/lib/image";

gsap.registerPlugin(useGSAP, Observer);

type HeroProps = {
  featuredProjects: FETCH_FEATURED_PROJECTSResult;
  introComplete?: boolean;
};

const Hero = ({ featuredProjects, introComplete = false }: HeroProps) => {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const { playTransition } = useTransition();

  const [activeIdx, setActiveIdx] = useState(0);

  const projects = featuredProjects?.projects;
  if (!projects) return null;

  useGSAP(
    () => {
      if (!imageContainerRef.current) return;
      const images = gsap.utils.toArray<HTMLImageElement>(
        imageContainerRef.current.children,
      );
      const rotatingElements = gsap.utils.toArray<HTMLElement>(
        ".project-media-inner",
      );

      const firstImage = images[0];
      if (!firstImage) return;

      const numImagesInSet = projects.length;
      const imageWidth = firstImage.offsetWidth;
      const gap = 16;
      const totalItemWidth = imageWidth + gap;
      const accurateLoopWidth = numImagesInSet * totalItemWidth;
      const centerPos = window.innerWidth / 2 - firstImage.offsetWidth / 2;
      const initialX = centerPos - accurateLoopWidth;

      let scrollObserver: Observer | null = null;
      let updateAnimation: (() => void) | null = null;

      gsap.set(rotatingElements, { force3D: true, filter: "brightness(1)" });

      const tl = gsap.timeline({
        paused: !introComplete,
        onComplete: () => {
          let currentX = initialX;
          let targetX = initialX;
          const speed = 1.2;
          const wrapX = gsap.utils.wrap(initialX - accurateLoopWidth, initialX);

          updateAnimation = () => {
            currentX += (targetX - currentX) * 0.08;
            let visualX = wrapX(currentX);
            gsap.set(imageContainerRef.current, { x: visualX });
          };

          gsap.ticker.add(updateAnimation);

          scrollObserver = Observer.create({
            target:
              window.innerWidth >= 1280 ? window : imageContainerRef.current,
            type: "wheel,touch",
            wheelSpeed: -1,
            tolerance: 50,
            preventDefault: true,
            onWheel: (self) => {
              targetX += self.deltaY * speed;

              const rotationMultiplier = -0.25;
              const maxRotation = 15;

              const rotation = gsap.utils.clamp(
                -maxRotation,
                maxRotation,
                self.deltaY * rotationMultiplier,
              );

              gsap.to(rotatingElements, {
                rotateX: rotation,
                transformOrigin: "center center",
                duration: 1.5,
                ease: "power2.out",
                filter: "brightness(1.8)",
                overwrite: "auto",
                backfaceVisibility: "hidden",
              });
            },
            onDrag: (self) => {
              const maxDeltaPerEvent = 100;
              const touchMultiplier = 0.6;
              const raw = (self.deltaX ?? 0) * touchMultiplier * 1.0;
              const delta = gsap.utils.clamp(
                -maxDeltaPerEvent,
                maxDeltaPerEvent,
                raw,
              );
              targetX += delta;

              const rotationMultiplier = -0.25;
              const maxRotation = 15;

              const rotation = gsap.utils.clamp(
                -maxRotation,
                maxRotation,
                self.deltaX * rotationMultiplier,
              );

              gsap.to(rotatingElements, {
                rotateX: rotation,
                transformOrigin: "center center",
                duration: 1.5,
                ease: "power2.out",
                filter: "brightness(1.8)",
                overwrite: "auto",
                backfaceVisibility: "hidden",
              });
            },
            onStop: () => {
              gsap.to(rotatingElements, {
                rotateX: 0,
                duration: 1.5,
                filter: "brightness(1)",
                ease: "elastic.out(1, 0.5)",
              });

              const unwrappedClosestIndex = Math.round(
                (centerPos - targetX) / totalItemWidth,
              );

              const unwrappedSnapX =
                centerPos - unwrappedClosestIndex * totalItemWidth;

              targetX = unwrappedSnapX;

              const wrappedIndex =
                ((unwrappedClosestIndex % numImagesInSet) + numImagesInSet) %
                numImagesInSet;

              setActiveIdx(wrappedIndex);
            },
          });
        },
      });

      if (introComplete) {
        tl.fromTo(
          imageContainerRef.current,
          { x: centerPos, opacity: 0, scale: 0.5 },
          {
            x: initialX,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          },
        )
          .fromTo(
            ".avani-title-text",
            { opacity: 0, x: -200 },
            { opacity: 1, x: 0, duration: 1 },
            "<",
          )
          .fromTo(
            ".avani-info-text",
            {
              opacity: 0,
              x: window.innerWidth >= 1280 ? -200 : 0,
              y: window.innerWidth >= 1280 ? 0 : 100,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 1,
            },
            "<",
          )
          .fromTo(
            [".rai-title-text", ".project-info-text"],
            { opacity: 0, x: 200 },
            { opacity: 1, x: 0, duration: 1 },
            "<",
          )
          .fromTo(
            ".instagram-info",
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0 },
            "<",
          );
      }

      return () => {
        if (scrollObserver) {
          scrollObserver.kill();
        }
        if (updateAnimation) {
          gsap.ticker.remove(updateAnimation);
        }
      };
    },
    { scope: heroContainerRef, dependencies: [introComplete] },
  );

  return (
    <div
      ref={heroContainerRef}
      className="hero-container relative flex h-dvh flex-col justify-between overflow-hidden [perspective:1000px]"
    >
      <h1
        className={`${gralice.className} avani-title-text absolute top-[12%] z-10 w-full text-center text-[16vw] leading-20 uppercase opacity-0 md:text-[15vw] xl:top-12 xl:left-6 xl:text-left xl:leading-50 2xl:top-20`}
      >
        BiL.Ly <span className="xl:hidden">Dinh</span>
      </h1>
      <div
        className={`${oldNewsPaper.className} project-info-text absolute top-[72%] z-20 flex w-full flex-col items-center gap-4 px-4 text-[0.7rem] opacity-0 xl:top-26 xl:right-6 xl:w-auto xl:p-0 xl:text-[0.9rem] 2xl:text-base`}
      >
        <div
          className={`flex w-full justify-center gap-2 text-black uppercase`}
        >
          <div className="flex flex-col gap-2">
            <h2>In Focus:</h2>
            <p className="w-fit bg-black p-1 leading-none text-white">
              {projects[activeIdx].projectName}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p>{projects[activeIdx].date}</p>
            <p className="flex w-fit items-center gap-2 leading-none">
              Featured in
              <span className="bg-black p-1 text-white">
                {projects[activeIdx].category}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div
        style={{ perspective: "1000px" }}
        ref={imageContainerRef}
        className="absolute top-[47%] z-10 flex w-max -translate-y-1/2 items-center gap-4 opacity-0 brightness-100 [transform-style:preserve-3d] xl:top-1/2"
      >
        <>
          {projects.map((item, i) => {
            const mediaUrl = item.coverMedia?.asset?.url;
            const isImage = item.coverMedia?._type === "image";

            if (item.coverMedia) {
              const imgUrl = isImage
                ? urlFor(item.coverMedia)
                    .width(600)
                    .height(500)
                    .quality(90)
                    .url()
                : null;

              return (
                <div
                  key={`set-name-${i}`}
                  className="cursor-pointer [perspective:1000px]"
                  onClick={() => playTransition(`/works/${item._id}`)}
                >
                  <div className="project-media-inner will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]">
                    {isImage ? (
                      <Image
                        src={imgUrl!}
                        alt="photography"
                        width={300}
                        height={250}
                        className="h-[300px] w-[250px] shrink-0 object-cover 2xl:h-[350px] 2xl:w-[300px]"
                        quality={90}
                      />
                    ) : (
                      <video
                        src={mediaUrl || ""}
                        className="h-[300px] w-[250px] shrink-0 object-cover 2xl:h-[350px] 2xl:w-[300px]"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                      />
                    )}
                  </div>
                </div>
              );
            }
          })}
        </>
        <>
          {projects.map((item, i) => {
            const mediaUrl = item.coverMedia?.asset?.url;
            const isImage = item.coverMedia?._type === "image";

            if (item.coverMedia) {
              const imgUrl = isImage
                ? urlFor(item.coverMedia)
                    .width(600)
                    .height(500)
                    .quality(90)
                    .url()
                : null;

              return (
                <div
                  key={`set-name-${i}`}
                  className="cursor-pointer [perspective:1000px]"
                  onClick={() => playTransition(`/works/${item._id}`)}
                >
                  <div className="project-media-inner will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]">
                    {isImage ? (
                      <Image
                        src={imgUrl!}
                        alt="photography"
                        width={300}
                        height={250}
                        className="h-[300px] w-[250px] shrink-0 object-cover 2xl:h-[350px] 2xl:w-[300px]"
                        quality={90}
                      />
                    ) : (
                      <video
                        src={mediaUrl || ""}
                        className="h-[300px] w-[250px] shrink-0 object-cover 2xl:h-[350px] 2xl:w-[300px]"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                      />
                    )}
                  </div>
                </div>
              );
            }
          })}
        </>
        <>
          {projects.map((item, i) => {
            const mediaUrl = item.coverMedia?.asset?.url;
            const isImage = item.coverMedia?._type === "image";

            if (item.coverMedia) {
              const imgUrl = isImage
                ? urlFor(item.coverMedia)
                    .width(600)
                    .height(500)
                    .quality(90)
                    .url()
                : null;

              return (
                <div
                  key={`set-name-${i}`}
                  className="cursor-pointer [perspective:1000px]"
                  onClick={() => playTransition(`/works/${item._id}`)}
                >
                  <div className="project-media-inner will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]">
                    {isImage ? (
                      <Image
                        src={imgUrl!}
                        alt="photography"
                        width={300}
                        height={250}
                        className="h-[300px] w-[250px] shrink-0 object-cover 2xl:h-[350px] 2xl:w-[300px]"
                        quality={90}
                      />
                    ) : (
                      <video
                        src={mediaUrl || ""}
                        className="h-[300px] w-[250px] shrink-0 object-cover 2xl:h-[350px] 2xl:w-[300px]"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                      />
                    )}
                  </div>
                </div>
              );
            }
          })}
        </>
      </div>
      <div
        className={`${oldNewsPaper.className} instagram-info absolute top-[82%] left-1/2 flex -translate-1/2 flex-col items-center gap-2 uppercase opacity-0 xl:top-[75%]`}
      >
        <p className="hidden xl:block">
          {activeIdx + 1} / {projects.length}
        </p>
        <p className="text-[0.7rem] xl:text-sm">
          See on{" "}
          <Link
            href={projects[activeIdx].instagramLink as Url}
            className="underline"
          >
            Instagram
          </Link>
        </p>
      </div>
      <div className="plus-center fixed top-[45%] left-1/2 z-20 -translate-1/2 mix-blend-difference xl:top-1/2">
        <div className="absolute top-0 left-0 h-6 w-[1.5px] bg-white" />
        <div className="absolute top-0 left-0 h-6 w-[1.5px] rotate-90 bg-white" />
      </div>
      <div className="avani-info-text absolute bottom-6 left-1/2 w-full -translate-x-1/2 px-8 opacity-0 sm:w-fit sm:px-0 xl:left-[10%]">
        <div
          className={`${oldNewsPaper.className} relative px-6 py-2 text-center text-[0.7rem] uppercase before:absolute before:top-0 before:left-0 before:h-4 before:w-4 before:border-t-2 before:border-l-2 before:content-[''] after:absolute after:right-0 after:bottom-0 after:h-4 after:w-4 after:border-r-2 after:border-b-2 after:content-[''] xl:text-left xl:text-base`}
        >
          <p>New York based</p>
          <p>photographer & filmmaker</p>
        </div>
      </div>
      <h1
        className={`${gralice.className} rai-title-text absolute right-8 bottom-0 z-10 hidden text-[16vw] leading-20 uppercase opacity-0 xl:block xl:leading-50 2xl:leading-56`}
      >
        Dinh
      </h1>
    </div>
  );
};

export default Hero;
