import './styles/App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Instructor from './Instructor/Instructor'
import Schedule from './Instructor/Schedule'
import ManageEvent from './Instructor/ManageEvent'
import Registrations from './Instructor/Registrations'
import Resources from './Instructor/Resources'
import Analytics from './Instructor/Analytics'
import UserDashboard from './User Dashboard/UserDashboard'

const LOGGED_IN_USER_KEY = 'eduwebinarLoggedInUser'

function UserDashboardPage() {
  const navigate = useNavigate()
  const [profileName, setProfileName] = useState('User')
  const [profileUsername, setProfileUsername] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profileContact, setProfileContact] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem(LOGGED_IN_USER_KEY)

    if (!savedUser) {
      setProfileName('User')
      setProfileUsername('')
      setProfileEmail('')
      setProfileContact('')
      return
    }

    try {
      const parsedUser = JSON.parse(savedUser)
      setProfileName(parsedUser?.name || parsedUser?.username || 'User')
      setProfileUsername(parsedUser?.username || '')
      setProfileEmail(parsedUser?.email || '')
      setProfileContact(parsedUser?.contact || '')
    } catch {
      setProfileName('User')
      setProfileUsername('')
      setProfileEmail('')
      setProfileContact('')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY)
    navigate('/dashboard')
  }

  const handleUpdateProfile = ({ name, contact }) => {
    const updatedName = name?.trim() || profileName || 'User'
    const updatedContact = contact?.trim() || ''
    setProfileName(updatedName)
    setProfileContact(updatedContact)
    localStorage.setItem(
      LOGGED_IN_USER_KEY,
      JSON.stringify({
        username: profileUsername || '',
        name: updatedName,
        email: profileEmail || '',
        contact: updatedContact,
      }),
    )
  }

  return (
    <UserDashboard
      profileName={profileName}
      profileUsername={profileUsername}
      profileEmail={profileEmail}
      profileContact={profileContact}
      onLogout={handleLogout}
      onUpdateProfile={handleUpdateProfile}
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
        <Route path="/instructor/resources" element={<Resources />} />
        <Route path="/instructor/analytics" element={<Analytics />} />
        <Route path="/analytics" element={<Navigate to="/instructor/analytics" replace />} />
        <Route path="/user-dashboard" element={<UserDashboardPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App