/** @format */

import { RNG } from "./rng.js";

export function buildTextureCanvas(width, height, seed, intensity = 0.05) {
  const rng = new RNG(seed);
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const ctx = off.getContext("2d");

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const v = rng.int(200, 255);
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return off;
}
