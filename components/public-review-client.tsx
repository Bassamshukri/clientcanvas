"use client";

import { useState } from "react";

interface PublicReviewClientProps {
  token: string;
  design: {
    id: string;
    title: string;
    status: string;
  };
  comments: Array<{
    id: string;
    author_name?: string | null;
    body: string;
    created_at?: string;
  }>;
  decisions: Array<{
    id: string;
    decision: string;
    reviewer_name?: string | null;
    notes?: string | null;
    created_at?: string;
  }>;
}

export function PublicReviewClient({
  token,
  design,
  comments: initialComments,
  decisions: initialDecisions
}: PublicReviewClientProps) {
  const [comments, setComments] = useState(initialComments);
  const [decisions, setDecisions] = useState(initialDecisions);
  const [reviewerName, setReviewerName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [decisionNotes, setDecisionNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submitComment() {
    if (!commentBody.trim()) return;

    try {
      setBusy(true);
      setError("");
      setMessage("");

      const response = await fetch(`/api/public/review/${token}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          authorName: reviewerName,
          body: commentBody
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add comment.");
      }

      setComments((current) => [result.comment, ...current]);
      setCommentBody("");
      setMessage("Comment added.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment.");
    } finally {
      setBusy(false);
    }
  }

  async function submitDecision(decision: "approved" | "needs_changes") {
    try {
      setBusy(true);
      setError("");
      setMessage("");

      const response = await fetch(`/api/public/review/${token}/decision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reviewerName,
          decision,
          notes: decisionNotes
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit decision.");
      }

      setDecisions((current) => [result.decisionRecord, ...current]);
      setDecisionNotes("");
      setMessage(`Decision submitted: ${decision.replace("_", " ")}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit decision.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <section className="panelCard">
        <div className="badge">Public review</div>
        <h1>{design.title}</h1>
        <p className="mutedText">
          Status: {design.status}
        </p>
      </section>

      <div className="editorLayout" style={{ marginTop: 20 }}>
        <div className="editorMain">
          <section className="panelCard">
            <div className="badge">Feedback</div>
            <h3>Leave a comment</h3>

            <div className="formGrid">
              <label className="field">
                <span>Your name</span>
                <input
                  value={reviewerName}
                  onChange={(event) => setReviewerName(event.target.value)}
                  placeholder="Client name"
                />
              </label>

              <label className="field fieldFull">
                <span>Comment</span>
                <textarea
                  rows={5}
                  value={commentBody}
                  onChange={(event) => setCommentBody(event.target.value)}
                  placeholder="Looks good, but please update the headline..."
                />
              </label>
            </div>

            <div className="heroActions">
              <button
                className="primaryButton"
                type="button"
                onClick={submitComment}
                disabled={busy}
              >
                Add comment
              </button>
            </div>
          </section>

          <section className="panelCard">
            <div className="badge">Decision</div>
            <h3>Approve or request changes</h3>

            <label className="field">
              <span>Decision notes</span>
              <textarea
                rows={4}
                value={decisionNotes}
                onChange={(event) => setDecisionNotes(event.target.value)}
                placeholder="Optional notes for the team..."
              />
            </label>

            <div className="heroActions">
              <button
                className="primaryButton"
                type="button"
                disabled={busy}
                onClick={() => submitDecision("approved")}
              >
                Approve
              </button>

              <button
                className="secondaryButton"
                type="button"
                disabled={busy}
                onClick={() => submitDecision("needs_changes")}
              >
                Needs changes
              </button>
            </div>

            {error ? <p style={{ color: "#fda4af" }}>{error}</p> : null}
            {message ? <p style={{ color: "#86efac" }}>{message}</p> : null}
          </section>
        </div>

        <div className="editorSidebar">
          <section className="panelCard">
            <div className="badge">Comments</div>
            <h3>Review comments</h3>

            <div className="stack">
              {comments.length === 0 ? (
                <p className="mutedText">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <article className="miniCard" key={comment.id}>
                    <strong>{comment.author_name || "Reviewer"}</strong>
                    <p className="mutedText">
                      {comment.created_at
                        ? new Date(comment.created_at).toLocaleString()
                        : ""}
                    </p>
                    <p>{comment.body}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="panelCard">
            <div className="badge">Decisions</div>
            <h3>Approval history</h3>

            <div className="stack">
              {decisions.length === 0 ? (
                <p className="mutedText">No decisions yet.</p>
              ) : (
                decisions.map((decision) => (
                  <article className="miniCard" key={decision.id}>
                    <strong>{decision.decision.replace("_", " ")}</strong>
                    <p className="mutedText">
                      {decision.reviewer_name || "Reviewer"}
                      {decision.created_at
                        ? ` · ${new Date(decision.created_at).toLocaleString()}`
                        : ""}
                    </p>
                    {decision.notes ? <p>{decision.notes}</p> : null}
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}