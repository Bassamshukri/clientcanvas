/** @format */

import { Particle } from "./physics.js";

export class ParticleSystem {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.particles = [];
        this.density = 0.5;
    }

    setDensity(val) {
        this.density = val;
        const targetCount = Math.floor(val * 400);
        
        while (this.particles.length < targetCount) {
            this.particles.push(new Particle());
        }
        while (this.particles.length > targetCount) {
            this.particles.pop();
        }
    }

    resize(w, h) {
        this.width = w;
        this.height = h;
        this.particles.forEach(p => p.reset(w, h));
    }

    update(dt) {
        this.particles.forEach(p => p.update(dt, this.width, this.height));
    }

    render() {
        if (this.density <= 0) return;
        
        this.ctx.save();
        this.particles.forEach(p => {
            this.ctx.fillStyle = `rgba(255,255,255,${p.life * 0.4})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.restore();
    }
}
