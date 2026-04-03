/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class IslamicStarStyle extends BaseStyle {
  regenerate() {
    const stiffness = 100 + this.physics * 150;
    const damping = 15 + (1 - this.physics) * 10;

    this.tileSize = this.width * (0.2 + this.detail * 0.3);
    this.rotations = [];
    
    // Create a grid of points for tiling
    for (let i = 0; i < 20; i++) {
        this.rotations.push(new SpringValue(0, stiffness, damping));
    }
  }

  update(dt) {
    const time = Date.now() * 0.0005;
    this.rotations.forEach((rot, i) => {
        const target = Math.sin(time + i * 0.5) * (0.4 * this.motion);
        rot.setTarget(target);
        rot.step(dt);
    });
  }

  render(ctx) {
    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    const ts = this.tileSize;
    const cols = Math.ceil(this.width / ts) + 1;
    const rows = Math.ceil(this.height / ts) + 1;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            ctx.save();
            ctx.translate(c * ts, r * ts);
            ctx.rotate(this.rotations[(r + c) % 20].value);
            
            this.drawStar(ctx, ts * 0.5, this.palette.shape1);
            
            ctx.restore();
        }
    }
  }

  drawStar(ctx, size, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    
    // Draw 8-point star by layering two squares
    ctx.save();
    ctx.beginPath();
    ctx.rect(-size/2, -size/2, size, size);
    ctx.stroke();
    
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.rect(-size/2, -size/2, size, size);
    ctx.stroke();
    ctx.restore();
    
    // Inner octagram pattern
    if (this.detail > 0.4) {
        ctx.fillStyle = this.palette.shape2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * size * 0.4;
            const y = Math.sin(angle) * size * 0.4;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }
  }
}
