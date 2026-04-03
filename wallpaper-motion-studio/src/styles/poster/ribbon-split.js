/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";
import { darken } from "../../core/palette.js";

export class RibbonSplitStyle extends BaseStyle {
  regenerate() {
    // Re-seed RNG for deterministic generation
    this.rng.initialSeed = this.rng.hashString(`${this.seed}-${this.choice}`);

    const stiffness = 80 + this.physics * 160;
    const damping = 12 + (1 - this.physics) * 10;

    this.baseTop = this.width * (0.24 + this.rng.range(0, 0.12));
    this.baseMid = this.width * (0.54 + this.rng.range(0, 0.2));
    this.baseBot = this.width * (0.22 + this.rng.range(0, 0.1));

    this.top = new SpringValue(this.baseTop, stiffness, damping);
    this.mid = new SpringValue(this.baseMid, stiffness, damping);
    this.bot = new SpringValue(this.baseBot, stiffness, damping);

    this.phase = this.rng.range(0, Math.PI * 2);
  }

  update(dt) {
    const sway = 20 + this.motion * 60;
    const time = Date.now() * 0.002;

    this.top.setTarget(this.baseTop + Math.sin(time + this.phase) * sway);
    this.mid.setTarget(this.baseMid + Math.cos(time + this.phase * 1.5) * sway);
    this.bot.setTarget(this.baseBot + Math.sin(time * 0.8 + this.phase) * sway);

    this.top.step(dt);
    this.mid.step(dt);
    this.bot.step(dt);
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;

    // Draw main split
    ctx.fillStyle = this.palette.shape1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.top.value, 0);
    ctx.lineTo(this.mid.value, h * 0.5);
    ctx.lineTo(this.bot.value, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // Draw secondary split
    ctx.fillStyle = this.palette.shape2;
    ctx.beginPath();
    ctx.moveTo(this.top.value, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(this.bot.value, h);
    ctx.lineTo(this.mid.value, h * 0.5);
    ctx.fill();

    // Optional Accent
    if (this.detail > 0.3) {
      ctx.fillStyle = this.palette.shape3;
      const stripeW = 10 + this.detail * 40;
      ctx.beginPath();
      ctx.moveTo(this.top.value - stripeW, 0);
      ctx.lineTo(this.top.value, 0);
      ctx.lineTo(this.mid.value, h * 0.5);
      ctx.lineTo(this.bot.value, h);
      ctx.lineTo(this.bot.value - stripeW, h);
      ctx.lineTo(this.mid.value - stripeW, h * 0.5);
      ctx.fill();
    }

    // Shadow line
    if (this.shadows) {
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(this.top.value, 0);
      ctx.lineTo(this.mid.value, h * 0.5);
      ctx.lineTo(this.bot.value, h);
      ctx.stroke();
    }
  }
}
