/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class TribalTessellationStyle extends BaseStyle {
  regenerate() {
    const stiffness = 120 + this.physics * 100;
    const damping = 18 + (1 - this.physics) * 10;

    this.shapes = [];
    for (let i = 0; i < 8; i++) {
        this.shapes.push({
            x: this.rng.range(0.1, 0.4) * this.width,
            y: this.rng.range(0.1, 0.4) * this.height,
            w: this.rng.range(0.05, 0.2) * this.width,
            h: this.rng.range(0.05, 0.2) * this.height,
            type: this.rng.pick(["rect", "tri", "diamond"]),
            color: this.rng.pick([this.palette.shape1, this.palette.shape2, this.palette.shape3]),
            offset: new SpringValue(0, stiffness, damping)
        });
    }
  }

  update(dt) {
    const time = Date.now() * 0.001;
    this.shapes.forEach((s, i) => {
        const target = Math.sin(time + i) * (20 * this.motion);
        s.offset.setTarget(target);
        s.offset.step(dt);
    });
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;

    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, w, h);

    // Render with 4-way symmetry
    this.shapes.forEach(s => {
        this.drawMirrored(ctx, s, w, h);
    });

    // Border
    ctx.strokeStyle = this.palette.shape1;
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, w - 40, h - 40);
  }

  drawMirrored(ctx, s, w, h) {
    this.drawShape(ctx, s.x + s.offset.value, s.y, s.w, s.h, s.type, s.color);
    this.drawShape(ctx, w - (s.x + s.offset.value), s.y, s.w, s.h, s.type, s.color);
    this.drawShape(ctx, s.x + s.offset.value, h - s.y, s.w, s.h, s.type, s.color);
    this.drawShape(ctx, w - (s.x + s.offset.value), h - s.y, s.w, s.h, s.type, s.color);
  }

  drawShape(ctx, x, y, w, h, type, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (type === "rect") {
        ctx.rect(x - w/2, y - h/2, w, h);
    } else if (type === "tri") {
        ctx.moveTo(x, y - h/2);
        ctx.lineTo(x + w/2, y + h/2);
        ctx.lineTo(x - w/2, y + h/2);
    } else {
        ctx.moveTo(x, y - h/2);
        ctx.lineTo(x + w/2, y);
        ctx.lineTo(x, y + h/2);
        ctx.lineTo(x - w/2, y);
    }
    ctx.closePath();
    ctx.fill();
  }
}
