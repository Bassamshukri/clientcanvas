/** @format */

export const STYLE_REGISTRY = {
  ribbonSplit: {
    label: "Ribbon Split",
    load: () => import("./poster/ribbon-split.js").then(m => m.RibbonSplitStyle),
  },
  tornPaper: {
    label: "Torn Paper Band",
    load: () => import("./poster/torn-paper-band.js").then(m => m.TornPaperBandStyle),
  },
  sCurve: {
    label: "S-Curve Split",
    load: () => import("./poster/s-curve-split.js").then(m => m.SCurveSplitStyle),
  },
  halftoneField: {
    label: "Halftone Field",
    load: () => import("./tech/halftone-field.js").then(m => m.HalftoneFieldStyle),
  },
  borderedMedallion: {
    label: "Bordered Medallion",
    load: () => import("./rug/bordered-medallion.js").then(m => m.BorderedMedallionStyle),
  },
  softCloud: {
    label: "Soft Cloud",
    load: () => import("./gradient/soft-cloud.js").then(m => m.SoftCloudStyle),
  },
  glassPanels: {
    label: "Glass Panels",
    load: () => import("./blue/glass-panels.js").then(m => m.GlassPanelsStyle),
  },
  tribalTessellation: {
    label: "Tribal Tessellation",
    load: () => import("./rug/tribal-tessellation.js").then(m => m.TribalTessellationStyle),
  },
  gradientMesh: {
    label: "Gradient Mesh",
    load: () => import("./gradient/gradient-mesh.js").then(m => m.GradientMeshStyle),
  },
  neonStrips: {
    label: "Neon Strips",
    load: () => import("./poster/neon-strips.js").then(m => m.NeonStripsStyle),
  },
  botanicalDrift: {
    label: "Botanical Drift",
    load: () => import("./organic/botanical-drift.js").then(m => m.BotanicalDriftStyle),
  },
  islamicStar: {
    label: "Islamic Star",
    load: () => import("./tile/islamic-star.js").then(m => m.IslamicStarStyle),
  },
  brutalistBlock: {
    label: "Brutalist Block",
    load: () => import("./poster/brutalist-block.js").then(m => m.BrutalistBlockStyle),
  },
  terrazzoStone: {
    label: "Terrazzo Stone",
    load: () => import("./organic/terrazzo-stone.js").then(m => m.TerrazzoStoneStyle),
  },
  topographicWave: {
    label: "Topographic Wave",
    load: () => import("./organic/topographic-wave.js").then(m => m.TopographicWaveStyle),
  },
  starlightGrid: {
    label: "Starlight Grid",
    load: () => import("./tech/starlight-grid.js").then(m => m.StarlightGridStyle),
  },
  chevronCascade: {
    label: "Chevron Cascade",
    load: () => import("./poster/chevron-cascade.js").then(m => m.ChevronCascadeStyle),
  },
  liquidChrome: {
    label: "Liquid Chrome",
    load: () => import("./gradient/liquid-chrome.js").then(m => m.LiquidChromeStyle),
  },
  damaskOrnament: {
    label: "Damask Ornament",
    load: () => import("./rug/damask-ornament.js").then(m => m.DamaskOrnamentStyle),
  },
  cyberGrid: {
    label: "Cyber Grid",
    load: () => import("./tech/cyber-grid.js").then(m => m.CyberGridStyle),
  },
};

export async function getStyleClass(styleId) {
    const styleEntry = STYLE_REGISTRY[styleId] || STYLE_REGISTRY.ribbonSplit;
    return await styleEntry.load();
}
