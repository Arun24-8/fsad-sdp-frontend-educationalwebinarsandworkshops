import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'

const LOGGED_IN_USER_KEY = 'eduwebinarLoggedInUser'

function Dashboard() {
  const navigate = useNavigate()
  const [portal, setPortal] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    const trimmedEmail = email.trim()
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

  return (
    <div className="dashboard">
      <section className="left-panel">
        <div className="brand-header">
          <div className="floating-icon">
            <img
              src="https://unpkg.com/heroicons@2.1.1/24/solid/academic-cap.svg"
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
                onClick={() => setPortal(portal === 'student' ? 'instructor' : 'student')}
              >
                Change
              </button>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Email Address</span>
              <input 
                type="email" 
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button className="primary" type="submit">
              Sign In to {portal === 'student' ? 'Student' : 'Instructor'} Portal
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
        </div>
      </section>
    </div>
  )
}

export default Dashboard
