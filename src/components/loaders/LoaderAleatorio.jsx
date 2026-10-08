"use client";

import { useEffect, useState } from "react";
import VolcanLoader from "./VolcanLoader";
import LagoLoader from "./LagoLoader";

export default function LoaderAleatorio() {
  const [variante, setVariante] = useState(null);

  useEffect(() => {
    // Se sortea después de montar para que servidor y navegador coincidan.
    const t = setTimeout(
      () => setVariante(Math.random() < 0.5 ? "volcan" : "lago"),
      0
    );
    return () => clearTimeout(t);
  }, []);

  if (!variante) return <div className="min-h-dvh w-full bg-brand-bg" />;
  return variante === "volcan" ? <VolcanLoader /> : <LagoLoader />;
}