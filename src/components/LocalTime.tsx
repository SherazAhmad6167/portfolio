"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

export default function LocalTime({ prefix = "Local time", suffix = " PKT" }: { prefix?: string; suffix?: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timezone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span suppressHydrationWarning>
      {prefix && `${prefix} `}
      {time || "--:--"}
      {suffix}
    </span>
  );
}
