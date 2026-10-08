"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { mostrarLoader, ocultarLoader } from "../../lib/loaderStore";

// Cuánto se queda el loader visible al cambiar de página (ms), aunque la página ya esté lista.
const DURACION_MINIMA = 1500;
// Por si una navegación se cancela o falla: el loader nunca se queda pegado más de esto (ms).
const TIEMPO_MAXIMO = 5000;

/**
 * Muestra el loader al tocar un enlace interno y lo oculta cuando la ruta ya cambió
 * y pasó la duración mínima. No renderiza nada: se monta una vez en app/layout.js.
 * Para quitar este efecto basta con borrar <NavegacionLoader /> del layout.
 */
export default function NavegacionLoader() {
  const pathname = usePathname();
  const activo = useRef(false);
  const inicio = useRef(0);
  const maximo = useRef(null);

  const terminar = useCallback(() => {
    if (!activo.current) return;
    activo.current = false;
    clearTimeout(maximo.current);
    ocultarLoader();
  }, []);

  // 1) Al tocar un enlace interno que lleva a otra ruta, mostramos el loader.
  useEffect(() => {
    function alHacerClic(evento) {
      // Nota: no se revisa defaultPrevented porque el <Link> de Next lo marca al navegar.
      if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;

      const origen = evento.target instanceof Element ? evento.target : null;
      const enlace = origen?.closest("a[href]");
      if (!enlace || enlace.target === "_blank" || enlace.hasAttribute("download")) return;

      const destino = new URL(enlace.href, window.location.href);
      if (destino.origin !== window.location.origin) return; // enlace externo
      if (destino.pathname === window.location.pathname) return; // misma página o ancla (#contenido)
      if (activo.current) return;

      activo.current = true;
      inicio.current = Date.now();
      mostrarLoader();
      maximo.current = setTimeout(terminar, TIEMPO_MAXIMO);
    }

    document.addEventListener("click", alHacerClic);
    return () => document.removeEventListener("click", alHacerClic);
  }, [terminar]);

  // 2) Cuando la ruta cambió, esperamos lo que falte para cumplir la duración mínima.
  useEffect(() => {
    if (!activo.current) return;
    const restante = Math.max(0, DURACION_MINIMA - (Date.now() - inicio.current));
    const temporizador = setTimeout(terminar, restante);
    return () => clearTimeout(temporizador);
  }, [pathname, terminar]);

  return null;
}