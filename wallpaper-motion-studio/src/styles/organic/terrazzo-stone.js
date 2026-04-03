/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class TerrazzoStoneStyle extends BaseStyle {
  regenerate() {
    this.chips = [];
    const count = 30 + Math.floor(this.detail * 50);
    
    for (let i = 0; i < count; i++) {
        this.chips.push({
            x: this.width * Math.random(),
            y: this.height * Math.random(),
            size: this.width * (0.05 + 0.1 * Math.random()),
            color: this.rng.pick([this.palette.shape1, this.palette.shape2, this.palette.shape3]),
            op: new SpringValue(0.4 + 0.4 * Math.random(), 80, 15)
        });
    }
  }

  update(dt) {
    const time = Date.now() * 0.001;
    this.chips.forEach((c, i) => {
        c.op.setTarget(0.4 + Math.sin(time + i) * 0.2 * this.motion);
        c.op.step(dt);
    });
  }

  render(ctx) {
    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    this.chips.forEach((c) => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.globalAlpha = c.op.value;
        ctx.fillStyle = c.color;
        
        ctx.beginPath();
        const verts = 3 + Math.floor(this.rng.range(0, 5));
        for (let i = 0; i < verts; i++) {
            const r = c.size * (0.8 + 0.4 * Math.random());
            const a = (i / verts) * Math.PI * 2 + Math.random() * 0.5;
            if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    });
  }
}
