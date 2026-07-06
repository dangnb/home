"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax logic from original snippet
    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        const heroTitle = document.getElementById('hero-title');
        const heroDesc = document.getElementById('hero-desc');

        if (heroTitle) heroTitle.style.transform = `translate(${moveX * -1}px, ${moveY * -1}px)`;
        if (heroDesc) heroDesc.style.transform = `translate(${moveX * -0.5}px, ${moveY * -0.5}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center overflow-hidden px-margin-desktop pt-24">
      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center w-full">
        <div className="z-10 reveal active" data-delay="0">
          <span className="font-label-caps text-label-caps text-primary mb-4 block">PREMIUM EXPERIENCE</span>
          <h1 className="font-display-lg text-display-lg lg:text-[72px] leading-tight mb-6 hero-parallax" id="hero-title">Precision Nail Care</h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-lg mb-10 hero-parallax" id="hero-desc">
            High-quality products, skilled technicians, and attention to detail. Experience the pinnacle of nail artistry in the heart of Prague.
          </p>
          <div className="flex gap-4">
            <Link href="/services">
              <button className="bg-on-background text-background px-10 py-5 font-button-text text-button-text uppercase tracking-widest hover:bg-primary hover:scale-105 transition-all duration-300">
                Our Services <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
            </Link>
          </div>
        </div>
        <div className="relative h-[600px] lg:h-[800px] reveal active" data-delay="200">
          <div className="absolute inset-0 bg-warm-sand -z-10 translate-x-12 translate-y-12"></div>
          <div className="w-full h-full overflow-hidden shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Precision Nail Care Hero" className="w-full h-full object-cover grayscale-luxury hover:grayscale-0 hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida/AP1WRLsm6Y9PCPUQl-URvdmq5ipK4EWJgMerQplUGJpnUqfwUmdKZRgeTY-PusEHITIrVYSm44lOFG5kEuwNblC5Hb-qn672agc4hpRPvoI6iweYZfZc_Z4kuwqXIYJtvS5DDRoa8QxYsHjPxzYMVv7cQSrDW0wO-hKW53g2Cezuw8TWWKJgQHZQKS8gQX0n8SC9uIPHBWzqiZVp0GzXIsr729zAX3ptZz36EFl8FkN4JaP0JZ3vbp2RnyqEGhAm" />
          </div>
        </div>
      </div>
    </section>
  );
}
