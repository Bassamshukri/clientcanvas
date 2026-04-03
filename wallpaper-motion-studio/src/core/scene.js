/** @format */

export class Scene {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.layers = {
      background: [],
      shapes: [],
      atmosphere: [],
      texture: [],
      post: [],
    };
  }

  add(layer, drawable) {
    if (this.layers[layer]) {
      this.layers[layer].push(drawable);
    }
  }

  clear() {
    Object.keys(this.layers).forEach((key) => {
      this.layers[key] = [];
    });
  }

  render() {
    Object.keys(this.layers).forEach((key) => {
      this.layers[key].forEach((drawable) => {
        drawable.draw(this.ctx, this.width, this.height);
      });
    });
  }
}
