/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class DamaskOrnamentStyle extends BaseStyle {
  regenerate() {
    const stiffness = 80 + this.physics * 100;
    const damping = 20 + (1 - this.physics) * 10;

    this.scale = new SpringValue(1.0, stiffness, damping);
    this.ornaments = [];
    const count = 3 + Math.floor(this.detail * 4);
    
    for (let i = 0; i < count; i++) {
        this.ornaments.push({
            y: this.height * (i / count),
            color: i % 2 === 0 ? this.palette.shape1 : this.palette.shape2,
            phase: Math.random() * Math.PI * 2
        });
    }
  }

  update(dt) {
    const time = Date.now() * 0.0005;
    this.scale.setTarget(1.0 + Math.sin(time) * 0.1 * this.motion);
    this.scale.step(dt);
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;

    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w/2, h/2);
    ctx.scale(this.scale.value, this.scale.value);
    ctx.translate(-w/2, -h/2);

    this.ornaments.forEach(o => {
        this.drawOrnateRow(ctx, o.y, o.color);
    });
    
    ctx.restore();
  }

  drawOrnateRow(ctx, y, color) {
    const w = this.width;
    ctx.fillStyle = color;
    
    // Draw mirrored flourishes
    this.drawFlourish(ctx, w/2, y, 1);
    this.drawFlourish(ctx, w/2, y, -1);
  }

  drawFlourish(ctx, x, y, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(50, -100, 150, -50, 200, 100);
    ctx.bezierCurveTo(150, 200, 50, 150, 0, 50);
    ctx.closePath();
    ctx.fill();
    
    if (this.detail > 0.5) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    ctx.restore();
  }
}
