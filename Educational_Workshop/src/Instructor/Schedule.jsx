import '../styles/Instructor.css'
import '../styles/Schedule.css'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const LOGGED_IN_USER_KEY = 'eduwebinarLoggedInUser'
const SCHEDULED_EVENTS_KEY = 'scheduledEvents'

const sidebarItems = [
  { label: 'Dashboard', path: '/instructor', icon: DashboardIcon },
  { label: 'Schedule Event', path: '/instructor/schedule', icon: ScheduleIcon },
  { label: 'Manage Events', icon: CalendarIcon },
  { label: 'Registrations', icon: UsersIcon },
  { label: 'Resources', icon: UploadIcon },
  { label: 'Analytics', icon: ChartIcon },
]

function Schedule() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loggedInUsername, setLoggedInUsername] = useState('User')
  
  // Form state
  const [formData, setFormData] = useState({
    eventType: '',
    category: '',
    title: '',
    description: '',
    instructorName: '',
    date: '',
    time: '',
    duration: '',
    capacity: '',
    streamUrl: '',
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
      setFormData(prev => ({ ...prev, instructorName: username }))
    } catch {
      setLoggedInUsername('User')
    }
  }, [])

  const avatarLetter = loggedInUsername.charAt(0).toUpperCase() || 'U'

  const handleLogout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY)
    navigate('/dashboard')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.eventType || !formData.category || !formData.title || !formData.date || !formData.time) {
      alert('Please fill in all required fields: Event Type, Category, Title, Date, and Time')
      return
    }

    // Create event object
    const newEvent = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'scheduled',
    }

    // Save to localStorage
    try {
      const existingEvents = JSON.parse(localStorage.getItem(SCHEDULED_EVENTS_KEY) || '[]')
      const updatedEvents = [...existingEvents, newEvent]
      localStorage.setItem(SCHEDULED_EVENTS_KEY, JSON.stringify(updatedEvents))
      
      alert('Event scheduled successfully!')
      navigate('/instructor')
    } catch (error) {
      alert('Failed to schedule event. Please try again.')
      console.error('Error saving event:', error)
    }
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

      <main className="instructor-main schedule-main">
        <header className="schedule-header">
          <h2>
            Schedule New Event <span className="header-cap">🗓️</span>
          </h2>
          <p>Create a new webinar or workshop for your students</p>
        </header>

        <section className="schedule-form-shell" aria-label="Schedule Event Form">
          <form className="schedule-form" onSubmit={handleSubmit}>
            <label>
              <span>Event Type *</span>
              <select 
                name="eventType"
                value={formData.eventType} 
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select event type</option>
                <option value="webinar">Webinar</option>
                <option value="workshop">Workshop</option>
              </select>
            </label>

            <label>
              <span>Category *</span>
              <select 
                name="category"
                value={formData.category} 
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select category</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="education">Education</option>
              </select>
            </label>

            <label className="full-width">
              <span>Event Title *</span>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title" 
                required
              />
            </label>

            <label className="full-width">
              <span>Description</span>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter event description" 
                rows={5} 
              />
            </label>

            <label className="full-width">
              <span>Instructor Name</span>
              <input 
                type="text" 
                name="instructorName"
                value={formData.instructorName}
                onChange={handleInputChange}
                placeholder="Enter instructor name"
              />
            </label>

            <label>
              <span>Date *</span>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              <span>Time *</span>
              <input 
                type="time" 
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              <span>Duration</span>
              <input 
                type="text" 
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g. 60 mins" 
              />
            </label>

            <label>
              <span>Capacity</span>
              <input 
                type="number" 
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1" 
                placeholder="e.g. 100" 
              />
            </label>

            <label>
              <span>Stream URL (Optional)</span>
              <input 
                type="url" 
                name="streamUrl"
                value={formData.streamUrl}
                onChange={handleInputChange}
                placeholder="https://" 
              />
            </label>

            <button type="submit" className="schedule-submit">
              +&nbsp; Schedule Event
            </button>
          </form>
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

export default Schedule
