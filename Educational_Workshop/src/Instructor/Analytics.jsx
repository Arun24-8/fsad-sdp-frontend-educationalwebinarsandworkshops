import '../styles/Analytics.css'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const LOGGED_IN_USER_KEY = 'eduwebinarLoggedInUser'
const SCHEDULED_EVENTS_KEY = 'scheduledEvents'
const REGISTRATIONS_KEY = 'eventRegistrations'
const DEFAULT_ANALYTICS_CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance']

const FALLBACK_EVENTS = [
  {
    id: 'analytics-1',
    title: 'Introduction to Machine Learning',
    category: 'Technology',
    capacity: 100,
  },
  {
    id: 'analytics-2',
    title: 'Digital Marketing Strategies 2026',
    category: 'Marketing',
    capacity: 150,
  },
  {
    id: 'analytics-3',
    title: 'UI/UX Design Principles',
    category: 'Design',
    capacity: 80,
  },
  {
    id: 'analytics-4',
    title: 'Python for Data Science',
    category: 'Technology',
    capacity: 120,
  },
  {
    id: 'analytics-5',
    title: 'Financial Planning Essentials',
    category: 'Finance',
    capacity: 100,
  },
]

const sidebarItems = [
  { label: 'Dashboard', path: '/instructor', icon: DashboardIcon },
  { label: 'Schedule Event', path: '/instructor/schedule', icon: ScheduleIcon },
  { label: 'Manage Events', path: '/instructor/manage-events', icon: CalendarIcon },
  { label: 'Registrations', path: '/instructor/registrations', icon: UsersIcon },
  { label: 'Resources', path: '/instructor/resources', icon: UploadIcon },
  { label: 'Analytics', path: '/instructor/analytics', icon: ChartIcon },
]

