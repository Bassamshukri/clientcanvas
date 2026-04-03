/** @format */

import { BaseStyle } from "../base-style.js";
import { ValueNoise } from "../../core/noise.js";

export class LiquidChromeStyle extends BaseStyle {
  regenerate() {
    this.noise = new ValueNoise(`${this.seed}-${this.choice}`);
  }

  update(dt) {
    this.time = (this.time || 0) + dt * 0.2 * this.motion;
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;

    // Create complex multi-stop gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, this.palette.bg);
    grad.addColorStop(0.3, this.palette.shape1);
    grad.addColorStop(0.6, "#fff"); // Specular highlight
    grad.addColorStop(0.8, this.palette.shape2);
    grad.addColorStop(1, this.palette.shape3);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Distortion Overlay
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = 0.5 + this.detail * 0.5;
    
    for (let i = 0; i < 5; i++) {
        const offset = i * 200;
        ctx.beginPath();
        for (let x = 0; x < w; x += 20) {
            const n = this.noise.noise(x * 0.003, (offset + this.time * 400) * 0.003) * 300;
            if (x === 0) ctx.moveTo(x, n + h * 0.2 * i);
            else ctx.bezierCurveTo(x - 10, n + h * 0.2 * i, x - 5, n + h * 0.2 * i, x, n + h * 0.2 * i);
        }
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 10;
        ctx.stroke();
    }
    ctx.restore();
  }
}
