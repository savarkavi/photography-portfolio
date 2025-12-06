"use client";

import { FETCH_FEATURED_PROJECTSResult } from "@/sanity/types";
import React, { useState } from "react";
import Hero from "./Hero";
import gsap from "gsap";
import Intro from "./Intro";

const HomeContainer = ({
  featuredProjects,
}: {
  featuredProjects: FETCH_FEATURED_PROJECTSResult;
}) => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div>
      <Intro onComplete={() => setIntroComplete(true)} />
      <Hero featuredProjects={featuredProjects} introComplete={introComplete} />
    </div>
  );
};

export default HomeContainer;
