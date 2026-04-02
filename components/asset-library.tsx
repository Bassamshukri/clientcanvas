"use client";

import { useActionState } from "react";
import { uploadAssetAction } from "../app/actions/assets";

interface AssetLibraryProps {
  workspaceId: string;
  assets: Array<{
    id: string;
    name: string;
    type: string;
    file_url: string;
    created_at?: string;
  }>;
  onUseAsset?: (url: string) => void;
}

const initialState = {
  ok: false,
  error: "",
  message: ""
};

export function AssetLibrary({
  workspaceId,
  assets,
  onUseAsset
}: AssetLibraryProps) {
  const [state, action, pending] = useActionState(uploadAssetAction, initialState);

  return (
    <section className="panelCard">
      <div className="badge">Assets</div>
      <h3>Workspace asset library</h3>
      <p className="mutedText">
        Upload reusable images for this workspace.
      </p>

      <form action={action}>
        <input type="hidden" name="workspaceId" value={workspaceId} />

        <div className="formGrid">
          <label className="field fieldFull">
            <span>Select image</span>
            <input name="file" type="file" accept="image/*" required />
          </label>
        </div>

        <div className="heroActions">
          <button className="primaryButton" type="submit" disabled={pending}>
            {pending ? "Uploading..." : "Upload asset"}
          </button>
        </div>

        {state?.error ? <p style={{ color: "#fda4af" }}>{state.error}</p> : null}
        {state?.message ? <p style={{ color: "#86efac" }}>{state.message}</p> : null}
      </form>

      <div className="assetGrid" style={{ marginTop: 20 }}>
        {assets.length === 0 ? (
          <p className="mutedText">No assets uploaded yet.</p>
        ) : (
          assets.map((asset) => (
            <article className="assetCard" key={asset.id}>
              <div className="assetPreviewWrap">
                <img className="assetPreview" src={asset.file_url} alt={asset.name} />
              </div>

              <div className="assetMeta">
                <strong title={asset.name}>{asset.name}</strong>
                <p className="mutedText">
                  {asset.created_at
                    ? new Date(asset.created_at).toLocaleString()
                    : asset.type}
                </p>
              </div>

              <div className="heroActions">
                <a
                  className="secondaryButton"
                  href={asset.file_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>

                {onUseAsset ? (
                  <button
                    className="primaryButton"
                    type="button"
                    onClick={() => onUseAsset(asset.file_url)}
                  >
                    Use in design
                  </button>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}