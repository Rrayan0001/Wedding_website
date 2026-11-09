"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { wedding } from "@/lib/wedding";

type ParticleKind = "rose" | "jasmine" | "dust";

function createParticleElement(kind: ParticleKind, sizeClass: string) {
  const div = document.createElement("div");
  if (kind === "rose") {
    div.className = `rose-petal-item ${sizeClass}`;
    div.innerHTML = `<svg viewBox="0 0 24 30" width="100%" height="100%"><path d="M12,1 C19,7 23,15 21,23 C19,28 15,30 12,29 C9,30 5,28 3,23 C1,15 5,7 12,1 Z" fill="url(#petalRoseGrad)" /><path d="M12,4 Q14,15 11,26" fill="none" stroke="#ead8d0" stroke-width="0.7" stroke-opacity="0.45" /></svg>`;
  } else if (kind === "jasmine") {
    div.className = `jasmine-bud-item ${sizeClass}`;
    div.innerHTML = `<svg viewBox="0 0 20 22" width="100%" height="100%"><ellipse cx="10" cy="10" rx="8.6" ry="9" fill="url(#jasmineGrad)" /><g fill="#c9a15b" opacity="0.85"><circle cx="10" cy="10" r="1.4" /><circle cx="7.4" cy="9.2" r="0.9" /><circle cx="12.6" cy="9.2" r="0.9" /><circle cx="10" cy="7" r="0.9" /></g><path d="M10,19 Q10.6,20.6 10,21.6" fill="none" stroke="#8a9a5b" stroke-width="1" stroke-opacity="0.5" /></svg>`;
  } else {
    div.className = "gold-dust-dot";
  }
  return div;
}

export default function Petals() {
  const tweens = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const startContinuousFall = (el: HTMLElement, currentX: number, currentY: number, viewW: number, viewH: number, firstPass: boolean) => {
      const startX = firstPass ? currentX : gsap.utils.random(10, viewW - 30);
      const startY = firstPass ? currentY : gsap.utils.random(-80, -20);
      const kind = el instanceof HTMLElement ? ((el.dataset.kind as ParticleKind) || "rose") : "rose";
      const fallDuration = kind === "dust" ? gsap.utils.random(12, 18) : gsap.utils.random(7, 12);
      gsap.set(el, { x: startX, y: startY });
      const fallTween = gsap.to(el, { y: viewH + 50, duration: fallDuration, ease: "none", onComplete: () => startContinuousFall(el, 0, 0, viewW, viewH, false) });
      const swayTarget = kind === "dust" ? 22 : gsap.utils.random(-50, 50);
      const swayTween = gsap.to(el, { x: startX + swayTarget, rotationX: kind === "dust" ? 0 : gsap.utils.random(120, 260), rotationY: kind === "dust" ? 0 : gsap.utils.random(120, 260), rotationZ: kind === "dust" ? 0 : "+=" + gsap.utils.random(60, 140), duration: kind === "dust" ? gsap.utils.random(5, 8) : gsap.utils.random(2.2, 3.6), repeat: Math.ceil(fallDuration / 2.5), yoyo: true, ease: "sine.inOut" });
      tweens.current.push(fallTween, swayTween);
      if (kind === "dust") {
        const twinkle = gsap.to(el, { opacity: gsap.utils.random(0.25, 0.85), duration: gsap.utils.random(0.9, 1.8), repeat: Math.ceil(fallDuration / 2), yoyo: true, ease: "sine.inOut" });
        tweens.current.push(twinkle);
      }
    };

    const burst = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const stage = document.getElementById("petal-stage");
      if (!stage) return;
      stage.innerHTML = "";
      const sizes = ["small", "medium", "large"];
      const viewW = Math.min(window.innerWidth, 480);
      const viewH = window.innerHeight;
      const kinds: ParticleKind[] = ["rose", "rose", "rose", "jasmine", "dust"];
      for (let i = 0; i < wedding.maxPetals; i++) {
        const kind = kinds[i % kinds.length];
        const sizeClass = sizes[i % sizes.length];
        const el = createParticleElement(kind, sizeClass);
        el.dataset.kind = kind;
        stage.appendChild(el);
        const startX = viewW / 2;
        const startY = viewH / 2;
        const burstX = startX + gsap.utils.random(-viewW * 0.45, viewW * 0.45);
        const burstY = startY + gsap.utils.random(-viewH * 0.4, viewH * 0.15);
        gsap.set(el, { x: startX, y: startY, scale: 0.2, opacity: 0 });
        gsap.to(el, { x: burstX, y: burstY, scale: 1, opacity: kind === "dust" ? 0.7 : sizeClass === "small" ? 0.55 : 0.9, rotationZ: kind === "dust" ? 0 : gsap.utils.random(-120, 120), rotationX: kind === "dust" ? 0 : gsap.utils.random(-60, 60), duration: gsap.utils.random(0.85, 1.25), ease: "power3.out", onComplete: () => startContinuousFall(el, burstX, burstY, viewW, viewH, true) });
      }
    };

    const onVis = () => {
      if (document.hidden) tweens.current.forEach((t) => t.pause());
      else tweens.current.forEach((t) => t.resume());
    };
    window.addEventListener("petals:burst", burst);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("petals:burst", burst);
      document.removeEventListener("visibilitychange", onVis);
      tweens.current.forEach((t) => t.kill());
    };
  }, []);

  return <div id="petal-stage" aria-hidden="true"></div>;
}
