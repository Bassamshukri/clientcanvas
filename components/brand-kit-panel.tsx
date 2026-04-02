"use client";

import { useMemo, useState } from "react";

interface BrandKitPanelProps {
  workspaceId: string;
}

interface BrandKitState {
  primary: string;
  secondary: string;
  accent: string;
  fontFamily: string;
  logoUrl: string;
}

function storageKey(workspaceId: string) {
  return `clientcanvas-brandkit-${workspaceId}`;
}

export function BrandKitPanel({ workspaceId }: BrandKitPanelProps) {
  const initialState = useMemo<BrandKitState>(() => {
    if (typeof window === "undefined") {
      return {
        primary: "#6d5efc",
        secondary: "#111827",
        accent: "#19c29b",
        fontFamily: "Inter",
        logoUrl: ""
      };
    }

    try {
      const raw = window.localStorage.getItem(storageKey(workspaceId));
      if (!raw) throw new Error("missing");
      return JSON.parse(raw) as BrandKitState;
    } catch {
      return {
        primary: "#6d5efc",
        secondary: "#111827",
        accent: "#19c29b",
        fontFamily: "Inter",
        logoUrl: ""
      };
    }
  }, [workspaceId]);

  const [state, setState] = useState<BrandKitState>(initialState);
  const [savedAt, setSavedAt] = useState<string>("");

  function update<K extends keyof BrandKitState>(key: K, value: BrandKitState[K]) {
    setState((current) => ({
      ...current,
      [key]: value
    }));
  }

  function save() {
    window.localStorage.setItem(storageKey(workspaceId), JSON.stringify(state));
    setSavedAt(new Date().toLocaleString());
  }

  return (
    <section className="panelCard">
      <div className="badge">Brand kit</div>
      <h3>Workspace brand system</h3>
      <p className="mutedText">
        Save default colors, font, and logo reference for this workspace.
      </p>

      <div className="formGrid">
        <label className="field">
          <span>Primary color</span>
          <input type="color" value={state.primary} onChange={(e) => update("primary", e.target.value)} />
        </label>

        <label className="field">
          <span>Secondary color</span>
          <input type="color" value={state.secondary} onChange={(e) => update("secondary", e.target.value)} />
        </label>

        <label className="field">
          <span>Accent color</span>
          <input type="color" value={state.accent} onChange={(e) => update("accent", e.target.value)} />
        </label>

        <label className="field">
          <span>Font family</span>
          <input value={state.fontFamily} onChange={(e) => update("fontFamily", e.target.value)} />
        </label>

        <label className="field fieldFull">
          <span>Logo URL</span>
          <input value={state.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} placeholder="https://example.com/logo.png" />
        </label>
      </div>

      <div className="heroActions">
        <button className="primaryButton" type="button" onClick={save}>
          Save brand kit
        </button>
      </div>

      {savedAt ? <p className="mutedText">Saved at {savedAt}</p> : null}
    </section>
  );
}