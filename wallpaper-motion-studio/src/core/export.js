/** @format */

export function downloadCanvas(canvas, filename, mime = "image/jpeg", quality = 0.9) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL(mime, quality);
  link.click();
}

/**
 * Downloads an SVG version of the design by creating a basic SVG mock context
 * and calling the style's render method.
 */
export function downloadSVG(style, filename) {
  const width = style.width;
  const height = style.height;
  let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Basic Mock Context for SVG generation
  const mockCtx = {
    fillStyle: "#000",
    strokeStyle: "#000",
    lineWidth: 1,
    globalAlpha: 1,
    beginPath: () => { this.path = ""; },
    moveTo: (x, y) => { this.path += `M ${x} ${y} `; },
    lineTo: (x, y) => { this.path += `L ${x} ${y} `; },
    bezierCurveTo: (cp1x, cp1y, cp2x, cp2y, x, y) => {
      this.path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y} `;
    },
    arc: (x, y, r, sa, ea) => {
       // Simplified for circle
       this.path += `M ${x+r} ${y} A ${r} ${r} 0 1 1 ${x-r} ${y} A ${r} ${r} 0 1 1 ${x+r} ${y} `;
    },
    closePath: () => { this.path += "Z"; },
    fill: () => {
      svg += `<path d="${this.path}" fill="${mockCtx.fillStyle}" fill-opacity="${mockCtx.globalAlpha}" />`;
    },
    stroke: () => {
      svg += `<path d="${this.path}" fill="none" stroke="${mockCtx.strokeStyle}" stroke-width="${mockCtx.lineWidth}" stroke-opacity="${mockCtx.globalAlpha}" />`;
    },
    fillRect: (x, y, w, h) => {
      svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${mockCtx.fillStyle}" fill-opacity="${mockCtx.globalAlpha}" />`;
    },
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    strokeRect: (x, y, w, h) => {
      svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${mockCtx.strokeStyle}" stroke-width="${mockCtx.lineWidth}" />`;
    }
  };

  style.render(mockCtx);
  svg += "</svg>";

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
}
