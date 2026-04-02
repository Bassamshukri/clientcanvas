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

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <section className="panelCard">
      <div className="badge">Activity</div>
      <h3>Recent workspace activity</h3>

      <div className="stack" style={{ marginTop: 16 }}>
        {items.length === 0 ? (
          <p className="mutedText">No activity yet.</p>
        ) : (
          items.map((item) => (
            <article className="miniCard" key={item.id}>
              <strong>{item.title}</strong>
              <p className="mutedText">{item.subtitle}</p>
              <p className="mutedText">{new Date(item.createdAt).toLocaleString()}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}