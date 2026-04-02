"use client";

import { useEffect, useMemo, useState } from "react";
import { addCommentToDesign, isUuid, listCommentsByDesignId, resolveComment } from "../lib/studio-client";

interface ReviewPanelProps {
  designId: string;
}

interface ReviewComment {
  id: string;
  author_name?: string | null;
  author?: string;
  body: string;
  is_resolved?: boolean;
  created_at?: string;
  createdAt?: string;
}

function storageKey(designId: string) {
  return `clientcanvas-review-${designId}`;
}

export function ReviewPanel({ designId }: ReviewPanelProps) {
  const useRemote = isUuid(designId);

  const initialComments = useMemo<ReviewComment[]>(() => {
    if (typeof window === "undefined" || useRemote) return [];
    try {
      const raw = window.localStorage.getItem(storageKey(designId));
      return raw ? (JSON.parse(raw) as ReviewComment[]) : [];
    } catch {
      return [];
    }
  }, [designId, useRemote]);

  const [comments, setComments] = useState<ReviewComment[]>(initialComments);
  const [author, setAuthor] = useState("Reviewer");
  const [body, setBody] = useState("");
  const [decision, setDecision] = useState("in_review");
  const [loading, setLoading] = useState(useRemote);
  const [error, setError] = useState("");
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    if (!useRemote) return;

    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const rows = await listCommentsByDesignId(designId);
        if (active) {
          setComments(rows as ReviewComment[]);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load comments.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [designId, useRemote]);

  function persistLocal(nextComments: ReviewComment[]) {
    setComments(nextComments);
    window.localStorage.setItem(storageKey(designId), JSON.stringify(nextComments));
  }

  async function addComment() {
    if (!body.trim()) return;

    if (!useRemote) {
      const next: ReviewComment[] = [
        {
          id: `comment-${Date.now()}`,
          author: author.trim() || "Reviewer",
          body: body.trim(),
          is_resolved: false,
          createdAt: new Date().toISOString()
        },
        ...comments
      ];

      persistLocal(next);
      setBody("");
      return;
    }

    try {
      setError("");
      const row = await addCommentToDesign(designId, {
        author_name: author.trim() || "Reviewer",
        body: body.trim()
      });

      setComments((current) => [row as ReviewComment, ...current]);
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment.");
    }
  }

  async function handleToggleResolve(commentId: string, currentStatus: boolean) {
     const nextStatus = !currentStatus;
     
     if (!useRemote) {
       const next = comments.map(c => c.id === commentId ? { ...c, is_resolved: nextStatus } : c);
       persistLocal(next);
       return;
     }

     try {
       const updated = await resolveComment(commentId, nextStatus);
       setComments(current => current.map(c => c.id === commentId ? { ...c, is_resolved: nextStatus } : c));
     } catch (err) {
       setError("Failed to update comment status");
     }
  }

  const filteredComments = comments.filter(c => showResolved || !c.is_resolved);

  return (
    <section className="panelCard">
      <div className="badge">Review</div>
      <h3>Comments and approval</h3>

      <div className="formGrid">
        <label className="field">
          <span>Reviewer</span>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </label>

        <label className="field">
          <span>Decision</span>
          <select value={decision} onChange={(e) => setDecision(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="in_review">In review</option>
            <option value="needs_changes">Needs changes</option>
            <option value="approved">Approved</option>
          </select>
        </label>

        <label className="field fieldFull">
          <span>Comment</span>
          <textarea
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Leave review feedback..."
          />
        </label>
      </div>

      <div className="heroActions">
        <button className="primaryButton" type="button" onClick={addComment}>
          Add comment
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "24px", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Feedback</span>
        <button 
          onClick={() => setShowResolved(!showResolved)}
          style={{ fontSize: "11px", fontWeight: "600", color: "var(--primary)", background: "transparent", border: "none", cursor: "pointer" }}
        >
          {showResolved ? "Hide Resolved" : "Show Resolved"}
        </button>
      </div>

      {loading ? <p className="mutedText">Loading comments...</p> : null}
      {error ? <p style={{ color: "#fda4af" }}>{error}</p> : null}

      <div className="stack" style={{ marginTop: 10 }}>
        {filteredComments.length === 0 ? (
          <p className="mutedText" style={{ textAlign: "center", padding: "20px 0" }}>No {showResolved ? "" : "pending"} comments.</p>
        ) : (
          filteredComments.map((comment) => (
            <article key={comment.id} className="miniCard" style={{ opacity: comment.is_resolved ? 0.6 : 1, position: "relative" }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <strong>{comment.author_name || comment.author || "Reviewer"}</strong>
                    <p className="mutedText" style={{ fontSize: "11px", margin: "2px 0 8px 0" }}>
                      {new Date(comment.created_at || comment.createdAt || Date.now()).toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleToggleResolve(comment.id, !!comment.is_resolved)}
                    style={{ 
                      padding: "4px 8px", 
                      fontSize: "10px", 
                      borderRadius: "4px", 
                      border: comment.is_resolved ? "1px solid var(--border)" : "1px solid var(--primary)",
                      background: comment.is_resolved ? "transparent" : "rgba(139, 61, 255, 0.1)",
                      color: comment.is_resolved ? "var(--muted)" : "var(--primary)",
                      cursor: "pointer",
                      fontWeight: "700"
                    }}
                  >
                    {comment.is_resolved ? "Unresolve" : "Resolve"}
                  </button>
               </div>
              <p style={{ margin: 0, fontSize: "13px", textDecoration: comment.is_resolved ? "line-through" : "none" }}>{comment.body}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}