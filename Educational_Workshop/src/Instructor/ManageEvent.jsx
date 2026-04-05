import '../styles/ManageEvent.css'
import { useNavigate } from 'react-router-dom'
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

function ManageEvent() {
  const navigate = useNavigate()
  const [loggedInUsername, setLoggedInUsername] = useState('User')
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all', 'webinar', 'workshop'
  const [liveEvent, setLiveEvent] = useState(null)
  const [callSeconds, setCallSeconds] = useState(0)

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
    // Load events from localStorage
    try {
      const savedEvents = JSON.parse(localStorage.getItem(SCHEDULED_EVENTS_KEY) || '[]')
      setEvents(savedEvents)
    } catch {
      setEvents([])
    }
  }, [])

  useEffect(() => {
    if (!liveEvent) {
      setCallSeconds(0)
      return
    }

    const startedAt = Date.now()
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      setCallSeconds(elapsed)
    }, 1000)

    return () => clearInterval(timer)
  }, [liveEvent])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow

    if (liveEvent) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [liveEvent])

  const avatarLetter = loggedInUsername.charAt(0).toUpperCase() || 'U'

  const handleLogout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY)
    navigate('/dashboard')
  }

  const handleGoLive = (event) => {
    setLiveEvent(event)
  }

  const handleEndCall = () => {
    setLiveEvent(null)
  }

  const handleDelete = (eventId) => {
    const updatedEvents = events.filter(e => e.id !== eventId)
    setEvents(updatedEvents)
    localStorage.setItem(SCHEDULED_EVENTS_KEY, JSON.stringify(updatedEvents))
  }

  const getEventStatus = (eventDate) => {
    const now = new Date()
    const eventDateTime = new Date(eventDate)
    return eventDateTime > now ? 'UPCOMING' : 'COMPLETED'
  }

  // Filter events based on search term and filter type
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const eventType = (event.eventType || event.type || '').toLowerCase()
    const matchesType = filterType === 'all' || eventType === filterType.toLowerCase()
    
    return matchesSearch && matchesType
  })

  const formattedCallTime = new Date(callSeconds * 1000).toISOString().slice(14, 19)

  return (
    <div className="manage-event-container">
      <aside className="manage-event-sidebar">
        <div className="manage-event-brand">
          <div className="brand-mark">
            <BrandVideoIcon />
          </div>
          <div>
            <h1>EduWebinar</h1>
            <p>Instructor Portal</p>
          </div>
        </div>

        <nav className="manage-event-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = item.path === '/instructor/manage-events'
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

      <main className="manage-event-main">
        <header className="manage-event-header">
          <h2>
            Manage Events <SettingsIcon />
          </h2>
          <p>View, edit, and manage all your webinars and workshops</p>
        </header>

        {/* Search and Filter Section */}
        <section className="search-filter-section">
          <div className="search-bar">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search events by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <ClearIcon />
              </button>
            )}
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Events
            </button>
            <button
              className={`filter-btn ${filterType === 'webinar' ? 'active' : ''}`}
              onClick={() => setFilterType('webinar')}
            >
              <WebinarIcon />
              Webinars
            </button>
            <button
              className={`filter-btn ${filterType === 'workshop' ? 'active' : ''}`}
              onClick={() => setFilterType('workshop')}
            >
              <WorkshopIcon />
              Workshops
            </button>
          </div>
        </section>

        <section className="events-list" aria-label="Event list">
          {events.length === 0 ? (
            <div className="no-events">
              <p>No events scheduled yet. Create your first event!</p>
              <button onClick={() => navigate('/instructor/schedule')} className="btn-schedule">
                Schedule Event
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="no-events">
              <p>No events found matching your search or filter criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setFilterType('all')
                }} 
                className="btn-schedule"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const status = getEventStatus(event.date)
              const eventType = event.eventType || event.type || 'Webinar'
              return (
                <article key={event.id} className="event-card">
                  <div className="event-card-header">
                    <div className="event-badges">
                      <span className={`event-type-badge ${eventType.toLowerCase()}`}>
                        {eventType === 'Workshop' ? <WorkshopIcon /> : <WebinarIcon />}
                        {eventType}
                      </span>
                      <span className={`event-status-badge ${status.toLowerCase()}`}>
                        {status}
                      </span>
                      <span className="event-category-badge">
                        {event.category || 'General'}
                      </span>
                    </div>
                  </div>

                  <div className="event-card-body">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>

                    <div className="event-meta">
                      <span className="meta-item">
                        <PersonIcon />
                        {loggedInUsername}
                      </span>
                      <span className="meta-item">
                        <CalendarIcon2 />
                        {event.date} at {event.time}
                      </span>
                      <span className="meta-item">
                        <PeopleIcon />
                        0/{event.capacity || 100} registered
                      </span>
                      <span className="meta-item">
                        <ClockIcon />
                        {event.duration || '60'} min
                      </span>
                    </div>
                  </div>

                  <div className="event-card-actions">
                    <button
                      className="btn-go-live"
                      onClick={() => handleGoLive(event)}
                    >
                      <PlayIcon />
                      Go Live
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(event.id)}
                    >
                      <DeleteIcon />
                      Delete
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </section>
      </main>

      {liveEvent ? (
        <section className="live-call-overlay" aria-label="Live call">
          <div className="live-call-card" role="dialog" aria-modal="true">
            <p className="live-call-label">Live now</p>
            <h3 className="live-call-title">{liveEvent.title || 'Event Call'}</h3>
            <p className="live-call-subtitle">{loggedInUsername} is presenting</p>

            <div className="live-call-avatar" aria-hidden="true">
              {loggedInUsername.charAt(0).toUpperCase()}
            </div>

            <p className="live-call-timer">{formattedCallTime}</p>

            <div className="live-call-controls">
              <button type="button" className="call-control-btn" aria-label="Toggle microphone">
                <MicIcon />
              </button>
              <button type="button" className="call-control-btn" aria-label="Toggle camera">
                <VideoIcon />
              </button>
              <button type="button" className="call-control-btn end-call" onClick={handleEndCall} aria-label="End call">
                <CallEndIcon />
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}

// Icon Components
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

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" style={{ opacity: 0.4 }}>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function WebinarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <rect x="3" y="6" width="13" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 10L21 7.5V16.5L16 14V10Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function WorkshopIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path d="M12 2L3 7L12 12L21 7L12 2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 17L12 22L21 17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 12L12 17L21 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20c0-4 3-6 7-6s7 2 7 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIcon2() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3V7M16 3V7M4 10H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 18c0-3 2.5-5 6-5s6 2 6 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M3 6h18M8 6V4h8v2M19 6v14H5V6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <rect x="9" y="4" width="6" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 11.5C6 15 8.7 17.5 12 17.5C15.3 17.5 18 15 18 11.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17.5V21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <rect x="3" y="7" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 10L21 7.5V16.5L15 14V10Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function CallEndIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path d="M4 14C6 11.5 8.8 10.2 12 10.2C15.2 10.2 18 11.5 20 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.5 14V17.5M16.5 14V17.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default ManageEvent
