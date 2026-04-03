/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class SCurveSplitStyle extends BaseStyle {
  regenerate() {
    const stiffness = 90 + this.physics * 140;
    const damping = 12 + (1 - this.physics) * 10;

    this.cp1x = new SpringValue(this.width * 0.2, stiffness, damping);
    this.cp1y = new SpringValue(this.height * 0.4, stiffness, damping);
    this.cp2x = new SpringValue(this.width * 0.8, stiffness, damping);
    this.cp2y = new SpringValue(this.height * 0.6, stiffness, damping);
  }

  update(dt) {
    const time = Date.now() * 0.001;
    const sway = 100 * this.motion;

    this.cp1x.setTarget(this.width * 0.2 + Math.sin(time) * sway);
    this.cp1y.setTarget(this.height * 0.4 + Math.cos(time * 0.8) * sway);
    this.cp2x.setTarget(this.width * 0.8 + Math.sin(time * 1.2) * sway);
    this.cp2y.setTarget(this.height * 0.6 + Math.cos(time * 0.9) * sway);

    this.cp1x.step(dt);
    this.cp1y.step(dt);
    this.cp2x.step(dt);
    this.cp2y.step(dt);
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;

    // Background
    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, w, h);

    // S-Curve split
    ctx.fillStyle = this.palette.shape1;
    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, h);
    ctx.bezierCurveTo(this.cp1x.value, this.cp1y.value, this.cp2x.value, this.cp2y.value, w, h);
    ctx.closePath();
    ctx.fill();

    // Accent line
    if (this.detail > 0.4) {
      ctx.strokeStyle = this.palette.shape3;
      ctx.lineWidth = 10 * this.detail;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.bezierCurveTo(this.cp1x.value, this.cp1y.value, this.cp2x.value, this.cp2y.value, w, h);
      ctx.stroke();
    }
  }
}
