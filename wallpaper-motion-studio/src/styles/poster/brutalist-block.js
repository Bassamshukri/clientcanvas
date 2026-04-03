/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class BrutalistBlockStyle extends BaseStyle {
  regenerate() {
    const stiffness = 200 + this.physics * 500;
    const damping = 10 + (1 - this.physics) * 10;

    this.blocks = [];
    const count = 4 + Math.floor(this.detail * 6);
    
    for (let i = 0; i < count; i++) {
        this.blocks.push({
            x: this.width * (0.2 + 0.6 * Math.random()),
            y: this.height * (0.2 + 0.6 * Math.random()),
            w: this.width * (0.3 + 0.4 * Math.random()),
            h: this.height * (0.1 + 0.3 * Math.random()),
            rotation: new SpringValue(0, stiffness, damping),
            color: this.rng.pick([this.palette.shape1, this.palette.shape2, this.palette.shape3])
        });
    }
  }

  update(dt) {
    const time = Date.now() * 0.001;
    this.blocks.forEach((b, i) => {
        b.rotation.setTarget(Math.sin(time + i) * 0.1 * this.motion);
        b.rotation.step(dt);
    });
  }

  render(ctx) {
    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 12;

    this.blocks.forEach((b) => {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation.value);
        
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.w/2, -b.h/2, b.w, b.h);
        ctx.strokeRect(-b.w/2, -b.h/2, b.w, b.h);
        
        if (this.detail > 0.5) {
            ctx.fillStyle = this.palette.bg;
            ctx.fillRect(-b.w/4, -b.h/4, b.w/2, b.h/2);
        }
        
        ctx.restore();
    });
  }
}
