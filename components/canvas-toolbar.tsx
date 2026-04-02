"use client";

interface CanvasToolbarProps {
  onAddText: () => void;
  onAddRect: () => void;
  onAddCircle: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onSave: () => void;
  onExportPng: () => void;
  onExportJpg: () => void;
  onExportPdf: () => void;
  onApplyBackground: (color: string) => void;
  onAddImageUrl: (url: string) => void;
}

const SWATCHES = ["#ffffff", "#f3f4f6", "#fef3c7", "#dbeafe", "#ede9fe", "#dcfce7", "#111827"];

export function CanvasToolbar(props: CanvasToolbarProps) {
  return (
    <section className="panelCard">
      <div className="toolbarHeader">
        <div>
          <div className="badge">Toolbar</div>
          <h3>Canvas actions</h3>
        </div>
      </div>

      <div className="toolbarGrid">
        <button className="primaryButton" type="button" onClick={props.onAddText}>
          Add text
        </button>
        <button className="secondaryButton" type="button" onClick={props.onAddRect}>
          Add rectangle
        </button>
        <button className="secondaryButton" type="button" onClick={props.onAddCircle}>
          Add circle
        </button>
        <button
          className="secondaryButton"
          type="button"
          onClick={() => {
            const value = window.prompt("Paste image URL");
            if (value) props.onAddImageUrl(value);
          }}
        >
          Add image URL
        </button>
        <button className="secondaryButton" type="button" onClick={props.onDuplicate}>
          Duplicate
        </button>
        <button className="secondaryButton" type="button" onClick={props.onDelete}>
          Delete
        </button>
        <button className="secondaryButton" type="button" onClick={props.onBringForward}>
          Bring forward
        </button>
        <button className="secondaryButton" type="button" onClick={props.onSendBackward}>
          Send backward
        </button>
        <button className="secondaryButton" type="button" onClick={props.onSave}>
          Save
        </button>
        <button className="secondaryButton" type="button" onClick={props.onExportPng}>
          Export PNG
        </button>
        <button className="secondaryButton" type="button" onClick={props.onExportJpg}>
          Export JPG
        </button>
        <button className="secondaryButton" type="button" onClick={props.onExportPdf}>
          Export PDF
        </button>
      </div>

      <div className="stack" style={{ marginTop: 20 }}>
        <strong>Background</strong>
        <div className="swatchRow">
          {SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              className="colorSwatch"
              style={{ background: color, borderColor: color === "#ffffff" ? "rgba(255,255,255,0.2)" : color }}
              onClick={() => props.onApplyBackground(color)}
              aria-label={`Use ${color}`}
              title={color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}