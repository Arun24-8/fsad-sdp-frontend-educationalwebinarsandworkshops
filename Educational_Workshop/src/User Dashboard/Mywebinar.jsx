export default function Mywebinar({ registrations }) {
  return (
    <section className="section">
      <div className="section-header">
        <h3>My Webinar Registrations</h3>
        <span className="muted">
          {registrations.length} active registrations
        </span>
      </div>
      {registrations.length === 0 ? (
        <div className="empty-state">
          <h3>No registrations yet</h3>
          <p>Register for a webinar to see it listed here.</p>
        </div>
      ) : (
        <div className="registered-grid">
          {registrations.map((item) => (
            <article key={item.title} className="registered-card">
              <div className="registered-meta">
                <span className="registered-tag">{item.format || item.tag}</span>
                <span className="registered-status">Registered</span>
              </div>
              <h4>{item.title}</h4>
              <p className="muted">Speaker: {item.speaker}</p>
              <p className="muted">{item.date}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}