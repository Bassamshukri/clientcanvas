/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class ChevronCascadeStyle extends BaseStyle {
  regenerate() {
    const stiffness = 80 + this.physics * 100;
    const damping = 15 + (1 - this.physics) * 10;

    this.layers = [];
    const count = 5 + Math.floor(this.detail * 5);
    
    for (let i = 0; i < count; i++) {
        this.layers.push({
            pos: new SpringValue(this.height * (i / count), stiffness, damping),
            color: this.rng.pick([this.palette.shape1, this.palette.shape2, this.palette.shape3]),
            phase: Math.random() * Math.PI * 2,
            h: this.height / count
        });
    }
  }

  update(dt) {
    const time = Date.now() * 0.001;
    this.layers.forEach((l, i) => {
        const offset = Math.sin(time + i) * (50 * this.motion);
        l.pos.setTarget(l.height * (i / this.layers.length) + offset);
        l.pos.step(dt);
    });
  }

  render(ctx) {
    const w = this.width;
    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, w, this.height);

    const chevronHeight = 100 * (0.5 + this.detail);

    this.layers.forEach(l => {
        ctx.fillStyle = l.color;
        ctx.beginPath();
        ctx.moveTo(0, l.pos.value);
        ctx.lineTo(w / 2, l.pos.value + chevronHeight);
        ctx.lineTo(w, l.pos.value);
        ctx.lineTo(w, l.pos.value + l.h);
        ctx.lineTo(w / 2, l.pos.value + l.h + chevronHeight);
        ctx.lineTo(0, l.pos.value + l.h);
        ctx.closePath();
        ctx.fill();
    });
  }
}
