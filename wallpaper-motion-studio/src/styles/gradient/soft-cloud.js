/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";
import { ValueNoise } from "../../core/noise.js";

export class SoftCloudStyle extends BaseStyle {
  regenerate() {
    this.noise = new ValueNoise(`${this.seed}-${this.choice}`);
    
    const stiffness = 60 + this.physics * 100;
    const damping = 20 + (1 - this.physics) * 15;

    this.cloud1X = new SpringValue(this.width * 0.3, stiffness, damping);
    this.cloud1Y = new SpringValue(this.height * 0.4, stiffness, damping);
    this.cloud2X = new SpringValue(this.width * 0.7, stiffness, damping);
    this.cloud2Y = new SpringValue(this.height * 0.6, stiffness, damping);
  }

  update(dt) {
    const time = Date.now() * 0.0005;
    const sway = 200 * this.motion;

    this.cloud1X.setTarget(this.width * 0.3 + (this.noise.noise(time) - 0.5) * sway);
    this.cloud1Y.setTarget(this.height * 0.4 + (this.noise.noise(time + 10) - 0.5) * sway);
    this.cloud2X.setTarget(this.width * 0.7 + (this.noise.noise(time + 20) - 0.5) * sway);
    this.cloud2Y.setTarget(this.height * 0.6 + (this.noise.noise(time + 30) - 0.5) * sway);

    this.cloud1X.step(dt);
    this.cloud1Y.step(dt);
    this.cloud2X.step(dt);
    this.cloud2Y.step(dt);
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;

    // Draw main gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, this.palette.bg);
    bgGrad.addColorStop(1, this.palette.shape1);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Draw soft blurs (clouds)
    this.drawCloud(ctx, this.cloud1X.value, this.cloud1Y.value, w * 0.6, this.palette.shape2);
    this.drawCloud(ctx, this.cloud2X.value, this.cloud2Y.value, w * 0.8, this.palette.shape3);
  }

  drawCloud(ctx, x, y, radius, color) {
    ctx.save();
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.4 + this.detail * 0.4;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
