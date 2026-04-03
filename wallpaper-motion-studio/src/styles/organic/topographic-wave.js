/** @format */

import { BaseStyle } from "../base-style.js";
import { ValueNoise } from "../../core/noise.js";

export class TopographicWaveStyle extends BaseStyle {
  regenerate() {
    this.noise = new ValueNoise(`${this.seed}-${this.choice}`);
    this.lines = 10 + Math.floor(this.detail * 20);
  }

  update(dt) {
    this.time = (this.time || 0) + dt * 0.1 * this.motion;
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;

    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = this.palette.shape1;
    ctx.lineWidth = 2;

    const step = 40;
    for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        for (let x = 0; x < w; x += 10) {
            const n = this.noise.noise(x * 0.002, (y + this.time * 500) * 0.002) * 200;
            if (x === 0) ctx.moveTo(x, y + n);
            else ctx.lineTo(x, y + n);
        }
        ctx.stroke();
    }
  }
}
