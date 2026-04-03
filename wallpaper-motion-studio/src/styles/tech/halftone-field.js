/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class HalftoneFieldStyle extends BaseStyle {
  regenerate() {
    const stiffness = 120 + this.physics * 120;
    const damping = 18 + (1 - this.physics) * 10;

    this.scale = new SpringValue(1.0, stiffness, damping);
    this.rotation = new SpringValue(0.0, stiffness, damping);
  }

  update(dt) {
    const time = Date.now() * 0.001;
    this.scale.setTarget(1.0 + Math.sin(time) * 0.1 * this.motion);
    this.rotation.setTarget(Math.sin(time * 0.5) * 0.2 * this.motion);

    this.scale.step(dt);
    this.rotation.step(dt);
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;

    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, w, h);

    // Draw Grid
    const gridSize = 40 + this.detail * 100;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(this.scale.value, this.scale.value);
    ctx.rotate(this.rotation.value);

    ctx.fillStyle = this.palette.shape1;
    for (let x = -w; x < w; x += gridSize) {
      for (let y = -h; y < h; y += gridSize) {
        const d = Math.sqrt(x * x + y * y);
        const radius = (gridSize * 0.4) * (1 - d / (w + h));
        if (radius > 1) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
      }
    }
    ctx.restore();

    // Floating Accent Square
    if (this.detail > 0.5) {
      ctx.strokeStyle = this.palette.shape3;
      ctx.lineWidth = 4;
      ctx.strokeRect(w * 0.2, h * 0.2, w * 0.6, h * 0.6);
    }
  }
}
