"use client";

import { gralice } from "@/fonts/fonts";
import { menuItems } from "@/lib/constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import React from "react";
import { useTransition } from "./TransitionProvider";

gsap.registerPlugin(useGSAP);

type MenuOverlayProps = {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
};

const MenuOverlay = ({ isOpen, onOpen }: MenuOverlayProps) => {
  const { playTransition } = useTransition();

  const { contextSafe } = useGSAP(() => {
    if (!isOpen) {
      gsap
        .timeline()
        .to(".menu-item", {
          translateY: "5rem",
          stagger: -0.2,
        })
        .to(".menu-overlay", {
          autoAlpha: 0,
        });
    } else {
      gsap
        .timeline()
        .to(".menu-item", {
          translateY: 0,
          stagger: 0.2,
        })
        .to(
          ".menu-overlay",
          {
            autoAlpha: 1,
          },
          "<",
        );
    }
  }, [isOpen]);

  const handleHover = contextSafe((i: number) => {
    gsap.to(`.menu-line-${i}`, {
      width: "100%",
    });
  });

  const handleMouseLeave = contextSafe((i: number) => {
    gsap.to(`.menu-line-${i}`, {
      width: 0,
    });
  });

  return (
    <div className="menu-overlay invisible fixed top-0 left-0 z-90 flex h-screen w-full flex-col justify-between p-8 font-mono opacity-0 backdrop-blur-3xl">
      <div className="flex w-full items-center justify-between uppercase">
        <p className={`${gralice.className} text-3xl xl:text-4xl`}>Avani Rai</p>
        <p onClick={() => onOpen(false)} className="cursor-pointer">
          Close
        </p>
      </div>
      <div
        className={`${gralice.className} absolute top-1/2 left-1/2 flex -translate-1/2 items-center justify-center text-5xl uppercase xl:text-7xl`}
      >
        <div className="flex flex-col items-center gap-8">
          {menuItems.map((item, i) => (
            <div
              onClick={() => {
                playTransition(item.href);
                onOpen(false);
                handleMouseLeave(i);
              }}
              onMouseEnter={() => handleHover(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              key={i}
              className="relative overflow-hidden"
            >
              <p className={`menu-item menu-item-${i} relative translate-y-20`}>
                {item.name}
              </p>
              <div
                className={`menu-line-${i} absolute top-[35%] left-0 hidden h-[3px] w-0 -translate-y-1/2 bg-black xl:block`}
              />
            </div>
          ))}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default MenuOverlay;
