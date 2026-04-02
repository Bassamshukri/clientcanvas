"use client";

import { useActionState, useMemo, useState } from "react";
import { schedulePublishAction } from "../app/actions/publishing";
import { cancelPublishJobAction } from "../app/actions/publish-jobs-admin";

interface PublishManagerProps {
  designId: string;
  jobs: Array<{
    id: string;
    channel: string;
    caption: string;
    scheduled_for: string;
    status: string;
    external_id?: string | null;
    error_message?: string | null;
    created_at?: string;
  }>;
}

const initialState = {
  ok: false,
  error: "",
  message: ""
};

function getDefaultDateTimeLocal() {
  const date = new Date(Date.now() + 30 * 60 * 1000);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function PublishManager({ designId, jobs }: PublishManagerProps) {
  const [channel, setChannel] = useState("linkedin");
  const [caption, setCaption] = useState("");
  const [scheduledFor, setScheduledFor] = useState(getDefaultDateTimeLocal());
  const [scheduleState, scheduleAction, schedulePending] = useActionState(
    schedulePublishAction,
    initialState
  );
  const [cancelState, cancelAction, cancelPending] = useActionState(
    cancelPublishJobAction,
    initialState
  );

  const orderedJobs = useMemo(
    () =>
      [...jobs].sort((a, b) =>
        String(b.scheduled_for || "").localeCompare(String(a.scheduled_for || ""))
      ),
    [jobs]
  );

  return (
    <section className="panelCard">
      <div className="badge">Publishing</div>
      <h3>Schedule social publishing</h3>
      <p className="mutedText">
        Queue this design for LinkedIn, Facebook, or Instagram.
      </p>

      <form action={scheduleAction}>
        <input type="hidden" name="designId" value={designId} />

        <div className="formGrid">
          <label className="field">
            <span>Channel</span>
            <select name="channel" value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
            </select>
          </label>

          <label className="field">
            <span>Scheduled for</span>
            <input
              name="scheduledFor"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
          </label>

          <label className="field fieldFull">
            <span>Caption</span>
            <textarea
              name="caption"
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write the post caption..."
            />
          </label>
        </div>

        <div className="heroActions">
          <button className="primaryButton" type="submit" disabled={schedulePending}>
            {schedulePending ? "Scheduling..." : "Schedule publish"}
          </button>
        </div>

        {scheduleState?.error ? <p style={{ color: "#fda4af" }}>{scheduleState.error}</p> : null}
        {scheduleState?.message ? <p style={{ color: "#86efac" }}>{scheduleState.message}</p> : null}
      </form>

      <div className="stack" style={{ marginTop: 20 }}>
        {orderedJobs.length === 0 ? (
          <p className="mutedText">No publish jobs yet.</p>
        ) : (
          orderedJobs.map((job) => (
            <article className="miniCard" key={job.id}>
              <strong>{job.channel}</strong>
              <p className="mutedText">
                {job.status} · {new Date(job.scheduled_for).toLocaleString()}
              </p>
              {job.caption ? <p>{job.caption}</p> : null}
              {job.external_id ? (
                <p className="mutedText">External ID: {job.external_id}</p>
              ) : null}
              {job.error_message ? (
                <p style={{ color: "#fda4af" }}>{job.error_message}</p>
              ) : null}

              {(job.status === "scheduled" || job.status === "processing") ? (
                <div className="heroActions">
                  <form action={cancelAction}>
                    <input type="hidden" name="publishJobId" value={job.id} />
                    <button className="secondaryButton" type="submit" disabled={cancelPending}>
                      Cancel job
                    </button>
                  </form>
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>

      {cancelState?.error ? <p style={{ color: "#fda4af" }}>{cancelState.error}</p> : null}
      {cancelState?.message ? <p style={{ color: "#86efac" }}>{cancelState.message}</p> : null}
    </section>
  );
}