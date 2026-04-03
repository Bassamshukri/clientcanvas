/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class NeonStripsStyle extends BaseStyle {
  regenerate() {
    const stiffness = 90 + this.physics * 150;
    const damping = 12 + (1 - this.physics) * 10;

    this.strips = [];
    const count = 6 + Math.floor(this.detail * 12);
    
    for (let i = 0; i < count; i++) {
        this.strips.push({
            pos: new SpringValue(this.width * (i / count), stiffness, damping),
            width: this.width * (0.02 + Math.random() * 0.05),
            color: i % 2 === 0 ? this.palette.shape1 : this.palette.shape2,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1.5
        });
    }
  }

  update(dt) {
    const time = Date.now() * 0.001;
    this.strips.forEach(s => {
        const offset = Math.sin(time * s.speed + s.phase) * (40 * this.motion);
        s.pos.setTarget(s.pos.target + offset * 0.01); // Subtle drift
        s.pos.step(dt);
    });
  }

  render(ctx) {
    const h = this.height;

    // Background
    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, this.width, h);

    // Draw Strips
    this.strips.forEach(s => {
        ctx.save();
        ctx.translate(s.pos.value, 0);
        
        // Main Glow
        const grad = ctx.createLinearGradient(0, 0, s.width, 0);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(0.5, s.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = grad;
        ctx.fillRect(-s.width, 0, s.width * 3, h);
        
        // Center Core
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(s.width * 0.45, 0, s.width * 0.1, h);
        
        ctx.restore();
    });
  }
}
