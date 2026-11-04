"use client";

import { useEffect, useState } from "react";
import { makePage } from "@keystatic/next/ui/app";
import config from "../../../keystatic.config";

const KeystaticPage = makePage(config);

/**
 * The public site uses trailing-slash URLs (/platform/x/), and Next.js applies that
 * to every route. Keystatic's router expects no trailing slash, so after Next has
 * settled the address we strip the slash and only then start the dashboard.
 */
export default function KeystaticApp() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    if (pathname.length > 1 && pathname.endsWith("/")) {
      window.history.replaceState(window.history.state, "", pathname.replace(/\/+$/, "") + search + hash);
    }
    setReady(true);
  }, []);
  return ready ? <KeystaticPage /> : null;
}
