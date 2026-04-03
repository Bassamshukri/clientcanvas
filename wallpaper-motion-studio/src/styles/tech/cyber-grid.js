/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class CyberGridStyle extends BaseStyle {
  regenerate() {
    const stiffness = 60 + this.physics * 100;
    const damping = 20 + (1 - this.physics) * 15;

    this.tilt = new SpringValue(0.5, stiffness, damping);
    this.speed = 0.5 + this.motion * 2.5;
  }

  update(dt) {
    const time = Date.now() * 0.001;
    this.tilt.setTarget(0.4 + Math.sin(time * 0.5) * 0.1 * this.motion);
    this.tilt.step(dt);
    this.offset = (this.offset || 0) + dt * this.speed * 200;
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;
    const horizon = h * this.tilt.value;

    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, w, h);

    // Glow Gradient
    const glow = ctx.createLinearGradient(0, horizon, 0, h);
    glow.addColorStop(0, this.palette.shape1);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = glow;
    ctx.fillRect(0, horizon, w, h - horizon);
    ctx.restore();

    ctx.strokeStyle = this.palette.shape1;
    ctx.lineWidth = 2;

    // Perspective Lines (Vanishing toward horizon)
    const lineCount = 10 + Math.floor(this.detail * 20);
    for (let i = 0; i < lineCount; i++) {
        const x = (i / (lineCount - 1)) * w;
        ctx.beginPath();
        ctx.moveTo(w / 2, horizon);
        ctx.lineTo(x + (x - w/2) * 5, h);
        ctx.stroke();
    }

    // Horizontal Lines (Moving toward viewer)
    const hCount = 8;
    for (let i = 0; i < hCount; i++) {
        const progress = ((i * 100 + (this.offset % 100)) / 800);
        const y = horizon + (h - horizon) * progress * progress;
        ctx.globalAlpha = 1.0 - progress;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
  }
}
