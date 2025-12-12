"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import { gralice } from "@/fonts/fonts";
import Link from "next/link";

export default function HeaderWrapper() {
  const pathname = usePathname();

  if (pathname === "/") {
    return <Header />;
  } else {
    return (
      <div className="w-full">
        <div className="fixed top-0 left-0 z-99 h-fit border border-black p-4 mix-blend-difference">
          <Link
            href="/"
            className={`${gralice.className} text-3xl text-white uppercase xl:text-4xl`}
          >
            Billy Dinh
          </Link>
        </div>
        <Header />
      </div>
    );
  }
}
