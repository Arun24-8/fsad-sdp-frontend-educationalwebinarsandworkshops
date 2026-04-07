import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import UserLogin from '../User Dashboard/UserLogin'
import UserRegistration from '../User Dashboard/UserRegistration'
import academicCapIcon from '../assets/academic-cap-1.svg'

const LOGGED_IN_USER_KEY = 'eduwebinarLoggedInUser'

function Dashboard() {
  const navigate = useNavigate()
  const [portal, setPortal] = useState('student')
  const [authMode, setAuthMode] = useState('login')
  const [instructorEmail, setInstructorEmail] = useState('')
  const [instructorPassword, setInstructorPassword] = useState('')
  const [error, setError] = useState('')

  const handleInstructorSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validate password length
    if (instructorPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    const trimmedEmail = instructorEmail.trim()
    const usernameFromEmail = trimmedEmail.toLowerCase().endsWith('@gmail.com')
      ? trimmedEmail.slice(0, -'@gmail.com'.length)
      : trimmedEmail.split('@')[0]

    localStorage.setItem(
      LOGGED_IN_USER_KEY,
      JSON.stringify({
        username: usernameFromEmail || 'User',
        email: trimmedEmail,
      }),
    )

    if (portal === 'instructor') {
      navigate('/instructor')
      return
    }

    navigate('/user-dashboard')
  }

  const handleStudentLogin = (student) => {
    setError('')
    const displayName = student?.name || student?.username || 'User'
    const email = student?.email || ''
    const contact = student?.contact || ''
    const username = student?.username || ''

    localStorage.setItem(
      LOGGED_IN_USER_KEY,
      JSON.stringify({
        username,
        name: displayName,
        email,
        contact,
      }),
    )
    navigate('/user-dashboard')
  }

  const handleStudentRegister = ({ name, email, username, contact }) => {
    setError('')

    localStorage.setItem(
      LOGGED_IN_USER_KEY,
      JSON.stringify({
        username: username || '',
        name: name || username || 'User',
        email: email || '',
        contact: contact || '',
      }),
    )
    navigate('/user-dashboard')
  }

  return (
    <div className="dashboard">
      <section className="left-panel">
        <div className="brand-header">
          <div className="floating-icon">
            <img
              src={academicCapIcon}
              alt="WorkshopHub icon"
            />
          </div>
          <h1 className="brand-title">WorkshopHub</h1>
        </div>
        <p className="tagline">Learn from experts worldwide</p>
        <p className="subcopy">
          Join thousands of learners advancing their skills with structured,
          industry-grade sessions.
        </p>

        <div className="feature-stack">
          <div className="feature-card">
            <div className="feature-icon">LS</div>
            <div>
              <h3>Live Sessions</h3>
              <p>Join real-time webinars with industry experts.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon alt">IW</div>
            <div>
              <h3>Interactive Workshops</h3>
              <p>Hands-on training from certified professionals.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">OD</div>
            <div>
              <h3>On-Demand Resources</h3>
              <p>Access recordings, labs, and templates anytime.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="right-panel">
        <div className="auth-card" id="dashboard">
          <div className="card-title">
            <h2>Welcome Back</h2>
          </div>
          <p className="card-subtitle">
            Sign in to access your learning portal
          </p>

          {error && <div className="error-message">{error}</div>}

          <div className="portal-section">
            <p className="section-label">Select your role</p>
            <div className="role-selector">
              <div className="role-block">
                <span className="role-text">{portal === 'student' ? 'Student' : 'Instructor'}</span>
              </div>
              <button
                className="change-btn"
                type="button"
                onClick={() => {
                  setPortal(portal === 'student' ? 'instructor' : 'student')
                  setError('')
                  setAuthMode('login')
                }}
              >
                Change
              </button>
            </div>
          </div>

          {portal === 'student' ? (
            <>
              {authMode === 'login' ? (
                <UserLogin
                  onSuccess={handleStudentLogin}
                  onError={setError}
                />
              ) : (
                <UserRegistration
                  onSuccess={handleStudentRegister}
                  onError={setError}
                />
              )}
              <div className="card-footer">
                <button
                  className="ghost-link"
                  type="button"
                  onClick={() => {
                    setError('')
                    setAuthMode(authMode === 'login' ? 'register' : 'login')
                  }}
                >
                  {authMode === 'login' ? 'Create a new account' : 'Back to sign in'}
                </button>
                <a
                  className="help"
                  href="https://t.me/SAIANILKUMAR01"
                  target="_blank"
                  rel="noreferrer"
                >
                  Need help? Contact support
                </a>
              </div>
            </>
          ) : (
            <>
              <form className="auth-form" onSubmit={handleInstructorSubmit}>
                <label className="field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={instructorEmail}
                    onChange={(e) => setInstructorEmail(e.target.value)}
                    required
                  />
                </label>
                <label className="field">
                  <span>Password</span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={instructorPassword}
                    onChange={(e) => setInstructorPassword(e.target.value)}
                    required
                  />
                </label>
                <button className="primary" type="submit">
                  Sign In to Instructor Portal
                  <span className="arrow">-&gt;</span>
                </button>
              </form>

              <div className="card-footer">
                <a
                  className="help"
                  href="https://t.me/SAIANILKUMAR01"
                  target="_blank"
                  rel="noreferrer"
                >
                  Need help? Contact support
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
