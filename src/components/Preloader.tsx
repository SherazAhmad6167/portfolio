"use client";

import { useEffect } from "react";
import { markIntroDone } from "@/lib/intro";

/**
 * The hero's letter storm now plays the role of an intro, so there is no separate
 * loading screen. This just tells intro-aware animations they can start.
 */
export default function Preloader() {
  useEffect(() => {
    markIntroDone();
  }, []);
  return null;
}
