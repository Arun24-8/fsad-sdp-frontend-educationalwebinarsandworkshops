import { useMemo, useState } from "react";

export default function Browseevents({ registrations, onRegister, events = [] }) {
  const [query, setQuery] = useState("");

  const filteredEvents = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return events;
    }

    return events.filter((item) => {
      const haystack = [
        item.title,
        item.category,
        item.format,
        item.speaker,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query]);

  return (
    <section className="section">
      <div className="section-header browse-header">
        <div>
          <h3>Browse Events</h3>
          <span className="muted">Explore upcoming opportunities</span>
        </div>
        <div className="search-field">
          <input
            type="search"
            placeholder="Search events, speakers, topics..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span className="muted">{filteredEvents.length} results</span>
        </div>
      </div>
      <div className="registered-grid">
        {filteredEvents.map((item) => {
          const isRegistered = registrations.some(
            (registered) =>
              registered.eventId === item.id || registered.title === item.title
          );
          return (
            <article key={item.title} className="registered-card">
              <div className="registered-meta">
                <span className="registered-tag">{item.format}</span>
                <span className="registered-status">{item.category}</span>
              </div>
              <h4>{item.title}</h4>
              <p className="muted">Speaker: {item.speaker}</p>
              <p className="muted">{item.date}</p>
              <button
                className={`button ${
                  isRegistered ? "button-registered" : "button-outline"
                }`}
                type="button"
                disabled={isRegistered}
                onClick={() => {
                  if (!isRegistered) {
                    onRegister(item);
                  }
                }}
              >
                {isRegistered ? "Registered" : "Register"}
              </button>
            </article>
          );
        })}
      </div>
      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <h3>No events found</h3>
          <p>Try a different keyword to find upcoming sessions.</p>
        </div>
      ) : null}
    </section>
  );
}