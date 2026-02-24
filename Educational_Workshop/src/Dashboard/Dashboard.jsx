import { useState } from 'react'
import './Dashboard.css'

function Dashboard() {
  const [portal, setPortal] = useState('student')

  return (
    <div className="dashboard">
      <section className="left-panel">
        <div className="floating-icon">
          <img
            src="https://unpkg.com/heroicons@2.1.1/24/solid/academic-cap.svg"
            alt="WorkshopHub icon"
          />
        </div>

        <h1 className="brand-title">WorkshopHub</h1>
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
            <span className="spark">*</span>
            <h2>Welcome Back</h2>
          </div>
          <p className="card-subtitle">
            Sign in to access your learning portal
          </p>

          <div className="portal-section">
            <p className="section-label">Choose Your Portal</p>
            <div className="portal-grid">
              <button
                className={`portal-option ${portal === 'student' ? 'active' : ''}`}
                type="button"
                onClick={() => setPortal('student')}
              >
                <div className="portal-badge">STU</div>
                <div>
                  <h4>Student Portal</h4>
                  <span>Browse and attend</span>
                </div>
              </button>
              <button
                className={`portal-option ${portal === 'instructor' ? 'active' : ''}`}
                type="button"
                onClick={() => setPortal('instructor')}
              >
                <div className="portal-badge blue">INS</div>
                <div>
                  <h4>Instructor Portal</h4>
                  <span>Create and manage</span>
                </div>
              </button>
            </div>
          </div>

          <form className="auth-form">
            <label className="field">
              <span>Email Address</span>
              <input type="email" placeholder="your.email@example.com" />
            </label>
            <label className="field">
              <span>Password</span>
              <input type="password" placeholder="Enter your password" />
            </label>
            <button className="primary" type="submit">
              Sign In to Student Portal
              <span className="arrow">-&gt;</span>
            </button>
          </form>

          <div className="card-footer">
            <button className="ghost-link" type="button">
              Demo Mode
            </button>
            <a className="help" href="mailto:support@eduwebinar.com">
              Need help? Contact support
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
