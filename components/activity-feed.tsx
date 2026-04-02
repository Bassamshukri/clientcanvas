"use client";

import { FileText, Share2, Rocket, Archive, Clock, Activity, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityItem {
  id: string;
  kind: "design" | "review_link" | "publish_job" | "archive";
  title: string;
  subtitle: string;
  createdAt: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

const kindMap: Record<ActivityItem["kind"], { icon: LucideIcon; color: string; label: string }> = {
  design: { icon: FileText, color: "var(--primary)", label: "Design" },
  review_link: { icon: Share2, color: "var(--warning)", label: "Review" },
  publish_job: { icon: Rocket, color: "var(--success)", label: "Publish" },
  archive: { icon: Archive, color: "var(--text-muted)", label: "Archive" }
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <section className="glass-card panelCard animate-reflow" style={{ animationDelay: "0.2s" }}>
      <div style={{ marginBottom: "24px" }}>
        <div className="badge">Telemetry</div>
        <h3 style={{ marginTop: "12px", fontSize: "20px", fontWeight: "700" }}>Workspace Activity Stream</h3>
        <p className="muted-text">Real-time surveillance of fleet operations and deployment status.</p>
      </div>

      <div className="stack" style={{ gap: "0" }}>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", opacity: 0.5 }}>
             <Activity size={32} style={{ marginBottom: 12 }} />
             <p className="muted-text">Zero activity detected in recent cycles.</p>
          </div>
        ) : (
          <div className="timeline-container">
            {items.map((item, idx) => {
              const { icon: Icon, color, label } = kindMap[item.kind] || kindMap.design;
              return (
                <article className="timeline-item" key={item.id}>
                  <div className="timeline-line" style={{ display: idx === items.length - 1 ? "none" : "block" }} />
                  <div className="timeline-node" style={{ background: color }}>
                    <Icon size={14} color="#000" strokeWidth={2.5} />
                  </div>
                  <div className="timeline-content">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                       <span style={{ fontSize: "14px", fontWeight: "700", color: "white" }}>{item.title}</span>
                       <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</span>
                    </div>
                    <p className="muted-text" style={{ margin: "4px 0", fontSize: "13px" }}>{item.subtitle}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.5, fontSize: "11px", fontWeight: "700" }}>
                       <Clock size={10} />
                       {new Date(item.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .timeline-container {
           padding-left: 12px;
        }
        .timeline-item {
           position: relative;
           padding-bottom: 24px;
           padding-left: 32px;
        }
        .timeline-line {
           position: absolute;
           left: 7px;
           top: 20px;
           bottom: 0;
           width: 1px;
           background: var(--border);
           opacity: 0.5;
        }
        .timeline-node {
           position: absolute;
           left: 0;
           top: 0;
           width: 16px;
           height: 16px;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           z-index: 1;
           box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .timeline-content {
           background: rgba(255,255,255,0.02);
           padding: 12px 16px;
           border-radius: 10px;
           border: 1px solid var(--border);
           transition: 0.2s;
        }
        .timeline-content:hover {
           border-color: var(--primary-glow);
           background: rgba(255,255,255,0.04);
        }
      `}</style>
    </section>
  );
}