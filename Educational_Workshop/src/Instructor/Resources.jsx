import '../styles/Resources.css'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const LOGGED_IN_USER_KEY = 'eduwebinarLoggedInUser'
const SCHEDULED_EVENTS_KEY = 'scheduledEvents'
const INSTRUCTOR_RESOURCES_KEY = 'instructorResources'

const DEFAULT_RESOURCES = [
  {
    id: 'seed-resource-1',
    eventId: 'seed-event',
    resourceName: 'Design Principles Guide',
    resourceUrl: 'https://www.figma.com',
    eventTitle: 'UI/UX Design Principles',
    uploadedAt: '2026-02-20T10:00:00.000Z',
  },
  {
    id: 'seed-resource-2',
    eventId: 'seed-event',
    resourceName: 'Figma Template Files',
    resourceUrl: 'https://www.figma.com/community',
    eventTitle: 'UI/UX Design Principles',
    uploadedAt: '2026-02-20T10:00:00.000Z',
  },
]

const sidebarItems = [
  { label: 'Dashboard', path: '/instructor', icon: DashboardIcon },
  { label: 'Schedule Event', path: '/instructor/schedule', icon: ScheduleIcon },
  { label: 'Manage Events', path: '/instructor/manage-events', icon: CalendarIcon },
  { label: 'Registrations', path: '/instructor/registrations', icon: UsersIcon },
  { label: 'Resources', path: '/instructor/resources', icon: UploadIcon },
  { label: 'Analytics', icon: ChartIcon },
]

