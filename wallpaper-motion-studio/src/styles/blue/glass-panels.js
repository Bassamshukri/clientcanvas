/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringVec2 } from "../../core/physics.js";

export class GlassPanelsStyle extends BaseStyle {
  regenerate() {
    const stiffness = 70 + this.physics * 100;
    const damping = 20 + (1 - this.physics) * 15;

    this.panels = [];
    for (let i = 0; i < 5; i++) {
      this.panels.push({
        pos: new SpringVec2(
          this.width * this.rng.range(0.2, 0.8),
          this.height * this.rng.range(0.2, 0.8),
          stiffness,
          damping
        ),
        w: this.width * this.rng.range(0.4, 0.8),
        h: this.height * this.rng.range(0.2, 0.4),
        rot: this.rng.range(-0.5, 0.5),
        color: i % 2 === 0 ? this.palette.shape1 : this.palette.shape2,
        phase: this.rng.range(0, Math.PI * 2),
      });
    }
  }

  update(dt) {
    const time = Date.now() * 0.001;
    const sway = 100 * this.motion;

    this.panels.forEach((p, i) => {
      p.pos.setTarget(
        p.pos.x.target + Math.sin(time + p.phase) * (sway * 0.2),
        p.pos.y.target + Math.cos(time + p.phase * 1.5) * (sway * 0.2)
      );
      p.pos.step(dt);
    });
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, this.palette.bg);
    bgGrad.addColorStop(1, darken(this.palette.bg, 0.3));
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Draw Panels
    this.panels.forEach((p) => {
      ctx.save();
      ctx.translate(p.pos.x.value, p.pos.y.value);
      ctx.rotate(p.rot);

      // Glass Body
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      if (this.shadows) {
          ctx.shadowColor = "rgba(0,0,0,0.4)";
          ctx.shadowBlur = 40;
      }
      this.roundRect(ctx, -p.w / 2, -p.h / 2, p.w, p.h, 20);
      ctx.fill();

      // Border Highlight
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Colored Glow
      if (this.detail > 0.3) {
          const grad = ctx.createLinearGradient(-p.w/2, -p.h/2, p.w/2, p.h/2);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.globalAlpha = 0.1 * this.detail;
          ctx.fillStyle = grad;
          this.roundRect(ctx, -p.w/2, -p.h/2, p.w, p.h, 20);
          ctx.fill();
      }

      ctx.restore();
    });
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

function darken(hex, amount) {
    // Helper to avoid circular import if needed, but App/Palette has it
    return hex; 
}
