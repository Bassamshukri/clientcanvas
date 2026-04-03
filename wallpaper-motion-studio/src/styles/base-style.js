import { RNG } from "../core/rng.js";

export class BaseStyle {
  constructor(config) {
    this.width = config.width;
    this.height = config.height;
    this.seed = config.seed;
    this.choice = config.choice;
    this.palette = config.palette;
    this.detail = config.detail;
    this.motion = config.motion;
    this.physics = config.physics;
    this.shadows = config.shadows;

    this.rng = new RNG(`${this.seed}-${this.choice}`);
    this.regenerate();
  }

  regenerate() {
     // Overridden by child classes
  }

  updateConfig(newConfig) {
    Object.assign(this, newConfig);
    // Optionally trigger a partial regeneration if needed
  }

  update(dt) {
    // Overridden by child classes for physics steps
  }

  render(ctx) {
    // Overridden by child classes for drawing
  }
}
