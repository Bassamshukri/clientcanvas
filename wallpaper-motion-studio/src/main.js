import { App } from "./core/app.js";

window.addEventListener("DOMContentLoaded", () => {
    const app = new App();
    window.app = app; // For debugging
});
