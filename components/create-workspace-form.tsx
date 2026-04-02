"use client";

import { useActionState } from "react";
import { createWorkspaceAction } from "../app/actions/workspaces";

const initialState = {
  ok: false,
  error: ""
};

export function CreateWorkspaceForm() {
  const [state, action, pending] = useActionState(createWorkspaceAction, initialState);

  return (
    <form action={action} className="panelCard">
      <div className="badge">New workspace</div>
      <h3>Create workspace</h3>

      <div className="formGrid">
        <label className="field">
          <span>Name</span>
          <input name="name" placeholder="Acme Marketing" required />
        </label>

        <label className="field">
          <span>Description</span>
          <input name="description" placeholder="Optional description" />
        </label>
      </div>

      <div className="heroActions">
        <button className="primaryButton" type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create workspace"}
        </button>
      </div>

      {state?.error ? <p style={{ color: "#fda4af" }}>{state.error}</p> : null}
    </form>
  );
}