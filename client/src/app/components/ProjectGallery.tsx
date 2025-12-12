"use client";

import { gralice } from "@/fonts/fonts";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { ScrollTrigger } from "gsap/all";
import { FETCH_PROJECTResult } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProjectGalleryProps {
  projectId: string;
  project: FETCH_PROJECTResult;
}

const ProjectGallery = ({ projectId, project }: ProjectGalleryProps) => {
  const projectGallery = project?.gallery;

  if (!projectGallery) return null;

  useGSAP(() => {
    const containers = gsap.utils.toArray<HTMLDivElement[]>(
      ".work-image-container",
    );
    const images = gsap.utils.toArray<HTMLDivElement[]>(".work-image");

    images.forEach((item, i) => {
      if (i === 0) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 95%",
            scrub: 1,
            pin: containers[i - 1],
            pinSpacing: false,
          },
        })
        .to(images[i - 1], { z: -200, rotateX: 45, y: "-20%", opacity: 0 });
    });
  });

  return (
    <>
      {projectGallery.map((item, i) => {
        const mediaLQIP = item.asset?.metadata?.lqip || undefined;

        return (
          <div
            key={i}
            className="work-image-container"
            style={{ perspective: "1000px" }}
          >
            <div className="work-image flex h-screen w-full items-center justify-center bg-white p-4 xl:p-8">
              {item._type === "file" ? (
                <video
                  controls
                  autoPlay
                  muted
                  loop
                  key={i}
                  className="relative bg-white object-contain"
                >
                  <source src={item.asset?.url ? item.asset.url : ""} />
                </video>
              ) : (
                <div
                  key={i}
                  className="relative flex h-full w-full items-center justify-center bg-white"
                >
                  <Image
                    src={item ? urlFor(item).quality(90).url() : ""}
                    alt="avani image"
                    width={item.asset?.metadata?.dimensions?.width}
                    height={item.asset?.metadata?.dimensions?.height}
                    className="h-full w-auto object-contain"
                    placeholder={mediaLQIP ? "blur" : "empty"}
                    blurDataURL={mediaLQIP}
                    quality={90}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProjectGallery;
