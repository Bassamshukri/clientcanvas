/** @format */

import { BaseStyle } from "../base-style.js";
import { SpringValue } from "../../core/physics.js";

export class BotanicalDriftStyle extends BaseStyle {
  regenerate() {
    const stiffness = 50 + this.physics * 80;
    const damping = 22 + (1 - this.physics) * 12;

    this.leaves = [];
    const count = 5 + Math.floor(this.detail * 10);
    
    for (let i = 0; i < count; i++) {
        this.leaves.push({
            x: this.width * this.rng.range(0.1, 0.9),
            y: this.height * this.rng.range(0.1, 0.9),
            scale: new SpringValue(0.5 + this.rng.range(0, 0.5), stiffness, damping),
            rot: new SpringValue(this.rng.range(0, Math.PI * 2), stiffness, damping),
            color: this.rng.pick([this.palette.shape1, this.palette.shape2, this.palette.shape3]),
            phase: this.rng.range(0, Math.PI * 2)
        });
    }
  }

  update(dt) {
    const time = Date.now() * 0.0006;
    this.leaves.forEach(leaf => {
        leaf.rot.setTarget(leaf.rot.target + Math.sin(time + leaf.phase) * 0.2 * this.motion);
        leaf.scale.setTarget(leaf.scale.target + Math.cos(time + leaf.phase) * 0.05 * this.motion);
        leaf.rot.step(dt);
        leaf.scale.step(dt);
    });
  }

  render(ctx) {
    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    this.leaves.forEach(leaf => {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rot.value);
        ctx.scale(leaf.scale.value, leaf.scale.value);
        
        ctx.fillStyle = leaf.color;
        ctx.beginPath();
        // Drawing an organic leaf shape with beziers
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(50, -100, 150, -50, 0, 200);
        ctx.bezierCurveTo(-150, -50, -50, -100, 0, 0);
        ctx.fill();
        
        ctx.restore();
    });
  }
}
