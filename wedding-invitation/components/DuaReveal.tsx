"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";

const DUA_AR = "بَارِكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ";
const DUA_TR = "Baarakallahu laka wa baaraka 'alayka wa jama'a baynakumaa feee khayr";
const DUA_EN = "May Allah bless you, and shower His blessings upon you, and unite you both in goodness.";

export default function DuaReveal() {
  const [opened, setOpened] = useState(false);
  const sealRef = useRef<HTMLButtonElement>(null);
  const halfLRef = useRef<HTMLDivElement>(null);
  const halfRRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const open = () => {
    if (opened) return;
    setOpened(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seal = sealRef.current;
    if (reduced || !seal) {
      if (seal) gsap.set(seal, { autoAlpha: 0 });
      cardRef.current?.classList.add("open");
      gsap.set(cardRef.current, { autoAlpha: 1 });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    tl.to(seal, { boxShadow: "0 0 22px rgba(243, 229, 171, 0.55)", duration: 0.35 }, 0);
    tl.to(".dua-seal-face", { rotation: 12, duration: 0.14, yoyo: true, repeat: 1, ease: "power1.inOut" }, 0.32);
    tl.to(halfLRef.current, { x: -7, y: 4, rotation: -9, duration: 0.55 }, 0.55);
    tl.to(halfRRef.current, { x: 7, y: 5, rotation: 8, duration: 0.55 }, 0.55);
    tl.to(seal, { autoAlpha: 0, duration: 0.4, ease: "power1.out" }, 0.9);
    cardRef.current?.classList.add("open");
    tl.to(cardRef.current, { autoAlpha: 1, duration: 0.55, ease: "power1.out" }, 1.05);
    tl.fromTo("#dua-ar-text", { opacity: 0, letterSpacing: "0.25em" }, { opacity: 1, letterSpacing: "0.04em", duration: 0.9, ease: "power2.out" }, 1.25);
    tl.fromTo("#dua-tr-text, #dua-en-text, #dua-src-text", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" }, 1.6);
  };

  return (
    <div className="dua-reveal" id="dua-reveal">
      <p className="dua-caption" id="dua-caption">Tap the golden seal, and the dua unfolds.</p>
      <button type="button" className={"dua-seal-btn" + (opened ? " opened" : "")} id="dua-seal-btn" ref={sealRef} onClick={open} aria-label="Open the sealed Dua" aria-expanded={opened} disabled={opened}>
          <div className="dua-seal-face dua-seal-face-l" ref={halfLRef} aria-hidden="true">
            <svg viewBox="0 0 68 68">
              <clipPath id="duaClipL"><rect x="0" y="0" width="34" height="68" /></clipPath>
              <g clipPath="url(#duaClipL)"><use href="#wax-seal-graphic" transform="translate(0,0)" /></g>
            </svg>
          </div>
          <div className="dua-seal-face dua-seal-face-r" ref={halfRRef} aria-hidden="true">
            <svg viewBox="0 0 68 68">
              <clipPath id="duaClipR"><rect x="34" y="0" width="34" height="68" /></clipPath>
              <g clipPath="url(#duaClipR)"><use href="#wax-seal-graphic" transform="translate(0,0)" /></g>
            </svg>
          </div>
        </button>
      <div className="dua-card" ref={cardRef}>
        <div className="dua-card-accent" aria-hidden="true"></div>
        <p className="dua-ar" id="dua-ar-text" dir="rtl" lang="ar">{DUA_AR}</p>
        <p className="dua-tr" id="dua-tr-text">{DUA_TR}</p>
        <p className="dua-en" id="dua-en-text">“{DUA_EN}”</p>
        <p className="dua-source" id="dua-src-text">— The Sunnah dua for the newlywed</p>
      </div>
    </div>
  );
}
