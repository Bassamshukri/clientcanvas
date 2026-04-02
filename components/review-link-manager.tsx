"use client";

import { useActionState, useMemo, useState } from "react";
import { createReviewLinkAction } from "../app/actions/review-links";
import { revokeReviewLinkAction } from "../app/actions/review-links-admin";

interface ReviewLinkRecord {
  id: string;
  token: string;
  status: string;
  expires_at?: string | null;
  created_at?: string;
}

interface ReviewLinkManagerProps {
  designId: string;
  reviewLinks: ReviewLinkRecord[];
}

const initialState = {
  ok: false,
  error: "",
  message: ""
};

export function ReviewLinkManager({
  designId,
  reviewLinks
}: ReviewLinkManagerProps) {
  const [days, setDays] = useState("7");
  const [createState, createAction, createPending] = useActionState(
    createReviewLinkAction,
    initialState
  );

  const [revokeState, revokeAction, revokePending] = useActionState(
    revokeReviewLinkAction,
    initialState
  );

  const baseUrl = useMemo(
    () =>
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000",
    []
  );

  async function copyLink(token: string) {
    const url = `${baseUrl}/review/${token}`;
    await navigator.clipboard.writeText(url);
    window.alert("Copied review link.");
  }

  return (
    <section className="panelCard">
      <div className="badge">Review links</div>
      <h3>Share with clients</h3>
      <p className="mutedText">
        Create a public review link so clients can comment and approve without logging in.
      </p>

      <form action={createAction}>
        <input type="hidden" name="designId" value={designId} />

        <div className="formGrid">
          <label className="field">
            <span>Expires in days</span>
            <input
              name="expiresInDays"
              type="number"
              min="1"
              max="90"
              value={days}
              onChange={(event) => setDays(event.target.value)}
            />
          </label>
        </div>

        <div className="heroActions">
          <button className="primaryButton" type="submit" disabled={createPending}>
            {createPending ? "Creating..." : "Create review link"}
          </button>
        </div>

        {createState?.error ? <p style={{ color: "#fda4af" }}>{createState.error}</p> : null}
        {createState?.message ? <p style={{ color: "#86efac" }}>{createState.message}</p> : null}
      </form>

      <div className="stack" style={{ marginTop: 20 }}>
        {reviewLinks.length === 0 ? (
          <p className="mutedText">No review links yet.</p>
        ) : (
          reviewLinks.map((link) => {
            const url = `${baseUrl}/review/${link.token}`;

            return (
              <article className="miniCard" key={link.id}>
                <strong>{url}</strong>
                <p className="mutedText">
                  {link.status}
                  {link.expires_at
                    ? ` · expires ${new Date(link.expires_at).toLocaleString()}`
                    : ""}
                </p>
                <div className="heroActions">
                  <button
                    className="secondaryButton"
                    type="button"
                    onClick={() => copyLink(link.token)}
                  >
                    Copy link
                  </button>
                  <a
                    className="secondaryButton"
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>

                  {link.status === "active" ? (
                    <form action={revokeAction}>
                      <input type="hidden" name="reviewLinkId" value={link.id} />
                      <button className="secondaryButton" type="submit" disabled={revokePending}>
                        Revoke
                      </button>
                    </form>
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </div>

      {revokeState?.error ? <p style={{ color: "#fda4af" }}>{revokeState.error}</p> : null}
      {revokeState?.message ? <p style={{ color: "#86efac" }}>{revokeState.message}</p> : null}
    </section>
  );
}