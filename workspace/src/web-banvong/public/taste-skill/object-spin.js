// tasteskill / scenes / object-spin.js — 3D object spin & anatomy callout scene
(() => {
  window.Scenes = window.Scenes || {};
  window.Scenes['object-spin'] = (root, opts = {}) => {
    if (!window.Stage) return null;
    const hold = opts.hold ?? 2.6;
    return window.Stage.scene(root, {
      hold,
      scrub: 0.45,
      beats: 4,
      phone: 'same',
      build(tl, { q }) {
        const cards = q('[data-callout]');
        const ring = q('[data-spin-ring]');
        if (ring.length) {
          tl.fromTo(
            ring,
            { rotate: -18, scale: 0.96 },
            { rotate: 18, scale: 1.02, duration: 1 },
            0
          );
        }
        cards.forEach((card, i) => {
          const start = i * (0.72 / Math.max(1, cards.length));
          tl.fromTo(
            card,
            { opacity: 0.28, y: 18 },
            { opacity: 1, y: 0, duration: 0.24 },
            start
          );
        });
      },
    });
  };
})();