function Resources() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loggedInUsername, setLoggedInUsername] = useState('User')
  const [events, setEvents] = useState([])
  const [resources, setResources] = useState([])
  const [formData, setFormData] = useState({
    eventId: '',
    resourceName: '',
    resourceUrl: '',
  })

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
      const savedEvents = JSON.parse(localStorage.getItem(SCHEDULED_EVENTS_KEY) || '[]')
      setEvents(savedEvents)
    } catch {
      setEvents([])
    }

    try {
      const savedResources = JSON.parse(localStorage.getItem(INSTRUCTOR_RESOURCES_KEY) || '[]')

      if (savedResources.length > 0) {
        setResources(savedResources)
      } else {
        setResources(DEFAULT_RESOURCES)
        localStorage.setItem(INSTRUCTOR_RESOURCES_KEY, JSON.stringify(DEFAULT_RESOURCES))
      }
    } catch {
      setResources(DEFAULT_RESOURCES)
      localStorage.setItem(INSTRUCTOR_RESOURCES_KEY, JSON.stringify(DEFAULT_RESOURCES))
    }
  }, [])

  const avatarLetter = loggedInUsername.charAt(0).toUpperCase() || 'U'

  const handleLogout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY)
    navigate('/dashboard')
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpload = (event) => {
    event.preventDefault()

    if (!formData.eventId || !formData.resourceName || !formData.resourceUrl) {
      alert('Please fill Select Event, Resource Name, and Resource URL')
      return
    }

    const selectedEvent = events.find((item) => item.id === formData.eventId)

    const newResource = {
      id: Date.now().toString(),
      eventId: formData.eventId,
      resourceName: formData.resourceName.trim(),
      resourceUrl: formData.resourceUrl.trim(),
      eventTitle: selectedEvent?.title || 'Untitled Event',
      uploadedAt: new Date().toISOString(),
    }

    const updatedResources = [newResource, ...resources]
    setResources(updatedResources)
    localStorage.setItem(INSTRUCTOR_RESOURCES_KEY, JSON.stringify(updatedResources))

    setFormData({
      eventId: '',
      resourceName: '',
      resourceUrl: '',
    })
  }

  const handleDeleteResource = (resourceId) => {
    const updatedResources = resources.filter((item) => item.id !== resourceId)
    setResources(updatedResources)
    localStorage.setItem(INSTRUCTOR_RESOURCES_KEY, JSON.stringify(updatedResources))
  }

  const formattedResources = useMemo(
    () => resources.map((item) => ({ ...item, dateText: formatDate(item.uploadedAt) })),
    [resources],
  )

  return (
    <div className="resources-page">
      <aside className="resources-sidebar">
        <div className="resources-brand">
          <div className="brand-mark">
            <BrandVideoIcon />
          </div>
          <div>
            <h1>EduWebinar</h1>
            <p>Instructor Portal</p>
          </div>
        </div>

        <nav className="resources-nav">
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

      <main className="resources-main">
        <header className="resources-header">
          <h2>
            Resources <HeaderIcon />
          </h2>
          <p>Upload and manage post-event resources for your students</p>
        </header>

        <section className="upload-card" aria-label="Upload resource">
          <h3>
            <UploadResourceIcon />
            Upload New Resource
          </h3>

          <form className="upload-form" onSubmit={handleUpload}>
            <label>
              <span>Select Event</span>
              <select
                name="eventId"
                value={formData.eventId}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Resource Name</span>
              <input
                type="text"
                name="resourceName"
                value={formData.resourceName}
                onChange={handleInputChange}
                placeholder="Enter resource name"
                required
              />
            </label>

            <label>
              <span>Resource URL</span>
              <input
                type="url"
                name="resourceUrl"
                value={formData.resourceUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/resource"
                required
              />
            </label>

            <p className="upload-tip">💡 Tip: You can use Google Drive, Dropbox, YouTube, or any public URL</p>

            <button type="submit" className="upload-btn">
              <UploadIcon />
              Upload Resource
            </button>
          </form>
        </section>

        <section className="resources-list" aria-label="Uploaded resources">
          <h3>Uploaded Resources ({formattedResources.length})</h3>

          {formattedResources.length === 0 ? (
            <div className="resources-empty">
              <p>No resources uploaded yet.</p>
            </div>
          ) : (
            <div className="resource-grid">
              {formattedResources.map((item) => (
                <article key={item.id} className="resource-card">
                  <div className="resource-icon-wrap">
                    <FileIcon />
                  </div>
                  <h4>{item.resourceName}</h4>
                  <p className="resource-from">From: {item.eventTitle}</p>
                  <p className="resource-date">
                    <ClockIcon />
                    Uploaded {item.dateText}
                  </p>
                  <a
                    href={item.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="resource-link"
                  >
                    <LinkIcon />
                    View Resource
                  </a>
                  <button
                    type="button"
                    className="resource-delete-btn"
                    onClick={() => handleDeleteResource(item.id)}
                  >
                    <TrashIcon />
                    Delete Resource
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function formatDate(inputDate) {
  const date = new Date(inputDate)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  const day = `${date.getDate()}`.padStart(2, '0')
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
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

function HeaderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" style={{ opacity: 0.45 }}>
      <path d="M4 5H10V11H4V5ZM14 5H20V11H14V5ZM4 13H10V19H4V13ZM14 13H20V19H14V13Z" fill="currentColor" />
    </svg>
  )
}

function UploadResourceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" opacity="0.15" />
      <path d="M12 7V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.3 9.7L12 7L14.7 9.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 16.5H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26">
      <path d="M8 3H14L19 8V20H8V3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3V8H19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 12H16M10 15H16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8V12L14.5 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M10 14L14 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 16.5L6.5 18.5C5.1 19.9 2.9 19.9 1.5 18.5C0.1 17.1 0.1 14.9 1.5 13.5L4.2 10.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 7.5L17.5 5.5C18.9 4.1 21.1 4.1 22.5 5.5C23.9 6.9 23.9 9.1 22.5 10.5L19.8 13.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M4 7H20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 7V5.2C9 4.5 9.5 4 10.2 4H13.8C14.5 4 15 4.5 15 5.2V7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 7L8 19C8.1 20 8.9 20.8 9.9 20.8H14.1C15.1 20.8 15.9 20 16 19L17 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10.5V16.5M14 10.5V16.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default Resources
