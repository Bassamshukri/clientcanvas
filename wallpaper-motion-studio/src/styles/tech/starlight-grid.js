/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class StarlightGridStyle extends BaseStyle {
  regenerate() {
    this.stars = [];
    const count = 40 + Math.floor(this.detail * 60);
    
    for (let i = 0; i < count; i++) {
        this.stars.push({
            x: this.width * Math.random(),
            y: this.height * Math.random(),
            size: 1 + Math.random() * 2,
            opacity: new SpringValue(0.2 + Math.random() * 0.8, 60, 20),
            connections: []
        });
    }

    // Connect nearby stars
    this.stars.forEach((s, i) => {
        for (let j = i + 1; j < this.stars.length; j++) {
            const other = this.stars[j];
            const dx = s.x - other.x;
            const dy = s.y - other.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) s.connections.push(other);
        }
    });
  }

  update(dt) {
    const time = Date.now() * 0.001;
    this.stars.forEach((s, i) => {
        s.opacity.setTarget(0.2 + Math.sin(time + i) * 0.5 * this.motion);
        s.opacity.step(dt);
    });
  }

  render(ctx) {
    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.strokeStyle = this.palette.shape1;
    ctx.lineWidth = 1;

    // Draw Constellations
    this.stars.forEach(s => {
        ctx.globalAlpha = s.opacity.value * 0.2;
        s.connections.forEach(other => {
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
        });
    });

    // Draw Stars
    ctx.fillStyle = "#fff";
    this.stars.forEach(s => {
        ctx.globalAlpha = s.opacity.value;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    });
  }
}
