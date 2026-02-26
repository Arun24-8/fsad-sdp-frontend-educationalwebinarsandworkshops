import './styles/App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Instructor from './Instructor/Instructor'
import Schedule from './Instructor/Schedule'
import ManageEvent from './Instructor/ManageEvent'
import Registrations from './Instructor/Registrations'
import UserDashboard from './User Dashboard/UserDashboard'

const LOGGED_IN_USER_KEY = 'eduwebinarLoggedInUser'

function UserDashboardPage() {
  const navigate = useNavigate()
  const [profileName, setProfileName] = useState('User')
  const [profileEmail, setProfileEmail] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem(LOGGED_IN_USER_KEY)

    if (!savedUser) {
      setProfileName('User')
      setProfileEmail('')
      return
    }

    try {
      const parsedUser = JSON.parse(savedUser)
      setProfileName(parsedUser?.username || 'User')
      setProfileEmail(parsedUser?.email || '')
    } catch {
      setProfileName('User')
      setProfileEmail('')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY)
    navigate('/dashboard')
  }

  const handleUpdateEmail = (newEmail) => {
    setProfileEmail(newEmail)
    localStorage.setItem(
      LOGGED_IN_USER_KEY,
      JSON.stringify({
        username: profileName || 'User',
        email: newEmail,
      }),
    )
  }

  return (
    <UserDashboard
      profileName={profileName}
      profileEmail={profileEmail}
      onLogout={handleLogout}
      onUpdateEmail={handleUpdateEmail}
    />
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Dashboard />} />
        <Route path="/instructor" element={<Instructor />} />
        <Route path="/instructor/schedule" element={<Schedule />} />
        <Route path="/instructor/manage-events" element={<ManageEvent />} />
        <Route path="/instructor/registrations" element={<Registrations />} />
        <Route path="/user-dashboard" element={<UserDashboardPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App