/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringVec2 } from "../../core/physics.js";

export class GradientMeshStyle extends BaseStyle {
  regenerate() {
    const stiffness = 40 + this.physics * 60;
    const damping = 25 + (1 - this.physics) * 10;

    this.anchors = [];
    const colors = [this.palette.shape1, this.palette.shape2, this.palette.shape3, this.palette.bg];
    
    for (let i = 0; i < 4; i++) {
        this.anchors.push({
            pos: new SpringVec2(
                this.width * Math.random(),
                this.height * Math.random(),
                stiffness,
                damping
            ),
            color: colors[i],
            radius: this.width * (0.6 + Math.random() * 0.4),
            phase: Math.random() * Math.PI * 2
        });
    }
  }

  update(dt) {
    const time = Date.now() * 0.0004;
    const sway = 300 * this.motion;

    this.anchors.forEach((a, i) => {
        const tx = a.pos.x.target + Math.sin(time + a.phase) * sway;
        const ty = a.pos.y.target + Math.cos(time * 0.8 + a.phase) * sway;
        a.pos.setTarget(tx, ty);
        a.pos.step(dt);
    });
  }

  render(ctx) {
    const w = this.width;
    const h = this.height;

    // Fill base
    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, w, h);

    // Draw blended radial gradients
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    this.anchors.forEach(a => {
        const grad = ctx.createRadialGradient(
            a.pos.x.value, a.pos.y.value, 0,
            a.pos.x.value, a.pos.y.value, a.radius
        );
        grad.addColorStop(0, a.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(a.pos.x.value, a.pos.y.value, a.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
  }
}
