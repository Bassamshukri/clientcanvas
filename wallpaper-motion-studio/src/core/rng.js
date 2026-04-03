export class RNG {
  constructor(seed = "studio") {
    this.initialSeed = this.hashString(seed.toString());
    this.next();
  }

  hashString(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }

  next() {
    let t = (this.initialSeed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  float(min = 0, max = 1) {
    return min + this.next() * (max - min);
  }

  int(min, max) {
    return Math.floor(this.float(min, max + 1));
  }

  bool(chance = 0.5) {
    return this.next() < chance;
  }

  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }

  range(min, max) {
    return this.float(min, max);
  }
}
