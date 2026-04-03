import { lerp, smoothstep } from "./math.js";

function seedFromString(str) {
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) >>> 0;
  }
  return seed;
}

export class ValueNoise {
  constructor(seed = "noise") {
    this.seed = seedFromString(seed);
  }

  hash(n) {
    const x = Math.sin((n + this.seed) * 127.1) * 43758.5453123;
    return x - Math.floor(x);
  }

  noise(x) {
    const i = Math.floor(x);
    const f = x - i;
    return lerp(this.hash(i), this.hash(i + 1), smoothstep(0, 1, f));
  }

  noise2D(x, y) {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;

    const a = this.hash(i + j * 57);
    const b = this.hash(i + 1 + j * 57);
    const c = this.hash(i + (j + 1) * 57);
    const d = this.hash(i + 1 + (j + 1) * 57);

    const ux = smoothstep(0, 1, fx);
    const uy = smoothstep(0, 1, fy);

    return lerp(a, b, ux) + (c - a) * uy * (1 - ux) + (d - b) * ux * uy;
  }
}
