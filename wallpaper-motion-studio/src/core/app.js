/** @format */

import { Controls } from "../ui/controls.js";
import { RNG } from "./rng.js";
import { getPalette } from "./palette.js";
import { STYLE_REGISTRY } from "../styles/index.js";
import { downloadCanvas, downloadSVG } from "./export.js";
import { buildTextureCanvas } from "./texture.js";
import { FXPipeline } from "./fx.js";
import { ParticleSystem } from "./particles.js";

export class App {
  constructor() {
    this.canvas = document.getElementById("appCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = 1080;
    this.height = 1920;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.lastTime = 0;
    this.isPlaying = true;
    this.state = {
      choice: 1,
      seed: "Centurion",
      style: "ribbonSplit",
      paletteMode: "solar",
      ratio: "9/16",
      motion: 0.5,
      physics: 0.5,
      detail: 0.5,
      bloom: 0.2,
      vignette: 0.3,
      aberration: 0.1,
      particles: 0.5,
      animate: true,
      texture: true,
      shadows: true,
    };

    this.activeStyle = null;
    this.textureCanvas = null;
    this.fx = new FXPipeline(this.ctx, this.width, this.height);
    this.particles = new ParticleSystem(this.ctx, this.width, this.height);
    this.controls = new Controls(this);
    this.init();
  }

  async init() {
    this.controls.populateStyles(STYLE_REGISTRY);
    this.regenerate();
    this.updateCanvasSize();
    this.particles.setDensity(this.state.particles);
    requestAnimationFrame(this.loop.bind(this));
  }

  async updateCanvasSize() {
    const [w, h] = this.state.ratio.split("/").map(Number);
    const base = 1080;
    
    if (w < h) {
      this.width = base;
      this.height = Math.round(base * (h / w));
    } else {
      this.width = Math.round(base * (w / h));
      this.height = base;
    }

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.textureCanvas = buildTextureCanvas(this.width, this.height, "grain");
    this.fx.resize(this.width, this.height);
    this.particles.resize(this.width, this.height);
    await this.regenerate();
  }

  async regenerate() {
    const styleEntry = STYLE_REGISTRY[this.state.style];
    if (!styleEntry) return;

    try {
        // Import the class dynamically
        const { getStyleClass } = await import("../styles/index.js");
        const StyleClass = await getStyleClass(this.state.style);
        
        const rng = new RNG(`${this.state.seed}-${this.state.choice}`);
        const palette = getPalette(this.state.paletteMode, rng);

        this.activeStyle = new StyleClass({
        width: this.width,
        height: this.height,
        seed: this.state.seed,
        choice: this.state.choice,
        palette: palette,
        detail: this.state.detail,
        motion: this.state.motion,
        physics: this.state.physics,
        shadows: this.state.shadows,
        });
    } catch (err) {
        console.error("Failed to load style:", err);
    }
  }

  loop(now) {
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (this.state.animate && this.activeStyle) {
      this.activeStyle.update(dt);
      this.particles.update(dt);
    }

    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  render() {
    if (!this.activeStyle) return;

    this.ctx.fillStyle = this.activeStyle.palette.bg;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.activeStyle.render(this.ctx);

    // Particle Overlay
    this.particles.render();

    if (this.state.texture && this.textureCanvas) {
      this.ctx.globalCompositeOperation = "overlay";
      this.ctx.globalAlpha = 0.05;
      this.ctx.drawImage(this.textureCanvas, 0, 0);
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.globalAlpha = 1.0;
    }

    // Apply Post-FX
    this.fx.applyBloom(this.canvas, this.state.bloom);
    this.fx.applyVignette(this.state.vignette);
    this.fx.applyChromaticAberration(this.canvas, this.state.aberration);
  }

  updateState(key, value) {
    this.state[key] = value;
    if (["choice", "seed", "style", "paletteMode"].includes(key)) {
      this.regenerate();
    } else if (key === "ratio") {
      this.updateCanvasSize();
    } else if (key === "particles") {
      this.particles.setDensity(value);
    } else if (key === "autoPlay") {
        if (value) this.startAutoPlay();
        else this.stopAutoPlay();
    } else {
      if (this.activeStyle) this.activeStyle.updateConfig({ [key]: value });
    }
    this.controls.updateFromState(this.state);
  }

  startAutoPlay() {
    this.autoPlayTimer = setInterval(() => {
        const next = (this.state.choice % 1000) + 1;
        this.updateState("choice", next);
    }, 4000);
  }

  stopAutoPlay() {
    clearInterval(this.autoPlayTimer);
  }

  batchExport(count = 10) {
    let current = 0;
    const originalChoice = this.state.choice;
    
    const next = () => {
        if (current >= count) {
            this.updateState("choice", originalChoice);
            return;
        }
        this.export("jpg");
        current++;
        this.updateState("choice", this.state.choice + 1);
        setTimeout(next, 500); // Small delay to avoid browser throttle
    };
    next();
  }

  savePreset() {
    const data = JSON.stringify(this.state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `centurion-preset-${this.state.style}-${this.state.choice}.json`;
    link.click();
  }

  loadPreset(jsonData) {
    try {
      const newState = JSON.parse(jsonData);
      Object.assign(this.state, newState);
      this.updateCanvasSize();
      this.regenerate();
      this.controls.updateFromState(this.state);
    } catch (e) {
      console.error("Failed to load preset", e);
    }
  }

  export(format = "jpg") {
    if (!this.activeStyle) return;
    const filename = `centurion-${this.state.style}-${this.state.choice}`;
    
    if (format === "svg") {
      downloadSVG(this.activeStyle, `${filename}.svg`);
    } else {
        const mime = format === "png" ? "image/png" : "image/jpeg";
        downloadCanvas(this.canvas, `${filename}.${format}`, mime);
    }
  }
}
