"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";
import { GiAbstract041 } from "react-icons/gi";

gsap.registerPlugin(useGSAP);

interface TransitionContextType {
  playTransition: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const { contextSafe } = useGSAP();
  const router = useRouter();
  const pathname = usePathname();

  const playTransition = contextSafe((href: string) => {
    gsap.timeline().to(".overlay", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power2.inOut",
      onComplete: () => {
        router.push(href);
      },
    });
  });

  useGSAP(
    () => {
      gsap
        .timeline()
        .to(".overlay", {
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          ease: "power2.inOut",
          delay: 0.2,
        })
        .set(".overlay", {
          clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
        });
    },
    { dependencies: [pathname] },
  );

  return (
    <TransitionContext.Provider value={{ playTransition }}>
      <div
        className="overlay fixed top-0 left-0 z-99 flex h-screen w-screen items-center justify-center overflow-hidden bg-black text-white"
        style={{ clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" }}
      >
        <GiAbstract041 className="text-9xl" />
      </div>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);

  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }

  return context;
};
