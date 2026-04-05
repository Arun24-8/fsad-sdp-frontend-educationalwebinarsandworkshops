import '../styles/Registrations.css'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const LOGGED_IN_USER_KEY = 'eduwebinarLoggedInUser'
const REGISTRATIONS_KEY = 'eventRegistrations'

const sidebarItems = [
  { label: 'Dashboard', path: '/instructor', icon: DashboardIcon },
  { label: 'Schedule Event', path: '/instructor/schedule', icon: ScheduleIcon },
  { label: 'Manage Events', path: '/instructor/manage-events', icon: CalendarIcon },
  { label: 'Registrations', path: '/instructor/registrations', icon: UsersIcon },
  { label: 'Resources', path: '/instructor/resources', icon: UploadIcon },
  { label: 'Analytics', path: '/instructor/analytics', icon: ChartIcon },
]

function Registrations() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loggedInUsername, setLoggedInUsername] = useState('User')
  const [registrations, setRegistrations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')

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
      const savedRegistrations = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]')
      setRegistrations(savedRegistrations)
    } catch {
      setRegistrations([])
    }
  }, [])

  const avatarLetter = loggedInUsername.charAt(0).toUpperCase() || 'U'

  const handleLogout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY)
    navigate('/dashboard')
  }

  const eventOptions = useMemo(() => {
    const names = registrations
      .map((item) => item.eventTitle || item.title || '')
      .filter((name) => name.trim() !== '')

    return Array.from(new Set(names))
  }, [registrations])

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      const name = item.studentName || item.name || 'Student'
      const email = item.email || ''
      const eventTitle = item.eventTitle || item.title || ''
      const eventType = item.eventType || item.type || 'Webinar'
      const status = (item.status || 'registered').toLowerCase()
      const searchValue = `${name} ${email} ${eventTitle} ${eventType}`.toLowerCase()
      const matchesSearch = searchValue.includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const matchesEvent = eventFilter === 'all' || eventTitle === eventFilter

      return matchesSearch && matchesStatus && matchesEvent
    })
  }, [eventFilter, registrations, searchTerm, statusFilter])

  const stats = useMemo(() => {
    const totalRegistrations = filteredRegistrations.length
    const attendedCount = filteredRegistrations.filter((item) => (item.status || '').toLowerCase() === 'attended').length
    const eventsWithRegistrations = new Set(
      filteredRegistrations.map((item) => item.eventTitle || item.title || ''),
    ).size

    return [
      {
        key: 'total',
        value: totalRegistrations,
        label: 'Total Registrations',
        icon: UsersIcon,
        tone: 'purple',
      },
      {
        key: 'events',
        value: eventsWithRegistrations,
        label: 'Events with Registrations',
        icon: CalendarBadgeIcon,
        tone: 'blue',
      },
    ]
  }, [filteredRegistrations])

  return (
    <div className="registrations-container">
      <aside className="registrations-sidebar">
        <div className="registrations-brand">
          <div className="brand-mark">
            <BrandVideoIcon />
          </div>
          <div>
            <h1>EduWebinar</h1>
            <p>Instructor Portal</p>
          </div>
        </div>

        <nav className="registrations-nav">
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

      <main className="registrations-main">
        <header className="registrations-header">
          <h2>
            Registrations <HeaderUsersIcon />
          </h2>
          <p>View all student registrations for your events</p>
        </header>

        <section className="registrations-stats" aria-label="Registration summary">
          {stats.map((card) => {
            const Icon = card.icon
            return (
              <article key={card.key} className={`stat-card stat-${card.tone}`}>
                <div className="stat-icon">
                  <Icon />
                </div>
                <div>
                  <p className="stat-value">{card.value}</p>
                  <p className="stat-label">{card.label}</p>
                </div>
              </article>
            )
          })}
        </section>

        <section className="registrations-list" aria-label="Registration list">
          {registrations.length === 0 ? (
            <div className="registrations-empty">
              <h3>No registrations yet</h3>
              <p>Students will appear here once they register</p>
            </div>
          ) : (
            <div className="registrations-table">
              {registrations.map((item) => (
                <article key={item.id || `${item.email}-${item.eventTitle}`} className="registration-card">
                  <div className="registration-row">
                    <div>
                      <p className="registration-name">{item.studentName || item.name || 'Student'}</p>
                      <p className="registration-email">{item.email || 'student@email.com'}</p>
                    </div>
                    <span className={`registration-status ${item.status || 'registered'}`}>
                      {item.status || 'Registered'}
                    </span>
                  </div>
                  <div className="registration-event">
                    <CalendarBadgeIcon />
                    <span>{item.eventTitle || item.title || 'Event'}</span>
                  </div>
                  <div className="registration-meta">
                    <span className="meta-item">
                      <ClockIcon />
                      {item.date || 'Date TBD'}
                    </span>
                    <span className="meta-item">
                      <TagIcon />
                      {item.eventType || item.type || 'Webinar'}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
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
      <path d="M10 4.5H7.2C6 4.5 5 5.5 5 6.7V17.3C5 18.5 6 19.5 7.2 19.5H10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 8.2L18 12L13 15.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.8 12H18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function HeaderUsersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" style={{ opacity: 0.45 }}>
      <circle cx="9" cy="9" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 18.2C4.6 15.7 6.5 14.4 9 14.4C11.5 14.4 13.4 15.7 14 18.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="10" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 12.2L11 14.7L16 9.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3V7M16 3V7M4 10H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M20 12l-8 8-9-9V4h7l10 8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default Registrations
