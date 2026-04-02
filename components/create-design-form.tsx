"use client";

import { useActionState } from "react";
import { createDesignAction } from "../app/actions/designs";

interface CreateDesignFormProps {
  workspaceId: string;
}

const initialState = {
  ok: false,
  error: ""
};

export function CreateDesignForm({ workspaceId }: CreateDesignFormProps) {
  const [state, action, pending] = useActionState(createDesignAction, initialState);

  return (
    <form action={action} className="panelCard">
      <input type="hidden" name="workspaceId" value={workspaceId} />

      <div className="badge">New design</div>
      <h3>Create design</h3>

      <div className="formGrid">
        <label className="field">
          <span>Title</span>
          <input name="title" placeholder="Spring launch post" />
        </label>

        <label className="field">
          <span>Width</span>
          <input name="width" type="number" defaultValue="1080" min="100" />
        </label>

        <label className="field">
          <span>Height</span>
          <input name="height" type="number" defaultValue="1080" min="100" />
        </label>
      </div>

      <div className="heroActions">
        <button className="primaryButton" type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create design"}
        </button>
      </div>

      {state?.error ? <p style={{ color: "#fda4af" }}>{state.error}</p> : null}
    </form>
  );
}