/** @format */

import { STYLE_REGISTRY } from "../styles/index.js";
import { RNG } from "../core/rng.js";
import { getPalette } from "../core/palette.js";

export class Gallery {
  constructor(app) {
    this.app = app;
    this.modal = document.getElementById("galleryModal");
    this.grid = document.getElementById("galleryGrid");
    this.closeBtn = document.getElementById("closeGallery");

    this.closeBtn.addEventListener("click", () => this.hide());
  }

  show() {
    this.modal.classList.add("active");
    this.render();
  }

  hide() {
    this.modal.classList.remove("active");
  }

  render() {
    this.grid.innerHTML = "";
    const currentStyle = STYLE_REGISTRY[this.app.state.style];
    if (!currentStyle) return;

    const StyleClass = currentStyle.class;
    const startChoice = this.app.state.choice;

    for (let i = 0; i < 12; i++) {
      const choice = startChoice + i;
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.innerHTML = `<span>#${choice}</span>`;

      const canvas = document.createElement("canvas");
      canvas.width = 270; // Low res for thumbnails
      canvas.height = 480;
      item.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      const rng = new RNG(`${this.app.state.seed}-${choice}`);
      const palette = getPalette(this.app.state.paletteMode, rng);

      const preview = new StyleClass({
        width: 270,
        height: 480,
        seed: this.app.state.seed,
        choice: choice,
        palette: palette,
        detail: this.app.state.detail,
        motion: 0, // Static for thumbnails
        physics: 0.5,
        shadows: this.app.state.shadows,
      });

      // Render static frame
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, 270, 480);
      preview.render(ctx);

      item.addEventListener("click", () => {
        this.app.updateState("choice", choice);
        this.hide();
      });

      this.grid.appendChild(item);
    }
  }
}
