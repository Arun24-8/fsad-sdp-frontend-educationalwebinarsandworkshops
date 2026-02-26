import { useEffect, useState } from "react";
import Browseevents from "./Browseevents";
import Mywebinar from "./Mywebinar";
import "./UserDashboard.css";

const SCHEDULED_EVENTS_KEY = "scheduledEvents";
const INSTRUCTOR_RESOURCES_KEY = "instructorResources";
const REGISTRATIONS_KEY = "eventRegistrations";

const statIcons = {
  registrations: (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M6 7h12M6 12h12M6 17h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  upcoming: (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M8 7V3M16 7V3M4 11h16M5 7h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  resources: (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 12h6M9 16h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  live: (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
};

const DEFAULT_WEBINARS = [
  {
    id: "default-ml",
    tag: "Webinar",
    category: "Technology",
    title: "Introduction to Machine Learning",
    speaker: "Dr. Sarah Johnson",
    date: "Mar 5, 2026 at 14:00",
    registrations: 67,
    capacity: 100,
    buttonClass: "button button-outline",
  },
  {
    id: "default-marketing",
    tag: "Workshop",
    category: "Marketing",
    title: "Digital Marketing Strategies 2026",
    speaker: "Mark Stevens",
    date: "Feb 28, 2026 at 16:00",
    registrations: 142,
    capacity: 150,
    buttonClass: "button button-outline",
  },
  {
    id: "default-python",
    tag: "Workshop",
    category: "Technology",
    title: "Python for Data Science",
    speaker: "Dr. James Wilson",
    date: "Mar 10, 2026 at 10:00",
    registrations: 95,
    capacity: 120,
    buttonClass: "button button-outline",
  },
];

const DEFAULT_RESOURCES = [
  {
    id: "default-resource-1",
    title: "Design Principles Guide",
    from: "UI/UX Design Principles",
    url: "#",
  },
  {
    id: "default-resource-2",
    title: "Figma Template Files",
    from: "UI/UX Design Principles",
    url: "#",
  },
];

const navItems = ["Dashboard", "My Webinars", "Browse Events"];
const filters = ["All", "Webinars", "Workshops"];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function safeParseJson(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function toSafeId(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatCategory(value) {
  if (!value) {
    return "General";
  }

  const text = value.toString();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatDateTime(dateValue, timeValue) {
  if (!dateValue) {
    return "Date TBD";
  }

  if (!timeValue && typeof dateValue === "string" && dateValue.includes(" at ")) {
    return dateValue;
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const timeText = timeValue || "00:00";
  return `${month} ${day}, ${year} at ${timeText}`;
}

function normalizeResources(items) {
  return items.map((item) => ({
    id: item.id || toSafeId(item.resourceName || item.title || "resource"),
    title: item.resourceName || item.title || "Resource",
    from: item.eventTitle || item.from || "Event",
    url: item.resourceUrl || item.url || "#",
  }));
}

function normalizeEvents(items, registrations) {
  const counts = registrations.reduce((acc, item) => {
    const eventKey = item.eventId || item.eventTitle || "";
    if (!eventKey) {
      return acc;
    }

    acc[eventKey] = (acc[eventKey] || 0) + 1;
    return acc;
  }, {});

  return items.map((event) => {
    const eventId =
      event.id ||
      event.eventId ||
      toSafeId(`${event.title || "event"}-${event.date || ""}-${event.time || ""}`);
    const typeValue = (event.eventType || event.type || "webinar").toLowerCase();
    const tag = typeValue === "workshop" ? "Workshop" : "Webinar";
    const dateText = formatDateTime(event.date, event.time);

    const baseRegistrations = Number(event.registrations) || 0;
    const registrationCount = counts[eventId] || counts[event.title] || baseRegistrations;

    return {
      id: eventId,
      tag,
      category: formatCategory(event.category || "General"),
      title: event.title || "Untitled Event",
      speaker: event.instructorName || event.speaker || "Instructor",
      date: dateText,
      registrations: registrationCount,
      capacity: Number(event.capacity) || 100,
      buttonClass: "button button-outline",
    };
  });
}

function getStudentRegistrations(items, profileName, profileEmail) {
  const email = (profileEmail || "").toLowerCase();
  const name = (profileName || "").toLowerCase();

  return items
    .filter((item) => {
      const itemEmail = (item.email || "").toLowerCase();
      const itemName = (item.studentName || item.name || "").toLowerCase();
      if (email) {
        return itemEmail === email;
      }
      return itemName === name;
    })
    .map((item) => ({
      eventId: item.eventId,
      title: item.eventTitle || item.title || "Event",
      speaker: item.speaker || "Instructor",
      date: item.date || "Date TBD",
      format: item.eventType || item.type || "Webinar",
    }));
}

export default function UserDashboard({
  profileName,
  profileEmail,
  onLogout,
  onUpdateEmail,
}) {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [activeFilter, setActiveFilter] = useState("All");
  const [registrations, setRegistrations] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [events, setEvents] = useState(DEFAULT_WEBINARS);
  const [resources, setResources] = useState(DEFAULT_RESOURCES);
  const [showSettings, setShowSettings] = useState(false);
  const [editEmail, setEditEmail] = useState(profileEmail || "");

  useEffect(() => {
    setEditEmail(profileEmail || "");
  }, [profileEmail]);

  useEffect(() => {
    const savedRegistrations = safeParseJson(
      localStorage.getItem(REGISTRATIONS_KEY) || "[]",
      []
    );
    setAllRegistrations(savedRegistrations);
    setRegistrations(
      getStudentRegistrations(savedRegistrations, profileName, profileEmail)
    );

    const savedEvents = safeParseJson(
      localStorage.getItem(SCHEDULED_EVENTS_KEY) || "[]",
      []
    );
    if (savedEvents.length > 0) {
      setEvents(normalizeEvents(savedEvents, savedRegistrations));
    } else {
      setEvents(normalizeEvents(DEFAULT_WEBINARS, savedRegistrations));
    }

    const savedResources = safeParseJson(
      localStorage.getItem(INSTRUCTOR_RESOURCES_KEY) || "[]",
      []
    );
    if (savedResources.length > 0) {
      setResources(normalizeResources(savedResources));
    } else {
      setResources(DEFAULT_RESOURCES);
    }
  }, [profileEmail, profileName]);

  const handleRegister = (event) => {
    const studentName = profileName || "Student";
    const studentEmail = profileEmail || "";
    const eventId = event.id || event.eventId || toSafeId(event.title || "event");
    const eventType = event.tag || event.format || event.eventType || event.type || "Webinar";

    const alreadyRegistered = allRegistrations.some((item) => {
      const matchesEvent =
        (item.eventId && item.eventId === eventId) ||
        item.eventTitle === event.title;
      const matchesEmail = studentEmail && item.email === studentEmail;
      const matchesName = !studentEmail && (item.studentName || "") === studentName;
      return matchesEvent && (matchesEmail || matchesName);
    });

    if (alreadyRegistered) {
      return;
    }

    const newRegistration = {
      id: `${eventId}-${studentEmail || studentName}`,
      eventId,
      eventTitle: event.title || "Event",
      eventType,
      date: event.date || "Date TBD",
      speaker: event.speaker || event.instructorName || "Instructor",
      studentName,
      email: studentEmail,
      status: "registered",
      createdAt: new Date().toISOString(),
    };

    const updatedRegistrations = [newRegistration, ...allRegistrations];
    setAllRegistrations(updatedRegistrations);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updatedRegistrations));
    setRegistrations(
      getStudentRegistrations(updatedRegistrations, profileName, profileEmail)
    );

    setEvents((prev) =>
      prev.map((item) =>
        item.id === eventId
          ? { ...item, registrations: (item.registrations || 0) + 1 }
          : item
      )
    );
  };

  const stats = [
    {
      title: "My Registrations",
      value: registrations.length,
      badge: "Active",
      tone: "purple",
      icon: statIcons.registrations,
    },
    {
      title: "Upcoming Events",
      value: events.length,
      badge: "Available",
      tone: "blue",
      icon: statIcons.upcoming,
    },
    {
      title: "Resources",
      value: resources.length,
      badge: "Ready",
      tone: "green",
      icon: statIcons.resources,
    },
    {
      title: "Live Now",
      value: "0",
      badge: "",
      tone: "orange",
      icon: statIcons.live,
    },
  ];

  const filteredWebinars =
    activeFilter === "All"
      ? events
      : events.filter((item) => item.tag === activeFilter.slice(0, -1));

  return (
    <div className="user-dashboard">
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div>
            <div className="brand">
              <div className="brand-title">
                <span className="brand-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect
                      x="3"
                      y="6"
                      width="13"
                      height="12"
                      rx="3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M16 10.2L21 7.5V16.5L16 13.8V10.2Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h1>EduWebinar</h1>
              </div>
              <p>Student Portal</p>
            </div>
            <nav className="nav-menu">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setActiveNav(item);
                    setShowSettings(false);
                  }}
                  className={`nav-item ${activeNav === item ? "active" : ""}`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <div className="profile-card">
            <div className="profile-info">
              <div className="avatar">
                {profileName ? profileName.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="profile-details">
                <p className="profile-name">{profileName}</p>
              </div>
            </div>
            <div className="profile-actions">
              <button
                className="profile-action"
                type="button"
                onClick={() => setShowSettings(true)}
              >
                Settings <span>›</span>
              </button>
              <button
                className="profile-action logout"
                type="button"
                onClick={onLogout}
              >
                Logout <span>›</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="main-content">
          {showSettings ? (
            <section className="section">
              <div className="section-header">
                <h3>User Settings</h3>
              </div>
              <div className="resource-grid">
                <div className="resource-card">
                  <p className="muted">Name</p>
                  <h4>{profileName || "Student"}</h4>
                </div>
                <div className="resource-card">
                  <p className="muted">Email</p>
                  <h4>{profileEmail || "Not set"}</h4>
                </div>
              </div>
              <form
                className="auth-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (onUpdateEmail) {
                    onUpdateEmail(editEmail);
                  }
                }}
              >
                <label className="field">
                  <span>Update Email</span>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    required
                  />
                </label>
                <div className="portal-section">
                  <button className="primary" type="submit">
                    Save Email
                    <span className="arrow">→</span>
                  </button>
                  <button
                    className="change-btn"
                    type="button"
                    onClick={() => setShowSettings(false)}
                  >
                    Back
                  </button>
                </div>
              </form>
            </section>
          ) : activeNav === "My Webinars" ? (
            <Mywebinar registrations={registrations} />
          ) : activeNav === "Browse Events" ? (
            <Browseevents
              registrations={registrations}
              onRegister={handleRegister}
              events={events}
            />
          ) : (
            <>
              <header className="main-header">
            <p className="eyebrow">Student Webinar Dashboard</p>
            <h2>Welcome back, {profileName || "Student"}! 👋</h2>
            <p className="subtitle">
              Here's what's happening with your learning journey today.
            </p>
          </header>

          <section className="stats-grid">
            {stats.map((item) => (
              <div key={item.title} className="stat-card">
                <div className="stat-header">
                <div className={`stat-icon ${item.tone}`}>{item.icon}</div>
                  {item.badge ? (
                    <span className={`badge ${item.tone}`}>{item.badge}</span>
                  ) : null}
                </div>
                <p className="stat-title">{item.title}</p>
                <p className="stat-value">{item.value}</p>
              </div>
            ))}
          </section>

          <section className="section">
            <div className="section-header">
              <h3>Upcoming Webinars & Workshops</h3>
              <div className="filters">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`filter-button ${
                      activeFilter === filter ? "active" : ""
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="webinar-grid">
              {filteredWebinars.map((item) => {
                const progress = Math.round(
                  (item.registrations / item.capacity) * 100
                );
                const isRegistered = registrations.some(
                  (registered) =>
                    registered.eventId === item.id ||
                    registered.title === item.title
                );
                return (
                  <article key={item.title} className="webinar-card">
                    <div className="webinar-header">
                      <div className="webinar-tags">
                        <span>{item.tag}</span>
                        <span>{item.category}</span>
                      </div>
                      <h4>{item.title}</h4>
                    </div>
                    <div className="webinar-body">
                      <p>
                        Speaker: <strong>{item.speaker}</strong>
                      </p>
                      <p className="muted">{item.date}</p>
                      <div className="progress">
                        <div className="progress-labels">
                          <span>
                            {item.registrations}/{item.capacity} registered
                          </span>
                          <span>{progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                      <button
                        className={
                          isRegistered
                            ? "button button-registered"
                            : item.buttonClass
                        }
                        type="button"
                        disabled={isRegistered}
                        onClick={() => {
                          if (!isRegistered) {
                            handleRegister(item);
                          }
                        }}
                      >
                        {isRegistered ? "Registered" : "Register"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="section registrations-section">
            <div className="section-header">
              <h3>My Registrations</h3>
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
                      <span className="registered-tag">
                        {item.format || item.tag}
                      </span>
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

          <section className="section">
            <h3>Post-Event Resources</h3>
            <div className="resource-grid">
              {resources.map((item) => (
                <div key={item.id || item.title} className="resource-card">
                  <p className="muted">From: {item.from}</p>
                  <h4>{item.title}</h4>
                  <a
                    className="resource-link"
                    href={item.url || "#"}
                    target={item.url && item.url !== "#" ? "_blank" : undefined}
                    rel={item.url && item.url !== "#" ? "noreferrer" : undefined}
                  >
                    Access Resource
                    <span>↗</span>
                  </a>
                </div>
              ))}
            </div>
          </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}