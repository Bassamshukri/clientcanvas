/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";
import { ValueNoise } from "../../core/noise.js";

export class TornPaperBandStyle extends BaseStyle {
  regenerate() {
    this.noise = new ValueNoise(`${this.seed}-${this.choice}`);

    const stiffness = 100 + this.physics * 150;
    const damping = 15 + (1 - this.physics) * 10;

    this.bandPos = new SpringValue(this.height * 0.5, stiffness, damping);
    this.bandWidth = new SpringValue(this.height * 0.15, stiffness, damping);
  }

  update(dt) {
    const time = Date.now() * 0.001;
    const sway = 50 + this.motion * 200;

    this.bandPos.setTarget(this.height * 0.5 + Math.sin(time) * sway);
    this.bandPos.step(dt);
    this.bandWidth.step(dt);
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;

    // Draw bottom half
    ctx.fillStyle = this.palette.shape2;
    ctx.fillRect(0, 0, w, h);

    // Draw top half
    ctx.fillStyle = this.palette.shape1;
    ctx.fillRect(0, 0, w, this.bandPos.value);

    // Draw "Torn" Band
    const py = this.bandPos.value;
    const bw = this.bandWidth.value;

    ctx.fillStyle = this.palette.shape3;
    this.drawTornEdge(ctx, 0, py - bw * 0.5, w, py + bw * 0.5, 20, 0.4);
  }

  drawTornEdge(ctx, x1, y1, x2, y2, segments, roughness) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);

    // Top edge
    for (let i = 0; i <= segments; i++) {
        const tx = x1 + (i / segments) * (x2 - x1);
        const ty = y1 + (this.noise.noise(i * 0.5) - 0.5) * (y2 - y1) * roughness;
        ctx.lineTo(tx, ty);
    }

    ctx.lineTo(x2, y2);

    // Bottom edge
    for (let i = segments; i >= 0; i--) {
        const tx = x1 + (i / segments) * (x2 - x1);
        const ty = y2 + (this.noise.noise(i * 0.5 + 100) - 0.5) * (y2 - y1) * roughness;
        ctx.lineTo(tx, ty);
    }

    ctx.closePath();
    ctx.fill();

    // White "paper" highlight
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }
}
