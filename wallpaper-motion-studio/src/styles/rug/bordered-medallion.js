/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";
import { polar } from "../../core/math.js";

export class BorderedMedallionStyle extends BaseStyle {
  regenerate() {
    const stiffness = 80 + this.physics * 120;
    const damping = 15 + (1 - this.physics) * 10;

    this.scale = new SpringValue(1.0, stiffness, damping);
    this.rotation = new SpringValue(0.0, stiffness, damping);
    this.borderWidth = new SpringValue(this.width * 0.1, stiffness, damping);
  }

  update(dt) {
    const time = Date.now() * 0.001;
    this.scale.setTarget(1.0 + Math.sin(time * 0.5) * 0.05 * this.motion);
    this.rotation.setTarget(Math.sin(time * 0.3) * 0.1 * this.motion);

    this.scale.step(dt);
    this.rotation.step(dt);
    this.borderWidth.step(dt);
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;
    const bw = this.borderWidth.value;

    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, w, h);

    // Draw Main Border
    ctx.strokeStyle = this.palette.shape1;
    ctx.lineWidth = 10;
    ctx.strokeRect(bw * 0.5, bw * 0.5, w - bw, h - bw);

    // Draw Inner Border
    ctx.strokeStyle = this.palette.shape2;
    ctx.lineWidth = 4;
    ctx.strokeRect(bw * 0.8, bw * 0.8, w - bw * 1.6, h - bw * 1.6);

    // Center Viewport
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(this.scale.value, this.scale.value);
    ctx.rotate(this.rotation.value);

    // Central Medallion (Diamond/Star)
    this.drawMedallion(ctx, 0, 0, w * 0.35, 16);

    // Corner Motifs
    const cornerDistX = w * 0.25;
    const cornerDistY = h * 0.35;
    this.drawMedallion(ctx, -cornerDistX, -cornerDistY, w * 0.08, 8);
    this.drawMedallion(ctx, cornerDistX, -cornerDistY, w * 0.08, 8);
    this.drawMedallion(ctx, -cornerDistX, cornerDistY, w * 0.08, 8);
    this.drawMedallion(ctx, cornerDistX, cornerDistY, w * 0.08, 8);

    ctx.restore();
  }

  drawMedallion(ctx, x, y, radius, vertices) {
    ctx.save();
    ctx.translate(x, y);

    // Main shape
    ctx.fillStyle = this.palette.shape1;
    ctx.beginPath();
    for (let i = 0; i < vertices; i++) {
        const r = (i % 2 === 0) ? radius : radius * 0.6;
        const angle = (i / vertices) * Math.PI * 2;
        const p = polar(0, 0, r, angle);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fill();

    // Inner detail
    if (this.detail > 0.3) {
        ctx.fillStyle = this.palette.shape2;
        ctx.beginPath();
        for (let i = 0; i < vertices; i++) {
            const r = (i % 2 === 0) ? radius * 0.5 : radius * 0.8;
            const angle = (i / vertices) * Math.PI * 2 + Math.PI / vertices;
            const p = polar(0, 0, r, angle);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
  }
}
