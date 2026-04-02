"use client";

import dynamic from "next/dynamic";

export const DynamicEditorShell = dynamic(
  () => import("./editor-shell").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="shell" style={{ textAlign: "center", padding: "80px" }}>
        Loading editor canvas...
      </div>
    ),
  }
);
