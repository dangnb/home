/* ==========================================================================
   LINH NGỌC ĐƯỜNG — REAL-TIME 3D WEBGL GEMSTONE BRACELET ENGINE (THREE.JS)
   Snug Tangent Beads, Volumetric Silk Rutile, Velvet Cushion & Shared Card 3D
   ========================================================================== */

(function () {
  'use strict';

  if (typeof window === 'undefined' || !window.THREE) {
    return;
  }

  const THREE = window.THREE;

  // -------------------------------------------------------------------------
  // 1. STUDIO HDRI DOME & HIGH-CONTRAST NATURAL MINERAL TEXTURES
  // -------------------------------------------------------------------------
  let sharedEnvMap = null;
  let sharedPillowShadowTex = null;
  const stoneTexCache = new Map();

  function getStudioEnvMap(renderer) {
    if (sharedEnvMap) return sharedEnvMap;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep jeweler's studio environment dome (high contrast for wet gemstone reflections)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, '#293D33');
    bgGrad.addColorStop(0.42, '#101A15');
    bgGrad.addColorStop(1, '#050806');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Crisp overhead softbox arch (gives gemstones their signature "wet water-gloss" highlight)
    const keyBox = ctx.createRadialGradient(310, 88, 8, 310, 88, 210);
    keyBox.addColorStop(0, 'rgba(255, 254, 248, 1.0)');
    keyBox.addColorStop(0.24, 'rgba(255, 246, 220, 0.92)');
    keyBox.addColorStop(0.6, 'rgba(238, 204, 140, 0.28)');
    keyBox.addColorStop(1, 'rgba(238, 204, 140, 0)');
    ctx.fillStyle = keyBox;
    ctx.fillRect(0, 0, 1024, 512);

    // Cool secondary rim strip for edge definition
    const rimBox = ctx.createRadialGradient(770, 140, 10, 770, 140, 180);
    rimBox.addColorStop(0, 'rgba(235, 248, 255, 0.9)');
    rimBox.addColorStop(0.42, 'rgba(175, 218, 245, 0.34)');
    rimBox.addColorStop(1, 'rgba(175, 218, 245, 0)');
    ctx.fillStyle = rimBox;
    ctx.fillRect(0, 0, 1024, 512);

    // Warm golden subsurface bounce from below
    const bounce = ctx.createRadialGradient(512, 430, 18, 512, 430, 320);
    bounce.addColorStop(0, 'rgba(236, 188, 98, 0.62)');
    bounce.addColorStop(0.52, 'rgba(182, 130, 48, 0.24)');
    bounce.addColorStop(1, 'rgba(182, 130, 48, 0)');
    ctx.fillStyle = bounce;
    ctx.fillRect(0, 0, 1024, 512);

    const envTex = new THREE.CanvasTexture(canvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;

    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      sharedEnvMap = pmrem.fromEquirectangular(envTex).texture;
      pmrem.dispose();
      envTex.dispose();
    } catch (_) {
      sharedEnvMap = envTex;
    }

    return sharedEnvMap;
  }

  function getVelvetPlinthTexture() {
    if (sharedPillowShadowTex) return sharedPillowShadowTex;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Velvet cushion spotlight + soft ring contact shadow
    const cushion = ctx.createRadialGradient(256, 256, 10, 256, 256, 250);
    cushion.addColorStop(0, 'rgba(32, 54, 44, 0.55)');
    cushion.addColorStop(0.36, 'rgba(18, 32, 26, 0.48)');
    cushion.addColorStop(0.55, 'rgba(3, 6, 5, 0.72)');
    cushion.addColorStop(0.75, 'rgba(6, 12, 9, 0.32)');
    cushion.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = cushion;
    ctx.fillRect(0, 0, 512, 512);

    sharedPillowShadowTex = new THREE.CanvasTexture(canvas);
    sharedPillowShadowTex.colorSpace = THREE.SRGBColorSpace;
    return sharedPillowShadowTex;
  }

  /**
   * Generates deep, realistic mineral textures with internal caustic luminosity
   */
  function getStoneTextures(stoneKey, palette) {
    if (stoneTexCache.has(stoneKey)) return stoneTexCache.get(stoneKey);

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = size;
    bumpCanvas.height = size;
    const bCtx = bumpCanvas.getContext('2d');

    // Rich mineral depth gradient
    const baseGrad = ctx.createLinearGradient(0, 0, size, size);
    baseGrad.addColorStop(0, palette.cMid);
    baseGrad.addColorStop(0.32, palette.cLight);
    baseGrad.addColorStop(0.68, palette.cMid);
    baseGrad.addColorStop(1, palette.cDark);
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, size, size);

    // Internal caustic glow pocket ("ngọc lên nước")
    const caustic = ctx.createRadialGradient(
      size * 0.48,
      size * 0.52,
      size * 0.04,
      size * 0.48,
      size * 0.52,
      size * 0.46
    );
    caustic.addColorStop(0, palette.cGlow || palette.cLight);
    caustic.addColorStop(0.45, 'rgba(255, 255, 255, 0.12)');
    caustic.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
    ctx.fillStyle = caustic;
    ctx.fillRect(0, 0, size, size);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    let seed = stoneKey.split('').reduce((acc, ch) => acc + ch.charCodeAt(0) * 41, 37);
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    if (palette.inclusion === 'tigereye') {
      // Authentic South African Tiger Eye chatoyant silk bands
      for (let y = 0; y < size; y += 2) {
        const wave =
          Math.sin((y / size) * Math.PI * 5) * 0.46 +
          Math.cos((y / size) * Math.PI * 13) * 0.22 +
          0.5;
        ctx.fillStyle =
          wave > 0.5
            ? `rgba(255, 216, 122, ${(wave - 0.32) * 0.68})`
            : `rgba(28, 12, 2, ${(0.68 - wave) * 0.78})`;
        ctx.fillRect(0, y, size, 2);
      }
      for (let i = 0; i < 260; i++) {
        const y = rand() * size;
        ctx.strokeStyle =
          rand() > 0.42
            ? 'rgba(255, 232, 165, 0.25)'
            : 'rgba(24, 10, 2, 0.32)';
        ctx.lineWidth = 0.5 + rand() * 1.3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(
          size * 0.35,
          y + (rand() - 0.5) * 8,
          size * 0.7,
          y + (rand() - 0.5) * 8,
          size,
          y + (rand() - 0.5) * 5
        );
        ctx.stroke();
      }
    } else if (palette.inclusion === 'wood-grain') {
      // Natural Khánh Hòa Agarwood (Trầm Hương) oil veins & fine wood pores
      ctx.fillStyle = '#432711';
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 320; i++) {
        const y = rand() * size;
        const isResin = rand() > 0.3;
        ctx.strokeStyle = isResin
          ? 'rgba(18, 8, 2, 0.72)'
          : 'rgba(178, 128, 78, 0.36)';
        ctx.lineWidth = 0.6 + rand() * 2.2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(
          size * 0.33,
          y + (rand() - 0.5) * 16,
          size * 0.66,
          y + (rand() - 0.5) * 16,
          size,
          y + (rand() - 0.5) * 8
        );
        ctx.stroke();

        bCtx.strokeStyle = isResin
          ? 'rgba(42, 42, 42, 0.42)'
          : 'rgba(175, 175, 175, 0.28)';
        bCtx.lineWidth = 1.0;
        bCtx.beginPath();
        bCtx.moveTo(0, y);
        bCtx.lineTo(size, y + (rand() - 0.5) * 6);
        bCtx.stroke();
      }
    } else if (palette.inclusion === 'lapis-gold') {
      // Royal Afghanistan Lapis Lazuli with golden Pyrite constellations
      for (let i = 0; i < 80; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const r = 14 + rand() * 56;
        const cloud = ctx.createRadialGradient(x, y, 2, x, y, r);
        cloud.addColorStop(
          0,
          rand() > 0.28 ? 'rgba(8, 20, 68, 0.65)' : 'rgba(92, 148, 240, 0.28)'
        );
        cloud.addColorStop(1, 'rgba(12, 32, 92, 0)');
        ctx.fillStyle = cloud;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      for (let i = 0; i < 165; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const s = 0.7 + rand() * 2.4;
        ctx.fillStyle = rand() > 0.35 ? '#FCE08B' : '#C99632';
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (
      palette.inclusion === 'rutile-gold' ||
      palette.inclusion === 'rutile-red' ||
      palette.inclusion === 'rutile-black'
    ) {
      // Smoky-golden crystal matrix with dense co-axial rutile silk bundles
      const hairPrimary =
        palette.inclusion === 'rutile-gold'
          ? 'rgba(255, 215, 95, 0.72)'
          : palette.inclusion === 'rutile-red'
          ? 'rgba(244, 112, 92, 0.68)'
          : 'rgba(18, 22, 27, 0.78)';
      const hairBright =
        palette.inclusion === 'rutile-gold'
          ? 'rgba(255, 248, 204, 0.9)'
          : palette.inclusion === 'rutile-red'
          ? 'rgba(255, 192, 176, 0.84)'
          : 'rgba(85, 96, 108, 0.6)';

      for (let i = 0; i < 140; i++) {
        const sx = rand() * size;
        const sy = rand() * size;
        const angle = 0.42 + (rand() - 0.5) * 0.48;
        const len = 100 + rand() * 210;
        ctx.strokeStyle = i % 3 === 0 ? hairBright : hairPrimary;
        ctx.lineWidth = 0.7 + rand() * 2.0;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
        ctx.stroke();
      }
    } else {
      // Ice-Type Jadeite ("Ngọc Phỉ Thúy Băng Chủng"), Aquamarine, Moonstone, Amethyst
      for (let i = 0; i < 95; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const r = 18 + rand() * 72;
        const g = ctx.createRadialGradient(x, y, 2, x, y, r);
        const isLightCloud = rand() > 0.36;
        g.addColorStop(
          0,
          isLightCloud
            ? 'rgba(255, 255, 255, 0.32)'
            : 'rgba(5, 28, 18, 0.25)'
        );
        g.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }

      for (let i = 0; i < 28; i++) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 0.7 + rand() * 1.6;
        ctx.beginPath();
        const sx = rand() * size;
        const sy = rand() * size;
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(
          sx + (rand() - 0.5) * 120,
          sy + (rand() - 0.5) * 120,
          sx + (rand() - 0.5) * 170,
          sy + (rand() - 0.5) * 170,
          sx + (rand() - 0.5) * 220,
          sy + (rand() - 0.5) * 220
        );
        ctx.stroke();
      }
    }

    const colorMap = new THREE.CanvasTexture(canvas);
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.wrapS = THREE.RepeatWrapping;
    colorMap.wrapT = THREE.RepeatWrapping;

    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    bumpMap.wrapS = THREE.RepeatWrapping;
    bumpMap.wrapT = THREE.RepeatWrapping;

    const bundle = { colorMap, bumpMap };
    stoneTexCache.set(stoneKey, bundle);
    return bundle;
  }

  // -------------------------------------------------------------------------
  // 2. GEMSTONE PBR CONFIGURATIONS & 3D GOLDEN RUTILE SILK FILAMENTS
  // -------------------------------------------------------------------------
  const STONE_PBR_CONFIG = {
    rutileGold: {
      shellColor: '#FBE5A2',
      coreColor: '#B87B14',
      emissiveColor: '#4D3103',
      roughness: 0.04,
      clearcoat: 1.0,
      shellOpacity: 0.48,
      needleColor: '#FFE588',
      needleMetalness: 0.9,
      needleCount: 24
    },
    rutileRed: {
      shellColor: '#F7B8A8',
      coreColor: '#9E2B1C',
      emissiveColor: '#3B0B05',
      roughness: 0.05,
      clearcoat: 1.0,
      shellOpacity: 0.52,
      needleColor: '#FF9B8A',
      needleMetalness: 0.82,
      needleCount: 22
    },
    rutileBlack: {
      shellColor: '#E2E8EC',
      coreColor: '#252B31',
      emissiveColor: '#0B0E12',
      roughness: 0.04,
      clearcoat: 1.0,
      shellOpacity: 0.44,
      needleColor: '#12161A',
      needleMetalness: 0.7,
      needleCount: 24
    },
    imperialJade: {
      shellColor: '#66DFAA',
      coreColor: '#117548',
      emissiveColor: '#06331D',
      roughness: 0.06,
      clearcoat: 1.0,
      shellOpacity: 0.88,
      needleCount: 0
    },
    nephriteJade: {
      shellColor: '#4FA877',
      coreColor: '#175434',
      emissiveColor: '#072112',
      roughness: 0.08,
      clearcoat: 1.0,
      shellOpacity: 0.93,
      needleCount: 0
    },
    aquamarine: {
      shellColor: '#96DEFC',
      coreColor: '#1A75AB',
      emissiveColor: '#072840',
      roughness: 0.04,
      clearcoat: 1.0,
      shellOpacity: 0.8,
      needleCount: 0
    },
    amethyst: {
      shellColor: '#BC8AD8',
      coreColor: '#51246E',
      emissiveColor: '#1C0929',
      roughness: 0.05,
      clearcoat: 1.0,
      shellOpacity: 0.84,
      needleCount: 0
    },
    moonstone: {
      shellColor: '#F0F8FF',
      coreColor: '#84BCE8',
      emissiveColor: '#1B3A57',
      roughness: 0.06,
      clearcoat: 1.0,
      shellOpacity: 0.86,
      needleCount: 0
    },
    roseQuartz: {
      shellColor: '#F9BECD',
      coreColor: '#BF5470',
      emissiveColor: '#3B101C',
      roughness: 0.06,
      clearcoat: 1.0,
      shellOpacity: 0.86,
      needleCount: 0
    },
    tigerEyeGold: {
      shellColor: '#DB9642',
      coreColor: '#572D08',
      emissiveColor: '#261202',
      roughness: 0.1,
      clearcoat: 0.96,
      shellOpacity: 0.98,
      needleCount: 0
    },
    agarwoodRed: {
      shellColor: '#754B28',
      coreColor: '#331D0B',
      emissiveColor: '#120802',
      roughness: 0.32,
      clearcoat: 0.42,
      shellOpacity: 1.0,
      needleCount: 0
    },
    lapisLazuli: {
      shellColor: '#3065D0',
      coreColor: '#0D2461',
      emissiveColor: '#050F2E',
      roughness: 0.12,
      clearcoat: 0.94,
      shellOpacity: 0.98,
      needleCount: 0
    }
  };

  let sharedNeedleGeo = null;

  function createVolumetricRutileCluster(beadRadius, pbrCfg, seedOffset, needleMat) {
    const group = new THREE.Group();
    let s = seedOffset * 137 + 23;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    if (!sharedNeedleGeo) {
      sharedNeedleGeo = new THREE.CylinderGeometry(0.014, 0.009, 1.24, 6, 1);
    }

    const baseAxis = new THREE.Euler(
      (rand() - 0.5) * 0.85,
      (rand() - 0.5) * 0.85,
      (rand() - 0.5) * 0.85
    );

    for (let i = 0; i < pbrCfg.needleCount; i++) {
      const mesh = new THREE.Mesh(sharedNeedleGeo, needleMat);
      const spread = beadRadius * 0.66;
      mesh.position.set(
        (rand() - 0.5) * spread,
        (rand() - 0.5) * spread,
        (rand() - 0.5) * spread
      );
      mesh.rotation.set(
        baseAxis.x + (rand() - 0.5) * 0.42,
        baseAxis.y + (rand() - 0.5) * 0.42,
        baseAxis.z + (rand() - 0.5) * 0.42
      );
      const lenScale = beadRadius * (0.68 + rand() * 0.48);
      mesh.scale.set(beadRadius, lenScale, beadRadius);
      group.add(mesh);
    }

    return group;
  }

  // -------------------------------------------------------------------------
  // 3. ARTISANAL 3D JEWELRY CHARMS (SNUG TANGENT FIT, ZERO GAPS)
  // -------------------------------------------------------------------------
  function buildArtisanalCharm3D(charmType, beadRadius, stoneMat, goldMat, silverMat) {
    const group = new THREE.Group();
    if (charmType === 'none') return group;

    const r = beadRadius;
    const accentMetal = charmType === 'lotus' ? silverMat : goldMat;

    // Two sculpted fluted golden spacer rings kissing the neighboring beads
    const spacerGeo = new THREE.TorusGeometry(r * 0.44, r * 0.14, 16, 28);
    spacerGeo.rotateY(Math.PI / 2);
    const spacerL = new THREE.Mesh(spacerGeo, accentMetal);
    spacerL.position.set(-r * 0.92, 0, 0);
    const spacerR = new THREE.Mesh(spacerGeo, accentMetal);
    spacerR.position.set(r * 0.92, 0, 0);
    group.add(spacerL, spacerR);

    if (charmType === 'tyhuu') {
      // Sculpted Golden Auspicious Kim Bảo / Pixiu Barrel with Filigree Ridges
      const pts = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const y = (t - 0.5) * r * 1.82;
        const profile =
          Math.sin(t * Math.PI) * 0.78 +
          Math.sin(t * Math.PI * 3) * 0.08 +
          0.14;
        pts.push(new THREE.Vector2(Math.max(0.08, profile * r), y));
      }
      const latheGeo = new THREE.LatheGeometry(pts, 32);
      latheGeo.rotateZ(Math.PI / 2);
      const mainSculpt = new THREE.Mesh(latheGeo, goldMat);
      group.add(mainSculpt);

      // Raised Filigree Gold Collars
      const collarGeo = new THREE.TorusGeometry(r * 0.74, r * 0.09, 16, 32);
      collarGeo.rotateY(Math.PI / 2);
      const collarL = new THREE.Mesh(collarGeo, goldMat);
      collarL.position.set(-r * 0.38, 0, 0);
      const collarR = new THREE.Mesh(collarGeo, goldMat);
      collarR.position.set(r * 0.38, 0, 0);
      group.add(collarL, collarR);

      // Center Gemstone Belt
      const beltGeo = new THREE.CylinderGeometry(r * 0.86, r * 0.86, r * 0.46, 32);
      beltGeo.rotateZ(Math.PI / 2);
      const beltMesh = new THREE.Mesh(beltGeo, stoneMat);
      group.add(beltMesh);
    } else if (charmType === 'lotus') {
      // Layered Sculpted Silver S925 Blooming Lotus (Liên Hoa)
      const podGeo = new THREE.SphereGeometry(r * 0.64, 28, 28);
      const podMesh = new THREE.Mesh(podGeo, goldMat);
      group.add(podMesh);

      const layers = [
        { count: 8, radius: r * 0.56, tilt: 0.46 },
        { count: 8, radius: r * 0.68, tilt: 0.8, offset: Math.PI / 8 }
      ];
      const petalGeo = new THREE.SphereGeometry(r * 0.44, 18, 18);
      petalGeo.scale(0.54, 1.24, 0.26);

      layers.forEach((layer) => {
        for (let i = 0; i < layer.count; i++) {
          const a = (i / layer.count) * Math.PI * 2 + (layer.offset || 0);
          const petal = new THREE.Mesh(petalGeo, silverMat);
          petal.position.set(
            Math.cos(a) * r * 0.28,
            Math.sin(a) * layer.radius,
            Math.cos(a) * layer.radius
          );
          petal.rotation.x = a;
          petal.rotation.z = layer.tilt;
          group.add(petal);
        }
      });
    } else if (charmType === 'luthong') {
      // Lathe-sculpted Gemstone Lu Thống Barrel with Gold Filigree Caps
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const y = (t - 0.5) * r * 1.82;
        const rad = r * (0.58 + Math.sin(t * Math.PI) * 0.28);
        pts.push(new THREE.Vector2(rad, y));
      }
      const barrelGeo = new THREE.LatheGeometry(pts, 36);
      barrelGeo.rotateZ(Math.PI / 2);
      const barrelMesh = new THREE.Mesh(barrelGeo, stoneMat);
      group.add(barrelMesh);

      const capGeo = new THREE.TorusGeometry(r * 0.6, r * 0.1, 16, 32);
      capGeo.rotateY(Math.PI / 2);
      const capL = new THREE.Mesh(capGeo, goldMat);
      capL.position.set(-r * 0.84, 0, 0);
      const capR = new THREE.Mesh(capGeo, goldMat);
      capR.position.set(r * 0.84, 0, 0);
      group.add(capL, capR);
    }

    return group;
  }

  // -------------------------------------------------------------------------
  // 4. SHARED BRACELET MESH BUILDER (USED BY LIVE VIEWERS & CATALOG CARDS)
  // -------------------------------------------------------------------------
  function populateBraceletGroup(braceletPivot, shadowPlane, config, materials) {
    for (let i = braceletPivot.children.length - 1; i >= 0; i--) {
      const child = braceletPivot.children[i];
      if (child !== shadowPlane) {
        braceletPivot.remove(child);
      }
    }

    const beadNodes = [];
    const {
      stoneKey = 'rutileGold',
      beadCount = 17,
      beadMm = 10,
      charmType = 'tyhuu'
    } = config;

    const palette =
      (window.STONE_PALETTES && window.STONE_PALETTES[stoneKey]) || {
        cLight: '#FFF6D6',
        cMid: '#DFAC42',
        cDark: '#6B480E',
        cGlow: '#FFE28A',
        inclusion: 'rutile-gold'
      };
    const pbrCfg = STONE_PBR_CONFIG[stoneKey] || STONE_PBR_CONFIG.rutileGold;
    const textures = getStoneTextures(stoneKey, palette);

    // Calibrate ring radius & bead radius so beads ALWAYS kiss snugly with zero bare-wire gaps!
    const ringRadius = 1.66 + (beadMm - 8) * 0.042;
    const exactTangentRadius = ringRadius * Math.sin(Math.PI / beadCount);
    const beadRadius = Math.min(0.48, exactTangentRadius * 0.992);

    if (shadowPlane) {
      shadowPlane.position.z = -beadRadius * 1.15;
      const plinthScale = (ringRadius + beadRadius) / 2.15;
      shadowPlane.scale.set(plinthScale, plinthScale, 1);
    }

    // 1. 4-Core Braided Silk Elastic Cord with Gentle 3D Wrist Saddle Drape
    const cordCurvePoints = [];
    const cordSegments = 72;
    for (let i = 0; i < cordSegments; i++) {
      const theta = (i / cordSegments) * Math.PI * 2;
      const zDrape = Math.cos(theta * 2) * 0.05;
      cordCurvePoints.push(
        new THREE.Vector3(
          Math.cos(theta) * ringRadius,
          Math.sin(theta) * ringRadius,
          zDrape
        )
      );
    }
    const cordCurve = new THREE.CatmullRomCurve3(cordCurvePoints, true);
    const cordGeo = new THREE.TubeGeometry(cordCurve, 84, beadRadius * 0.08, 10, true);
    const cordMesh = new THREE.Mesh(cordGeo, materials.cordMat);
    braceletPivot.add(cordMesh);

    // 2. Multi-Layer Gemstone Materials
    const isRutilated = pbrCfg.needleCount > 0;

    const innerCoreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: textures.colorMap,
      bumpMap: textures.bumpMap,
      bumpScale: palette.inclusion === 'wood-grain' ? 0.015 : 0.004,
      emissive: new THREE.Color(pbrCfg.emissiveColor),
      emissiveIntensity: 0.38,
      roughness: isRutilated ? 0.2 : pbrCfg.roughness + 0.03,
      metalness: 0.04,
      clearcoat: 0.85,
      envMapIntensity: 1.35
    });

    const outerShellMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(pbrCfg.shellColor),
      map: isRutilated ? null : textures.colorMap,
      bumpMap: textures.bumpMap,
      bumpScale: palette.inclusion === 'wood-grain' ? 0.014 : 0.003,
      roughness: pbrCfg.roughness,
      metalness: 0.0,
      transparent: true,
      opacity: pbrCfg.shellOpacity,
      depthWrite: !isRutilated,
      clearcoat: pbrCfg.clearcoat,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
      envMapIntensity: 1.85
    });

    let needleMat = null;
    if (isRutilated) {
      needleMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(pbrCfg.needleColor),
        metalness: pbrCfg.needleMetalness,
        roughness: 0.16,
        emissive: new THREE.Color(pbrCfg.needleColor),
        emissiveIntensity: 0.26
      });
    }

    const outerSphereGeo = new THREE.SphereGeometry(beadRadius, 36, 36);
    const innerCoreGeo = new THREE.SphereGeometry(
      beadRadius * (isRutilated ? 0.74 : 0.93),
      28,
      28
    );

    // 3. Place Each Gemstone Bead Snugly Around the Wrist Curve
    for (let i = 0; i < beadCount; i++) {
      const angle = Math.PI / 2 + (i * 2 * Math.PI) / beadCount;
      const zDrape = Math.cos(angle * 2) * 0.05;

      if (i === 0 && charmType !== 'none') {
        const charmGroup = buildArtisanalCharm3D(
          charmType,
          beadRadius,
          outerShellMat,
          materials.goldMat,
          materials.silverMat
        );
        const cx = Math.cos(angle) * ringRadius;
        const cy = Math.sin(angle) * ringRadius;
        charmGroup.position.set(cx, cy, zDrape);
        charmGroup.rotation.z = angle - Math.PI / 2;

        braceletPivot.add(charmGroup);
        beadNodes.push({
          mesh: charmGroup,
          basePos: charmGroup.position.clone(),
          baseScale: 1,
          index: i
        });
        continue;
      }

      const beadHolder = new THREE.Group();
      const bx = Math.cos(angle) * ringRadius;
      const by = Math.sin(angle) * ringRadius;
      const bz = zDrape + Math.sin(i * 2.7) * 0.008;
      beadHolder.position.set(bx, by, bz);

      const naturalScale = 1 + Math.sin(i * 7.13) * 0.008;

      const coreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
      coreMesh.rotation.set(i * 1.13, i * 2.07, i * 0.67);
      beadHolder.add(coreMesh);

      if (isRutilated && needleMat) {
        const needles = createVolumetricRutileCluster(
          beadRadius,
          pbrCfg,
          i + 1,
          needleMat
        );
        beadHolder.add(needles);
      }

      const outerMesh = new THREE.Mesh(outerSphereGeo, outerShellMat);
      outerMesh.rotation.set(i * 0.91, i * 1.79, i * 0.53);
      beadHolder.add(outerMesh);

      braceletPivot.add(beadHolder);
      beadNodes.push({
        mesh: beadHolder,
        basePos: beadHolder.position.clone(),
        baseScale: naturalScale,
        index: i
      });
    }

    return beadNodes;
  }

  // -------------------------------------------------------------------------
  // 5. FULL INTERACTIVE 3D STAGE VIEWER (HERO, CUSTOM STUDIO, MODAL)
  // -------------------------------------------------------------------------
  class Bracelet3DViewer {
    constructor(containerEl, initialConfig = {}) {
      this.container = containerEl;
      this.config = Object.assign(
        {
          stoneKey: 'rutileGold',
          beadCount: 17,
          beadMm: 10,
          charmType: 'tyhuu',
          interactive: true,
          showHint: true,
          baseTiltX: -0.38,
          baseTiltY: 0.08
        },
        initialConfig
      );

      this.isVisible = true;
      this.isDragging = false;
      this.isTopDownView = false;
      this.dragStart = { x: 0, y: 0 };

      this.spinAngle = 0;
      this.targetSpinAngle = 0;

      this.tiltX = this.config.baseTiltX;
      this.targetTiltX = this.config.baseTiltX;
      this.tiltY = this.config.baseTiltY;
      this.targetTiltY = this.config.baseTiltY;

      this.pointerOffset = { x: 0, y: 0, targetX: 0, targetY: 0 };
      this.scrollRotOffset = 0;
      this.targetScrollRotOffset = 0;

      this.waveTime = 10;
      this.clock = new THREE.Clock();
      this.beadNodes = [];

      this.initScene();
      this.buildBraceletMesh(false);
      this.bindInteraction();
      this.startLoop();
    }

    initScene() {
      const width = this.container.clientWidth || 320;
      const height = this.container.clientHeight || 320;

      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(31, width / height, 0.1, 100);
      this.camera.position.set(0, 0.05, 8.1);
      this.camera.lookAt(0, 0, 0);

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(width, height);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.26;
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;

      this.scene.environment = getStudioEnvMap(this.renderer);

      const ambientLight = new THREE.AmbientLight(0xfff6e5, 0.98);
      this.scene.add(ambientLight);

      this.keyLight = new THREE.DirectionalLight(0xfff5de, 2.85);
      this.keyLight.position.set(3.4, 5.5, 5.4);
      this.scene.add(this.keyLight);

      this.rimLight = new THREE.DirectionalLight(0xd9f2ff, 1.5);
      this.rimLight.position.set(-4.6, 3.2, -2.4);
      this.scene.add(this.rimLight);

      this.warmFillLight = new THREE.PointLight(0xebb85e, 1.65, 15);
      this.warmFillLight.position.set(0, -2.6, 3.5);
      this.scene.add(this.warmFillLight);

      this.stageGroup = new THREE.Group();
      this.scene.add(this.stageGroup);

      this.braceletPivot = new THREE.Group();
      this.braceletPivot.rotation.x = this.tiltX;
      this.braceletPivot.rotation.y = this.tiltY;
      this.stageGroup.add(this.braceletPivot);

      const shadowGeo = new THREE.PlaneGeometry(5.5, 5.5);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: getVelvetPlinthTexture(),
        transparent: true,
        opacity: 0.78,
        depthWrite: false
      });
      this.shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
      this.shadowPlane.position.z = -0.45;
      this.braceletPivot.add(this.shadowPlane);

      this.container.innerHTML = '';
      this.container.classList.add('has-webgl-3d');
      this.renderer.domElement.className = 'bracelet-webgl-canvas';
      this.container.appendChild(this.renderer.domElement);

      if (this.config.showHint) {
        const controlsBar = document.createElement('div');
        controlsBar.className = 'webgl-3d-controls';
        controlsBar.innerHTML = `
          <span class="webgl-3d-pill" title="Giữ chuột hoặc chạm vuốt để xoay vòng 3D theo mọi góc">
            <span class="webgl-dot"></span>
            <span>Xoay 3D tự do</span>
          </span>
          <button type="button" class="webgl-angle-btn" aria-label="Đổi góc nhìn 3D">
            Góc nhìn: Nghiêng
          </button>
        `;
        const angleBtn = controlsBar.querySelector('.webgl-angle-btn');
        angleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.isTopDownView = !this.isTopDownView;
          this.targetTiltX = this.isTopDownView ? -0.03 : this.config.baseTiltX;
          this.targetTiltY = this.isTopDownView ? 0 : this.config.baseTiltY;
          this.targetSpinAngle += 0.3;
          angleBtn.textContent = this.isTopDownView
            ? 'Góc nhìn: Trực diện'
            : 'Góc nhìn: Nghiêng';
        });
        this.container.appendChild(controlsBar);
      }

      this.materials = {
        goldMat: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#E8BD64'),
          metalness: 0.91,
          roughness: 0.16,
          clearcoat: 0.78,
          clearcoatRoughness: 0.1,
          envMapIntensity: 1.55
        }),
        silverMat: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#EDF2F7'),
          metalness: 0.89,
          roughness: 0.15,
          clearcoat: 0.68,
          envMapIntensity: 1.45
        }),
        cordMat: new THREE.MeshStandardMaterial({
          color: new THREE.Color('#C9A052'),
          roughness: 0.36,
          metalness: 0.35
        })
      };
    }

    buildBraceletMesh(triggerWave = true) {
      this.beadNodes = populateBraceletGroup(
        this.braceletPivot,
        this.shadowPlane,
        this.config,
        this.materials
      );
      this.waveTime = triggerWave ? 0 : 10;
    }

    updateConfig(nextConfig = {}, animateWave = true) {
      let needsRebuild = false;
      for (const k of ['stoneKey', 'beadCount', 'beadMm', 'charmType']) {
        if (nextConfig[k] !== undefined && nextConfig[k] !== this.config[k]) {
          this.config[k] = nextConfig[k];
          needsRebuild = true;
        }
      }
      if (needsRebuild) {
        this.buildBraceletMesh(animateWave);
        this.targetSpinAngle += 0.26;
      }
    }

    setScrollRotation(deg) {
      this.targetScrollRotOffset = (deg * Math.PI) / 180;
    }

    bindInteraction() {
      const el = this.renderer.domElement;

      if (this.config.interactive) {
        el.addEventListener('pointerdown', (e) => {
          this.isDragging = true;
          this.dragStart.x = e.clientX;
          this.dragStart.y = e.clientY;
          el.setPointerCapture?.(e.pointerId);
          this.container.classList.add('is-dragging-3d');
        });

        el.addEventListener('pointermove', (e) => {
          const rect = el.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
          const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
          this.pointerOffset.targetX = nx * 0.22;
          this.pointerOffset.targetY = -ny * 0.2;

          if (!this.isDragging) return;
          const dx = e.clientX - this.dragStart.x;
          const dy = e.clientY - this.dragStart.y;
          this.dragStart.x = e.clientX;
          this.dragStart.y = e.clientY;

          this.targetSpinAngle -= dx * 0.0095;
          this.targetTiltX = Math.max(
            -0.92,
            Math.min(0.58, this.targetTiltX + dy * 0.007)
          );
        });

        const endDrag = () => {
          if (!this.isDragging) return;
          this.isDragging = false;
          this.container.classList.remove('is-dragging-3d');
        };

        el.addEventListener('pointerup', endDrag);
        el.addEventListener('pointercancel', endDrag);
        el.addEventListener('pointerleave', () => {
          this.pointerOffset.targetX = 0;
          this.pointerOffset.targetY = 0;
          endDrag();
        });
      }

      if ('IntersectionObserver' in window) {
        this.visObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              this.isVisible = entry.isIntersecting;
            });
          },
          { threshold: 0.02 }
        );
        this.visObserver.observe(this.container);
      }

      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(() => this.handleResize());
        this.resizeObserver.observe(this.container);
      } else {
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
      }
    }

    handleResize() {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (!w || !h) return;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }

    destroy() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.visObserver?.disconnect();
      this.resizeObserver?.disconnect();
      this.renderer?.dispose();
    }

    startLoop() {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const animate = () => {
        if (!this.container.isConnected) {
          this.destroy();
          return;
        }
        this.rafId = requestAnimationFrame(animate);
        if (!this.isVisible || document.hidden) return;

        const dt = Math.min(0.05, this.clock.getDelta());
        const elapsed = this.clock.elapsedTime;

        if (!reducedMotion) {
          if (!this.isDragging) {
            this.targetSpinAngle -= 0.0014;
            const desiredTiltX = this.isTopDownView ? -0.03 : this.config.baseTiltX;
            const desiredTiltY = this.isTopDownView ? 0 : this.config.baseTiltY;
            this.targetTiltX += (desiredTiltX - this.targetTiltX) * 0.018;
            this.targetTiltY += (desiredTiltY - this.targetTiltY) * 0.018;
          }

          this.spinAngle += (this.targetSpinAngle - this.spinAngle) * 0.075;
          this.tiltX += (this.targetTiltX - this.tiltX) * 0.075;
          this.tiltY += (this.targetTiltY - this.tiltY) * 0.075;
          this.scrollRotOffset +=
            (this.targetScrollRotOffset - this.scrollRotOffset) * 0.07;

          this.pointerOffset.x +=
            (this.pointerOffset.targetX - this.pointerOffset.x) * 0.075;
          this.pointerOffset.y +=
            (this.pointerOffset.targetY - this.pointerOffset.y) * 0.075;

          const breathY = Math.sin(elapsed * 1.15) * 0.038;
          const breathPitch = Math.cos(elapsed * 0.85) * 0.016;

          this.stageGroup.position.y = breathY + this.pointerOffset.y * 0.16;
          this.stageGroup.position.x = this.pointerOffset.x * 0.16;

          this.braceletPivot.rotation.x =
            this.tiltX + breathPitch - this.pointerOffset.y * 0.28;
          this.braceletPivot.rotation.y =
            this.tiltY + this.pointerOffset.x * 0.34;
          this.braceletPivot.rotation.z =
            this.spinAngle - this.scrollRotOffset;

          if (this.waveTime < 1.2) {
            this.waveTime += dt * 2.2;
            const total = Math.max(1, this.beadNodes.length);
            for (let i = 0; i < total; i++) {
              const node = this.beadNodes[i];
              const delay = (i / total) * 0.28;
              const localT = Math.max(0, Math.min(1, (this.waveTime - delay) / 0.56));
              const ease = 1 - Math.pow(1 - localT, 3);
              const s = node.baseScale * (0.84 + 0.16 * ease);
              node.mesh.scale.setScalar(s);
              node.mesh.position.z =
                node.basePos.z + (1 - ease) * 0.14 * Math.sin(i * 0.8);
            }
          }
        }

        this.renderer.render(this.scene, this.camera);
      };

      animate();
    }
  }

  // -------------------------------------------------------------------------
  // 6. SHARED OFFSCREEN 3D STUDIO RENDERER FOR CATALOG PRODUCT CARDS
  //    Renders all 12 catalog cards in true 3D WebGL & animates hovered card!
  // -------------------------------------------------------------------------
  let cardStudio = null;

  function getCardStudio() {
    if (cardStudio) return cardStudio;

    const size = 440;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(1);
    renderer.setSize(size, size);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.26;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.environment = getStudioEnvMap(renderer);

    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
    camera.position.set(0, 0.04, 8.05);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xfff6e5, 0.98));

    const keyLight = new THREE.DirectionalLight(0xfff5de, 2.85);
    keyLight.position.set(3.4, 5.5, 5.4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd9f2ff, 1.5);
    rimLight.position.set(-4.6, 3.2, -2.4);
    scene.add(rimLight);

    const warmFillLight = new THREE.PointLight(0xebb85e, 1.65, 15);
    warmFillLight.position.set(0, -2.6, 3.5);
    scene.add(warmFillLight);

    const braceletPivot = new THREE.Group();
    scene.add(braceletPivot);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.5, 5.5),
      new THREE.MeshBasicMaterial({
        map: getVelvetPlinthTexture(),
        transparent: true,
        opacity: 0.78,
        depthWrite: false
      })
    );
    shadowPlane.position.z = -0.45;
    braceletPivot.add(shadowPlane);

    const materials = {
      goldMat: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#E8BD64'),
        metalness: 0.91,
        roughness: 0.16,
        clearcoat: 0.78,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.55
      }),
      silverMat: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#EDF2F7'),
        metalness: 0.89,
        roughness: 0.15,
        clearcoat: 0.68,
        envMapIntensity: 1.45
      }),
      cordMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#C9A052'),
        roughness: 0.36,
        metalness: 0.35
      })
    };

    cardStudio = {
      size,
      renderer,
      scene,
      camera,
      braceletPivot,
      shadowPlane,
      materials,
      currentKey: '',
      activeHoverEl: null,
      hoverRaf: null,
      rotX: -0.34,
      rotY: 0.08,
      rotZ: 0,
      targetRotX: -0.34,
      targetRotY: 0.08,
      targetRotZ: 0
    };

    return cardStudio;
  }

  function drawCardFrame(studio, targetCanvas, config, rotX, rotY, rotZ) {
    const key = `${config.stoneKey}_${config.beadCount}_${config.beadMm}_${config.charmType}`;
    if (studio.currentKey !== key) {
      populateBraceletGroup(
        studio.braceletPivot,
        studio.shadowPlane,
        config,
        studio.materials
      );
      studio.currentKey = key;
    }

    studio.braceletPivot.rotation.set(rotX, rotY, rotZ);
    studio.renderer.render(studio.scene, studio.camera);

    const ctx = targetCanvas.getContext('2d');
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    ctx.drawImage(studio.renderer.domElement, 0, 0, targetCanvas.width, targetCanvas.height);
  }

  function mountCard3D(cardVisualEl, config) {
    if (!cardVisualEl) return;
    const studio = getCardStudio();

    const oldSvg = cardVisualEl.querySelector('svg:not(.wishlist-card-btn svg)');
    if (oldSvg) oldSvg.remove();

    let canvas = cardVisualEl.querySelector('.card-3d-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'card-3d-canvas';
      canvas.width = studio.size;
      canvas.height = studio.size;
      cardVisualEl.appendChild(canvas);
    }

    const baseRotX = -0.34;
    const baseRotY = 0.08;
    const baseRotZ = 0;

    drawCardFrame(studio, canvas, config, baseRotX, baseRotY, baseRotZ);

    const cardEl = cardVisualEl.closest('.product-card') || cardVisualEl;

    cardEl.addEventListener('pointerenter', () => {
      studio.activeHoverEl = cardEl;
      studio.rotX = baseRotX;
      studio.rotY = baseRotY;
      studio.rotZ = baseRotZ;
      studio.targetRotX = baseRotX;
      studio.targetRotY = baseRotY;
      studio.targetRotZ = baseRotZ;

      if (studio.hoverRaf) cancelAnimationFrame(studio.hoverRaf);

      const stepCard3D = () => {
        if (studio.activeHoverEl !== cardEl || !cardEl.isConnected) return;
        studio.targetRotZ -= 0.0045;
        studio.rotX += (studio.targetRotX - studio.rotX) * 0.12;
        studio.rotY += (studio.targetRotY - studio.rotY) * 0.12;
        studio.rotZ += (studio.targetRotZ - studio.rotZ) * 0.12;

        drawCardFrame(studio, canvas, config, studio.rotX, studio.rotY, studio.rotZ);
        studio.hoverRaf = requestAnimationFrame(stepCard3D);
      };

      studio.hoverRaf = requestAnimationFrame(stepCard3D);
    });

    cardEl.addEventListener('pointermove', (e) => {
      const rect = cardEl.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      studio.targetRotX = baseRotX + ny * 0.36;
      studio.targetRotY = baseRotY + nx * 0.44;
      cardEl.style.setProperty('--card-tilt-x', `${(-ny * 5.5).toFixed(2)}deg`);
      cardEl.style.setProperty('--card-tilt-y', `${(nx * 6.5).toFixed(2)}deg`);
      cardEl.style.setProperty('--glare-x', `${((nx + 0.5) * 100).toFixed(1)}%`);
      cardEl.style.setProperty('--glare-y', `${((ny + 0.5) * 100).toFixed(1)}%`);
    });

    cardEl.addEventListener('pointerleave', () => {
      cardEl.style.setProperty('--card-tilt-x', '0deg');
      cardEl.style.setProperty('--card-tilt-y', '0deg');
      if (studio.activeHoverEl === cardEl) {
        studio.activeHoverEl = null;
        if (studio.hoverRaf) {
          cancelAnimationFrame(studio.hoverRaf);
          studio.hoverRaf = null;
        }
        drawCardFrame(studio, canvas, config, baseRotX, baseRotY, baseRotZ);
      }
    });
  }

  window.Bracelet3DEngine = {
    instances: new Map(),
    mount(containerIdOrEl, config) {
      const el =
        typeof containerIdOrEl === 'string'
          ? document.getElementById(containerIdOrEl)
          : containerIdOrEl;
      if (!el) return null;

      for (const [node, viewer] of this.instances.entries()) {
        if (!node.isConnected) {
          viewer.destroy();
          this.instances.delete(node);
        }
      }

      let inst = this.instances.get(el);
      if (inst) {
        inst.updateConfig(config, true);
        inst.handleResize();
        return inst;
      }

      inst = new Bracelet3DViewer(el, config);
      this.instances.set(el, inst);
      return inst;
    },
    get(containerIdOrEl) {
      const el =
        typeof containerIdOrEl === 'string'
          ? document.getElementById(containerIdOrEl)
          : containerIdOrEl;
      return this.instances.get(el) || null;
    },
    mountCard3D
  };
})();
