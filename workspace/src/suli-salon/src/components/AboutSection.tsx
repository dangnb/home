"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { setupReveal } from "@/lib/animations";

export default function AboutSection() {
  useEffect(() => {
    setupReveal();
  }, []);

  return (
    <section className="py-32 bg-warm-sand px-margin-desktop overflow-hidden reveal">
      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 relative flex justify-center items-center">
          {/* Overlapping image composition */}
          <div className="relative w-4/5 aspect-[3/4] whisper-shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Salon Expertise" className="w-full h-full object-cover grayscale-luxury hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida/AP1WRLvgJMyMloSkchi8E8sDJhJRMqpp6KFiFDHJh0Mk11QQ43Xb9ulueKIiYxLgizuBLFO3hkUC4jT8AY89mIjhPTOkzuHJw4veRVwNWuvvCDDnjCD1bO3kPO0G_X5usyUjcXbzsW5IhIe3KOGRRhGFKrsQCj3AlVn4aYeoEG2xUUysXAc7iNJNJEBzATVgfo4_v1cyrDlB5onUihR7971P5uvlEjdXCwJo6Ww8vsF9cEXu2DuvxEutrt_hTlA" />
            <div className="absolute -top-8 -left-8 bg-primary p-8 text-white hover:scale-110 transition-transform shadow-xl">
              <span className="block font-display-lg text-headline-md leading-none">10++</span>
              <span className="block font-label-caps text-[10px] mt-1">YEARS OF EXPERIENCE</span>
            </div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full border-8 border-white overflow-hidden whisper-shadow hover:scale-105 transition-transform duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Detailed Nail Art" className="w-full h-full object-cover grayscale-luxury hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida/AP1WRLu1fGVg4xRMJDSvETLQP7xkqNrrWb1SvWN05-GieM3-R4fn_j1oClLTAzxsH81AiQvqB4_lLqajZIcRoqXKqZpdfUakgj5EGdbv5GyFllvotmZN0P8SsLWvJM2xZtv629BoNbVytQOLYnK-HvrNkCJ0Owbf-Qivxi_7a4TqndmgAb-fnMaZgh_ljcR4lCUbwC2vLs5mfUma1CTC_CevlyAmxVc-cPlO47W3yk8Xb7KdaGR2j6f2r7Cf3o1j" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <span className="font-label-caps text-label-caps text-primary uppercase mb-4 block">About Suli Salon</span>
          <h2 className="font-display-lg text-display-lg mb-8 italic">Style That Speaks for You</h2>
          <p className="font-body-lg text-body-lg text-secondary mb-10">Precision nail design created for your unique look. We blend traditional techniques with contemporary aesthetics.</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-12">
            {[
              "Professional and experienced team",
              "Precision and attention to every detail",
              "Modern nail designs & latest trends",
              "High-quality, trusted products",
              "Personalized care for every client",
              "Clean, comfortable atmosphere"
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-3 hover:translate-x-2 transition-transform">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-body-md text-on-surface">{text}</span>
              </li>
            ))}
          </ul>
          <Link href="/about">
            <button className="border-2 border-primary text-primary px-8 py-4 font-button-text text-button-text uppercase tracking-widest hover:bg-primary hover:text-white hover:scale-105 transition-all">
              Explore Our Story
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
