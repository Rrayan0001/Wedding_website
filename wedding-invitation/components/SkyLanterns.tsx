"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function createLantern() {
  const el = document.createElement("div");
  el.className = "sky-lantern-item";
  const scale = gsap.utils.random(0.8, 1.5);
  el.style.setProperty("--sl-scale", String(scale));
  el.innerHTML = `<svg viewBox="0 0 64 160" width="100%" height="100%"><circle class="sky-lantern-halo" cx="32" cy="100" r="30" fill="url(#lanternHaloGrad)" /><path d="M20,50 Q32,34 44,50 Z" fill="url(#goldMetallicGrad)" opacity="0.9" /><polygon points="18,50 46,50 50,100 14,100" fill="#3a0814" stroke="url(#goldMetallicGrad)" stroke-width="2" /><path class="sky-lantern-flame" d="M23,96 L23,68 Q32,55 41,68 L41,96 Z" fill="#f3e5ab" opacity="0.95" /><line x1="32" y1="50" x2="32" y2="100" stroke="#c9a15b" stroke-width="1" opacity="0.8" /><polygon points="14,100 50,100 40,112 24,112" fill="url(#goldMetallicGrad)" opacity="0.9" /><path d="M26,112 Q32,122 38,112" fill="none" stroke="#f3e5ab" stroke-width="1.2" opacity="0.55" /></svg>`;
  return el;
}

export default function SkyLanterns() {
  const tweens = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = document.getElementById("sky-lantern-stage");
    if (!stage) return;
    const viewH = () => window.innerHeight;

    const drift = (el: HTMLElement, firstPass: boolean) => {
      const x = gsap.utils.random(6, Math.max(60, window.innerWidth - 60));
      const startY = firstPass ? viewH() + 60 : viewH() + gsap.utils.random(40, 200);
      const riseDuration = gsap.utils.random(14, 24);
      gsap.set(el, { x, y: startY, opacity: 0, rotation: gsap.utils.random(-6, 6) });
      const riseTween = gsap.to(el, {
        y: -140, duration: riseDuration, ease: "none", delay: firstPass ? 0 : 0,
        onUpdate: function () {
          const progress = this.progress();
          el.style.opacity = String(Math.min(progress * 5, 1) * (progress > 0.82 ? Math.max(0, (1 - progress) / 0.18) : 1) * 0.85);
        },
        onComplete: () => drift(el, false),
      });
      const swayTween = gsap.to(el, { x: "+=" + gsap.utils.random(-34, 34), rotation: gsap.utils.random(-7, 7), duration: gsap.utils.random(4, 7), repeat: Math.ceil(riseDuration / 4), yoyo: true, ease: "sine.inOut" });
      const flicker = gsap.to(el.querySelector(".sky-lantern-flame"), { opacity: gsap.utils.random(0.65, 1), duration: gsap.utils.random(0.5, 1.1), repeat: -1, yoyo: true, ease: "sine.inOut" });
      tweens.current.push(riseTween, swayTween, flicker);
    };

    const count = window.innerWidth < 420 ? 5 : 7;
    const lanterns: HTMLElement[] = [];
    for (let i = 0; i < count; i++) {
      const el = createLantern();
      stage.appendChild(el);
      lanterns.push(el);
      gsap.delayedCall(i * 3.4 + gsap.utils.random(0, 2), () => drift(el, true));
    }

    const onVis = () => {
      if (document.hidden) tweens.current.forEach((t) => t.pause());
      else tweens.current.forEach((t) => t.resume());
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      tweens.current.forEach((t) => t.kill());
    };
  }, []);

  return <div id="sky-lantern-stage" aria-hidden="true"></div>;
}
