"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Canvas } from "fabric";
import { getSlideBoundaries } from "../lib/fabric-layout";

interface PresentationModeProps {
  canvas: Canvas | null;
  onClose: () => void;
}

export function PresentationMode({ canvas, onClose }: PresentationModeProps) {
  const [slideBoundaries, setSlideBoundaries] = useState<number[]>([0]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (canvas) {
      const boundaries = getSlideBoundaries(canvas);
      setSlideBoundaries(boundaries);
    }
  }, [canvas]);

  const goToSlide = useCallback((index: number) => {
    if (!canvas || index < 0 || index >= slideBoundaries.length) return;
    
    const targetY = slideBoundaries[index];
    const vpt = canvas.viewportTransform;
    if (vpt) {
      // Logic: Shift the viewport vertically to the slide start
      // Zoom is assumed to be 1 or adjusted for presentation
      const zoom = 1.0; 
      canvas.setZoom(zoom);
      vpt[4] = (canvas.width! - 800 * zoom) / 2; // Center horizontally
      vpt[5] = -targetY * zoom;
      canvas.requestRenderAll();
      setCurrentSlide(index);
    }
  }, [canvas, slideBoundaries]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        goToSlide(currentSlide + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        goToSlide(currentSlide - 1);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, goToSlide, onClose]);

  // Initial align
  useEffect(() => {
    goToSlide(0);
  }, [goToSlide]);

  if (!canvas) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#000",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column"
    }}>
      {/* HUD Header */}
      <div style={{
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        color: "white",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }}>
        <div style={{ fontSize: "14px", fontWeight: "600", opacity: 0.8 }}>
          Presentation Mode • Slide {currentSlide + 1} of {slideBoundaries.length}
        </div>
        <button 
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "700"
          }}
        >
          Exit (Esc)
        </button>
      </div>

      {/* Slide Viewport container */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
         {/* The canvas from the parent is actually still being rendered in the main DOM, 
             but we are just letting the absolute positioning of the overlay cover everything.
             In a real app we might clone the design, but for this MVP we'll just manipulate 
              the existing canvas viewport since it's already there. */}
         <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", position: "absolute", bottom: "40px" }}>
            Use Space or Arrow Keys to navigate
         </p>
      </div>

      {/* Navigation Controls */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        right: "40px",
        display: "flex",
        gap: "12px"
      }}>
        <button 
          onClick={() => goToSlide(currentSlide - 1)}
          disabled={currentSlide === 0}
          style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "white", cursor: "pointer", opacity: currentSlide === 0 ? 0.3 : 1 }}
        >
          ←
        </button>
        <button 
          onClick={() => goToSlide(currentSlide + 1)}
          disabled={currentSlide === slideBoundaries.length - 1}
          style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--primary)", border: "none", color: "white", cursor: "pointer", opacity: currentSlide === slideBoundaries.length - 1 ? 0.3 : 1 }}
        >
          →
        </button>
      </div>
    </div>
  );
}
