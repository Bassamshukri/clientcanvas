/** @format */

export class FXPipeline {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.offscreen = document.createElement("canvas");
        this.offscreen.width = width;
        this.offscreen.height = height;
        this.offCtx = this.offscreen.getContext("2d");
    }

    resize(w, h) {
        this.width = w;
        this.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
    }

    applyBloom(canvas, intensity) {
        if (intensity <= 0) return;
        
        this.offCtx.clearRect(0, 0, this.width, this.height);
        this.offCtx.filter = `blur(${intensity * 40}px) brightness(1.2)`;
        this.offCtx.drawImage(canvas, 0, 0);
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = "screen";
        this.ctx.globalAlpha = intensity * 0.8;
        this.ctx.drawImage(this.offscreen, 0, 0);
        this.ctx.restore();
    }

    applyVignette(intensity) {
        if (intensity <= 0) return;

        const grad = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, Math.max(this.width, this.height) * 0.7
        );
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, `rgba(0,0,0,${intensity * 0.6})`);

        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    applyChromaticAberration(canvas, intensity) {
        if (intensity <= 0) return;

        const offset = intensity * 10;
        this.ctx.save();
        
        // Red channel
        this.ctx.globalCompositeOperation = "screen";
        this.ctx.globalAlpha = 1.0;
        this.ctx.drawImage(canvas, -offset, 0);
        
        // Rests of the composite would require channel splitting, 
        // which is slow in 2D canvas without WebGL. 
        // For 2D, we'll stick to a simpler translucent offset effect.
        
        this.ctx.globalAlpha = 0.5;
        this.ctx.drawImage(canvas, offset, 0);
        
        this.ctx.restore();
    }
}
