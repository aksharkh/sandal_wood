"use client";

import dynamic from "next/dynamic";

// WebGL is client-only and heavy: load it after the page is interactive.
// Three.js is bundled with the site, so nothing is fetched from a CDN (works in mainland China).
export const HeroScene = dynamic(() => import("./Scenes").then((m) => m.HeroScene), { ssr: false });
export const StoryScene = dynamic(() => import("./Scenes").then((m) => m.StoryScene), { ssr: false });