function Analytics() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loggedInUsername, setLoggedInUsername] = useState('User')
  const [events, setEvents] = useState(FALLBACK_EVENTS)
  const [registrations, setRegistrations] = useState([])

  useEffect(() => {
    const savedUser = localStorage.getItem(LOGGED_IN_USER_KEY)

    if (!savedUser) {
      setLoggedInUsername('User')
      return
    }

    try {
      const parsedUser = JSON.parse(savedUser)
      const username = parsedUser?.username || 'User'
      setLoggedInUsername(username)
    } catch {
      setLoggedInUsername('User')
    }
  }, [])

  useEffect(() => {
    try {
      const storedEvents = JSON.parse(localStorage.getItem(SCHEDULED_EVENTS_KEY) || '[]')
      setEvents(storedEvents.length > 0 ? storedEvents : FALLBACK_EVENTS)
    } catch {
      setEvents(FALLBACK_EVENTS)
    }

    try {
      const storedRegistrations = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]')
      setRegistrations(storedRegistrations)
    } catch {
      setRegistrations([])
    }
  }, [])

  const avatarLetter = loggedInUsername.charAt(0).toUpperCase() || 'U'

  const handleLogout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY)
    navigate('/dashboard')
  }

  const registrationMap = useMemo(() => {
    return registrations.reduce((acc, item) => {
      const eventId = item.eventId || item.id
      const eventTitle = (item.eventTitle || item.title || '').trim().toLowerCase()

      if (eventId) {
        acc.byId[eventId] = (acc.byId[eventId] || 0) + 1
      }

      if (eventTitle) {
        acc.byTitle[eventTitle] = (acc.byTitle[eventTitle] || 0) + 1
      }

      if ((item.status || '').toLowerCase() === 'attended') {
        acc.attended += 1
      }

      acc.total += 1
      return acc
    }, { byId: {}, byTitle: {}, total: 0, attended: 0 })
  }, [registrations])

  const eventRows = useMemo(() => {
    return events.map((event, index) => {
      const eventId = event.id
      const title = event.title || `Event ${index + 1}`
      const titleKey = title.trim().toLowerCase()
      const registrationsCount = registrationMap.byId[eventId]
        || registrationMap.byTitle[titleKey]
        || 0

      const capacityValue = Number(event.capacity) > 0 ? Number(event.capacity) : 0
      const fillRate = capacityValue > 0
        ? Math.min(100, Math.round((registrationsCount / capacityValue) * 100))
        : 0

      return {
        id: eventId || `event-${index}`,
        title,
        category: event.category || 'General',
        registrationsCount,
        capacity: capacityValue,
        fillRate,
      }
    })
  }, [events, registrationMap])

  const totalEvents = eventRows.length
  const totalRegistrations = registrationMap.total
  const attendanceRate = totalRegistrations > 0
    ? Math.round((registrationMap.attended / totalRegistrations) * 100)
    : 0
  const avgRegistrationsPerEvent = totalEvents > 0
    ? Math.round(totalRegistrations / totalEvents)
    : 0

  const categoryStats = useMemo(() => {
    const categoryMap = eventRows.reduce((acc, event) => {
      const category = event.category || 'General'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})

    const defaultCategories = DEFAULT_ANALYTICS_CATEGORIES.map((name) => ({
      name,
      count: categoryMap[name] || 0,
    }))

    const extraCategories = Object.entries(categoryMap)
      .filter(([name]) => !DEFAULT_ANALYTICS_CATEGORIES.includes(name))
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return [...defaultCategories, ...extraCategories]
  }, [eventRows])

  const mostPopularEvents = useMemo(() => {
    return [...eventRows]
      .sort((a, b) => {
        if (b.registrationsCount !== a.registrationsCount) {
          return b.registrationsCount - a.registrationsCount
        }

        return b.capacity - a.capacity
      })
      .slice(0, 5)
  }, [eventRows])

  const stats = [
    {
      key: 'total-events',
      value: totalEvents,
      label: 'Total Events',
      className: 'events',
      icon: BarsIcon,
    },
    {
      key: 'total-registrations',
      value: totalRegistrations,
      label: 'Total Registrations',
      className: 'registrations',
      icon: PeopleCardIcon,
    },
    {
      key: 'attendance-rate',
      value: `${attendanceRate}%`,
      label: 'Attendance Rate',
      className: 'attendance',
      icon: BadgeIcon,
    },
    {
      key: 'avg-registration',
      value: avgRegistrationsPerEvent,
      label: 'Avg. Registrations/Event',
      className: 'average',
      icon: EyeIcon,
    },
  ]

  return (
    <div className="analytics-page">
      <aside className="analytics-sidebar">
        <div className="analytics-brand">
          <div className="brand-mark">
            <BrandVideoIcon />
          </div>
          <div>
            <h1>EduWebinar</h1>
            <p>Instructor Portal</p>
          </div>
        </div>

        <nav className="analytics-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = item.path ? location.pathname === item.path : false

            return (
              <button
                key={item.label}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path)
                  }
                }}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <section className="sidebar-profile-card" aria-label="Profile">
          <div className="profile-top-row">
            <div className="profile-avatar" aria-hidden="true">{avatarLetter}</div>
            <div className="profile-text">
              <p className="profile-name">{loggedInUsername}</p>
            </div>
          </div>

          <div className="profile-divider" />

          <button
            type="button"
            className="profile-action logout"
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </section>
      </aside>

      <main className="analytics-main">
        <header className="analytics-header">
          <h2>
            Analytics <span aria-hidden="true">📊</span>
          </h2>
          <p>Track your performance and gain insights into your webinars</p>
        </header>

        <section className="analytics-stats-grid" aria-label="Analytics metrics">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <article key={stat.key} className={`analytics-stat-card ${stat.className}`}>
                <div className="analytics-stat-head">
                  <div className="analytics-icon-wrap">
                    <Icon />
                  </div>
                  <TrendArrowIcon />
                </div>
                <p className="analytics-stat-value">{stat.value}</p>
                <p className="analytics-stat-label">{stat.label}</p>
              </article>
            )
          })}
        </section>

        <section className="analytics-panel" aria-label="Events by category">
          <h3>Events by Category</h3>
          <div className="category-grid">
            {categoryStats.map((item) => (
              <article key={item.name} className="category-card">
                <p className="category-count">{item.count}</p>
                <p className="category-name">{item.name}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="analytics-panel" aria-label="Most popular events">
          <h3>Most Popular Events</h3>
          <div className="popular-list">
            {mostPopularEvents.map((event, index) => (
              <article key={event.id} className="popular-item">
                <div className="popular-rank">{index + 1}</div>
                <div className="popular-text">
                  <p>{event.title}</p>
                  <span>
                    {event.registrationsCount}/{event.capacity || 0} registrations • {event.fillRate}% full
                  </span>
                </div>
                <div className="popular-progress-track">
                  <div className="popular-progress-fill" style={{ width: `${event.fillRate}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="analytics-panel" aria-label="All events performance">
          <h3>All Events Performance</h3>
          <div className="analytics-table-wrap">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Registrations</th>
                  <th>Capacity</th>
                  <th>Fill Rate</th>
                </tr>
              </thead>
              <tbody>
                {eventRows.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>
                      <span className="category-pill">{event.category}</span>
                    </td>
                    <td>{event.registrationsCount}</td>
                    <td>{event.capacity}</td>
                    <td>{event.fillRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

function BrandVideoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="6" width="13" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 10.2L21 7.5V16.5L16 13.8V10.2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function ScheduleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 8V14M8 11H14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3.8V7.2M16 3.8V7.2M4 10.5H20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="9" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 18.2C4.6 15.7 6.5 14.4 9 14.4C11.5 14.4 13.4 15.7 14 18.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="10" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4V14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.8 7.4L12 4.2L15.2 7.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 13.5V18.5H18V13.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 18.5H20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.4 15.2L10.2 11.4L13.1 14.3L18 9.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 4.8H5.9C5.2 4.8 4.6 5.4 4.6 6.1V17.9C4.6 18.6 5.2 19.2 5.9 19.2H10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.5 8.2L19 12L13.5 15.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.3 12H18.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function BarsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 18.5V8M12 18.5V4.7M18 18.5V11.3" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M4 18.5H20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function PeopleCardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.4 17.8C5.1 15.7 6.7 14.6 9 14.6C11.3 14.6 12.9 15.7 13.6 17.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.8L18.2 6V11.6C18.2 15.3 15.9 18.7 12 20.2C8.1 18.7 5.8 15.3 5.8 11.6V6L12 3.8Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.4 12.1L11.2 13.9L14.8 10.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.8 12C4.9 8.4 8 6.4 12 6.4C16 6.4 19.1 8.4 21.2 12C19.1 15.6 16 17.6 12 17.6C8 17.6 4.9 15.6 2.8 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function TrendArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="trend-icon">
      <path d="M5 15.8L10 10.8L13.4 14.2L19 8.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.8 8.6H19V12.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default Analytics
