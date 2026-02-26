import '../styles/Instructor.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const LOGGED_IN_USER_KEY = 'eduwebinarLoggedInUser'
const SCHEDULED_EVENTS_KEY = 'scheduledEvents'

const sidebarItems = [
  { label: 'Dashboard', path: '/instructor', icon: DashboardIcon },
  { label: 'Schedule Event', path: '/instructor/schedule', icon: ScheduleIcon },
  { label: 'Manage Events', path: '/instructor/manage-events', icon: CalendarIcon },
  { label: 'Registrations', path: '/instructor/registrations', icon: UsersIcon },
  { label: 'Resources', path: '/instructor/resources', icon: UploadIcon },
  { label: 'Analytics', path: '/instructor/analytics', icon: ChartIcon },
]

function Instructor() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loggedInUsername, setLoggedInUsername] = useState('User')
  const [totalEvents, setTotalEvents] = useState(0)

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
    // Load events count from localStorage
    try {
      const events = JSON.parse(localStorage.getItem(SCHEDULED_EVENTS_KEY) || '[]')
      setTotalEvents(events.length)
    } catch {
      setTotalEvents(0)
    }
  }, [])

  const statCards = [
    {
      key: 'total',
      value: totalEvents.toString(),
      title: 'Total Webinars',
      badge: 'Total',
      tone: 'total',
      icon: BarsIcon,
    },
    {
      key: 'registrations',
      value: '0',
      title: 'Total Registrations',
      badge: 'Active',
      tone: 'active',
      icon: PeopleCardIcon,
    },
    {
      key: 'attended',
      value: '0',
      title: 'Attended',
      badge: 'Completed',
      tone: 'completed',
      icon: CheckCircleIcon,
    },
    {
      key: 'live',
      value: '0',
      title: 'Live Sessions',
      badge: '',
      tone: 'live',
      icon: CameraIcon,
    },
  ]

  const avatarLetter = loggedInUsername.charAt(0).toUpperCase() || 'U'

  const handleLogout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY)
    navigate('/dashboard')
  }

  return (
    <div className="instructor-dashboard">
      <aside className="instructor-sidebar">
        <div className="instructor-brand">
          <div className="brand-mark">
            <BrandVideoIcon />
          </div>
          <div>
            <h1>EduWebinar</h1>
            <p>Instructor Portal</p>
          </div>
        </div>

        <nav className="instructor-nav">
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

      <main className="instructor-main">
        <header className="instructor-header">
          <h2>
            Instructor Dashboard <span className="header-cap">🎓</span>
          </h2>
          <p>Manage your webinars, track registrations, and upload resources</p>
        </header>

        <section className="stats-grid" aria-label="Webinar metrics">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <article
                key={card.key}
                className={`metric-card metric-${card.tone}`}
                aria-label={card.title}
              >
                <div className="metric-top-row">
                  <div className="metric-icon-wrap">
                    <Icon />
                  </div>
                  {card.badge ? <span className="metric-badge">{card.badge}</span> : null}
                </div>
                <p className="metric-value">{card.value}</p>
                <p className="metric-label">{card.title}</p>
              </article>
            )
          })}
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
      <circle cx="9" cy="9" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.4 17.6C5 15.5 6.6 14.4 9 14.4C11.4 14.4 13 15.5 13.6 17.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16.7" cy="9.4" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 12.1L10.9 14.5L15.7 9.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="13" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 10L21 7.8V16.2L16 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
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

export default Instructor