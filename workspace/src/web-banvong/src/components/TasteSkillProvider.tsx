/* cspell:disable */
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gsap?: any;
    ScrollTrigger?: any;
    SplitText?: any;
    Lenis?: any;
    Stage?: any;
    Scenes?: Record<string, (root: HTMLElement, opts?: any) => any>;
  }
}

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
}

export default function TasteSkillProvider() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("js");

    // 1. Setup [data-roll] rolling figure columns (references/motion.md)
    const initRollFigures = () => {
      document.querySelectorAll<HTMLElement>("[data-roll]").forEach((el) => {
        if (el.dataset.rollInit === "1") return;
        el.dataset.rollInit = "1";
        const text = el.textContent?.trim() || "";
        el.setAttribute("aria-label", text);
        el.classList.add("roll");
        const frag = document.createDocumentFragment();
        let colIndex = 0;
        for (const ch of text) {
          if (/\d/.test(ch)) {
            const digit = Number(ch);
            const col = document.createElement("span");
            col.className = "roll-col";
            col.setAttribute("aria-hidden", "true");
            col.style.setProperty("--d", String(digit));
            col.style.setProperty("--i", String(colIndex++));
            for (let n = 0; n <= 9; n++) {
              const s = document.createElement("span");
              s.textContent = String(n);
              col.appendChild(s);
            }
            frag.appendChild(col);
          } else {
            const sym = document.createElement("span");
            sym.setAttribute("aria-hidden", "true");
            sym.textContent = ch;
            frag.appendChild(sym);
          }
        }
        el.replaceChildren(frag);
      });
    };

    initRollFigures();

    // 2. Setup [data-reveal] & [data-roll] one-shot IntersectionObserver (assets/base.js)
    const revealTargets = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-roll]");

    let revealObserver: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            revealObserver?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
      );
      revealTargets().forEach((el) => revealObserver?.observe(el));
    } else {
      revealTargets().forEach((el) => el.classList.add("is-in"));
    }

    // Safety net so no [data-reveal] stays hidden if observer is skipped
    const safetyTimer = window.setTimeout(() => {
      revealTargets().forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.15 && r.bottom > 0) {
          el.classList.add("is-in");
        }
      });
    }, 1500);

    // 3. Re-observe dynamically filtered cards or modal elements
    const mo = new MutationObserver(() => {
      initRollFigures();
      revealTargets().forEach((el) => {
        if (!el.classList.contains("is-in")) {
          revealObserver?.observe(el);
        }
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // 4. Setup [data-fill] scroll-linked ink fill (references/motion.md)
    const fillEls = [...document.querySelectorAll<HTMLElement>("[data-fill]")];
    let fillRaf = 0;
    const updateFill = () => {
      fillRaf = 0;
      const vh = window.innerHeight;
      for (const el of fillEls) {
        const r = el.getBoundingClientRect();
        const p = Math.min(
          1,
          Math.max(0, (vh * 0.78 - r.top) / Math.max(1, r.height + vh * 0.28))
        );
        el.style.setProperty("--fill", `${(p * 100).toFixed(1)}%`);
      }
    };
    const onScrollFill = () => {
      if (!fillRaf && fillEls.length) {
        fillRaf = requestAnimationFrame(updateFill);
      }
    };
    if (fillEls.length) {
      window.addEventListener("scroll", onScrollFill, { passive: true });
      updateFill();
    }

    // 5. Setup [data-ink] chapter header ink sync (assets/base.js)
    const chapters = document.querySelectorAll<HTMLElement>("[data-ink]");
    let inkObserver: IntersectionObserver | null = null;
    if (chapters.length && "IntersectionObserver" in window) {
      inkObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const target = entry.target as HTMLElement;
            if (entry.isIntersecting && target.dataset.ink) {
              html.style.setProperty("--header-ink", target.dataset.ink);
            }
          }
        },
        { rootMargin: "0px 0px -92% 0px", threshold: 0 }
      );
      chapters.forEach((el) => inkObserver?.observe(el));
    }

    // 6. Initialize Taste Skill Stage (GSAP + ScrollTrigger + Lenis + Scenes)
    let cancelled = false;
    const bootStage = () => {
      if (cancelled || !window.gsap || !window.ScrollTrigger) return false;
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const mq = (q: string) => window.matchMedia(q).matches;
      const Stage = window.Stage || {
        live: true,
        get reduced() {
          return mq("(prefers-reduced-motion: reduce)");
        },
        get phone() {
          return mq("(max-width: 767px)");
        },
        get touch() {
          return mq("(pointer: coarse)");
        },
        lenis: null as any,
        scenes: [] as any[],
      };

      Stage.smooth = ({ lerp = 0.12 } = {}) => {
        if (
          !window.Lenis ||
          Stage.reduced ||
          Stage.touch ||
          Stage.lenis
        ) {
          return Stage.lenis;
        }
        const lenis = new window.Lenis({
          lerp,
          smoothWheel: true,
          anchors: true,
          autoRaf: false,
        });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((t: number) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
        html.classList.add("is-smooth");
        Stage.lenis = lenis;
        return lenis;
      };

      Stage.scene = (root: HTMLElement, opts: any = {}) => {
        if (!root) return null;
        const {
          hold = 2.4,
          scrub = 0.4,
          build,
          phone = "same",
          rest,
          beats = 4,
        } = opts;
        const stage =
          root.querySelector(":scope > .scene-stage") || root.firstElementChild;
        const q = (sel: string) => [...root.querySelectorAll<HTMLElement>(sel)];
        const toRest = (ctx: any) => {
          root.classList.remove("is-live");
          root.classList.add("is-rest");
          root.style.removeProperty("--hold");
          if (rest) rest(ctx);
        };

        const mm = gsap.matchMedia();
        mm.add(
          {
            motion: "(prefers-reduced-motion: no-preference)",
            phone: "(max-width: 1080px), (max-height: 700px)",
          },
          (c: any) => {
            const isPhone = c.conditions.phone;
            const ctx = { root, stage, phone: isPhone, q };
            const plan = isPhone
              ? phone === "rest"
                ? null
                : phone === "same"
                ? { hold, build }
                : { hold: phone.hold ?? hold, build: phone.build ?? build }
              : { hold, build };
            if (!c.conditions.motion || !plan || !plan.build) {
              toRest(ctx);
              return () => root.classList.remove("is-rest");
            }
            root.classList.remove("is-rest");
            root.classList.add("is-live");
            root.style.setProperty("--hold", String(plan.hold));
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom bottom",
                scrub,
                invalidateOnRefresh: true,
                onUpdate: (self: any) => {
                  const p = self.progress;
                  root.style.setProperty("--p", p.toFixed(4));
                  const beatIdx = beats
                    ? Math.min(beats - 1, Math.floor(p * beats))
                    : 0;
                  if (beats) {
                    root.dataset.beat = String(beatIdx);
                  }
                  window.dispatchEvent(
                    new CustomEvent("tasteskill:scene-progress", {
                      detail: {
                        scene: root.dataset.scene,
                        progress: p,
                        beat: beatIdx,
                      },
                    })
                  );
                },
              },
            });
            plan.build(tl, ctx);
            if (tl.duration() < 1) {
              tl.to({}, { duration: 1 - tl.duration() }, tl.duration());
            }
            return () => {
              root.classList.remove("is-live");
              root.style.removeProperty("--hold");
              root.style.removeProperty("--p");
            };
          }
        );
        Stage.scenes.push(mm);
        return mm;
      };

      window.Scenes = window.Scenes || {};
      window.Scenes["object-spin"] = (root: HTMLElement, opts: any = {}) => {
        return Stage.scene(root, {
          hold: opts.hold ?? 2.4,
          scrub: 0.45,
          beats: 4,
          phone: "rest",
          build(tl: any, { q }: any) {
            const callouts = q("[data-callout]");
            const meterBars = q("[data-scene-bar]");
            callouts.forEach((card: HTMLElement, idx: number) => {
              const pos = idx * 0.22;
              tl.fromTo(
                card,
                { y: 18, opacity: 0.32 },
                { y: 0, opacity: 1, duration: 0.22 },
                pos
              );
            });
            if (meterBars.length) {
              tl.fromTo(
                meterBars,
                { scaleX: 0.25 },
                { scaleX: 1, duration: 0.85, stagger: 0.1 },
                0.05
              );
            }
          },
        });
      };

      Stage.init = () => {
        document
          .querySelectorAll<HTMLElement>(".scene[data-scene]")
          .forEach((el: any) => {
            if (el.__scene) return;
            const make = window.Scenes?.[el.dataset.scene || ""];
            if (!make) return;
            let o = {};
            try {
              o = JSON.parse(el.dataset.options || "{}");
            } catch {}
            el.__scene = make(el, o) || true;
          });
      };

      window.Stage = Stage;
      Stage.smooth({ lerp: 0.12 });
      Stage.init();
      ScrollTrigger.refresh();
      return true;
    };

    const loadAndBoot = async () => {
      if (!window.gsap) {
        await loadScriptOnce(
          "https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"
        );
      }
      if (!window.ScrollTrigger) {
        await loadScriptOnce(
          "https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js"
        );
      }
      if (!window.Lenis) {
        await loadScriptOnce(
          "https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js"
        );
      }
      bootStage();
    };

    loadAndBoot();

    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
      revealObserver?.disconnect();
      inkObserver?.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScrollFill);
    };
  }, []);

  return null;
}
