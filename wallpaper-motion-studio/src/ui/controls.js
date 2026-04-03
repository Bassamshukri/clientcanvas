/** @format */

import { Gallery } from "./gallery.js";

export class Controls {
  constructor(app) {
    this.app = app;
    this.gallery = new Gallery(app);
    this.refs = {
      choiceRange: document.getElementById("choiceRange"),
      choiceBadge: document.getElementById("choiceBadge"),
      seedInput: document.getElementById("seedInput"),
      styleSelect: document.getElementById("styleSelect"),
      paletteSelect: document.getElementById("paletteSelect"),
      motionRange: document.getElementById("motionRange"),
      physicsRange: document.getElementById("physicsRange"),
      detailRange: document.getElementById("detailRange"),
      bloomRange: document.getElementById("bloomRange"),
      vignetteRange: document.getElementById("vignetteRange"),
      aberrationRange: document.getElementById("aberrationRange"),
      particleRange: document.getElementById("particleRange"),
      autoPlayToggle: document.getElementById("autoPlayToggle"),
      batchBtn: document.getElementById("batchBtn"),
      randomBtn: document.getElementById("randomBtn"),
      galleryBtn: document.getElementById("galleryBtn"),
      ratioSelect: document.getElementById("ratioSelect"),
      saveBtn: document.getElementById("saveBtn"),
      loadBtn: document.getElementById("loadBtn"),
      exportBtn: document.getElementById("exportBtn"),
    };

    this.init();
  }

  init() {
    this.refs.choiceRange.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      this.refs.choiceBadge.innerText = `#${val}`;
      this.app.updateState("choice", val);
    });

    this.refs.seedInput.addEventListener("change", (e) => {
      this.app.updateState("seed", e.target.value);
    });

    this.refs.styleSelect.addEventListener("change", (e) => {
      this.app.updateState("style", e.target.value);
    });

    this.refs.paletteSelect.addEventListener("change", (e) => {
      this.app.updateState("paletteMode", e.target.value);
    });

    this.refs.ratioSelect.addEventListener("change", (e) => {
      this.app.updateState("ratio", e.target.value);
    });

    this.refs.motionRange.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      this.app.updateState("motion", val);
    });

    this.refs.physicsRange.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      this.app.updateState("physics", val);
    });

    this.refs.detailRange.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      this.app.updateState("detail", val);
    });

    this.refs.bloomRange.addEventListener("input", (e) => {
      this.app.updateState("bloom", parseFloat(e.target.value));
    });

    this.refs.vignetteRange.addEventListener("input", (e) => {
      this.app.updateState("vignette", parseFloat(e.target.value));
    });

    this.refs.aberrationRange.addEventListener("input", (e) => {
      this.app.updateState("aberration", parseFloat(e.target.value));
    });

    this.refs.particleRange.addEventListener("input", (e) => {
      this.app.updateState("particles", parseFloat(e.target.value));
    });

    this.refs.autoPlayToggle.addEventListener("change", (e) => {
      this.app.updateState("autoPlay", e.target.checked);
    });

    this.refs.batchBtn.addEventListener("click", () => {
      this.app.batchExport(10);
    });

    this.refs.randomBtn.addEventListener("click", () => {
      const nextChoice = Math.floor(Math.random() * 1000) + 1;
      this.refs.choiceRange.value = nextChoice;
      this.refs.choiceBadge.innerText = `#${nextChoice}`;
      this.app.updateState("choice", nextChoice);
    });

    this.refs.saveBtn.addEventListener("click", () => {
      this.app.savePreset();
    });

    this.refs.loadBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          this.app.loadPreset(event.target.result);
        };
        reader.readAsText(file);
      };
      input.click();
    });

    this.refs.galleryBtn.addEventListener("click", () => {
      this.gallery.show();
    });

    this.refs.exportBtn.addEventListener("click", () => {
      this.app.export();
    });
  }

  updateFromState(state) {
    this.refs.choiceRange.value = state.choice;
    this.refs.choiceBadge.innerText = `#${state.choice}`;
    this.refs.seedInput.value = state.seed;
    this.refs.styleSelect.value = state.style;
    this.refs.paletteSelect.value = state.paletteMode;
    this.refs.ratioSelect.value = state.ratio;
    this.refs.motionRange.value = state.motion;
    this.refs.physicsRange.value = state.physics;
    this.refs.detailRange.value = state.detail;
    this.refs.bloomRange.value = state.bloom;
    this.refs.vignetteRange.value = state.vignette;
    this.refs.aberrationRange.value = state.aberration;
    this.refs.particleRange.value = state.particles;
    this.refs.autoPlayToggle.checked = state.autoPlay;
  }

  populateStyles(registry) {
    const select = this.refs.styleSelect;
    select.innerHTML = "";
    Object.keys(registry).forEach((key) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.innerText = registry[key].label;
      select.appendChild(opt);
    });
  }
}
