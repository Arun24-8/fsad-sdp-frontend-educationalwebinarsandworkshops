import { useState } from 'react'
import axios from 'axios'

const REGISTRATION_URL = `${import.meta.env.VITE_API_URL || ''}/studentapi/registration`

export default function UserRegistration({ onSuccess, onError }) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [warning, setWarning] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim() || !username.trim() || !email.trim() || !contact.trim()) {
      setWarning('Please fill in all required fields')
      return
    }

    if (password !== confirmPassword) {
      setWarning('Passwords do not match')
      return
    }

    setWarning('')
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post(REGISTRATION_URL, {
        name: name.trim(),
        email: email.trim(),
        username: username.trim(),
        contact: contact.trim(),
        password,
      })

      if (response.status === 201 && onSuccess) {
        onSuccess({
          name: name.trim(),
          email: email.trim(),
          username: username.trim(),
          contact: contact.trim(),
        })
      }
    } catch (error) {
      if (onError) {
        if (error.response?.data) {
          onError(
            typeof error.response.data === 'string'
              ? error.response.data
              : 'Registration failed',
          )
          return
        }
        if (error.response?.status === 409) {
          onError('Account already exists')
          return
        }
        if (error.request) {
          onError('Network error. Please try again.')
          return
        }
        onError('Registration failed')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Full Name</span>
        <input
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Username</span>
        <input
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Email Address</span>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Create Password</span>
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            if (warning) {
              setWarning('')
            }
          }}
          required
          minLength={8}
        />
      </label>
      <label className="field">
        <span>Confirm Password</span>
        <input
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value)
            if (warning) {
              setWarning('')
            }
          }}
          required
          minLength={8}
        />
      </label>
      {warning && <div className="error-message">{warning}</div>}
      <label className="field">
        <span>Contact Number</span>
        <input
          type="tel"
          placeholder="Enter your contact number"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          required
        />
      </label>
      <button className="primary" type="submit">
        {isSubmitting ? 'Creating account...' : 'Create Student Account'}
        <span className="arrow">-&gt;</span>
      </button>
    </form>
  )
}