import { useState } from 'react'
import axios from 'axios'

const LOGIN_URL = `${import.meta.env.VITE_API_URL || ''}/studentapi/login`

export default function UserLogin({ onSuccess, onError }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <form
      className="auth-form"
      onSubmit={async (event) => {
        event.preventDefault()
        if (isSubmitting) {
          return
        }
        setIsSubmitting(true)
        try {
          const response = await axios.post(LOGIN_URL, {
            username: username.trim(),
            password,
          })

          if (response.status === 200 && onSuccess) {
            const payload = response.data || {}
            onSuccess({
              name: payload.name || payload.username || username.trim(),
              username: payload.username || username.trim(),
              email: payload.email || '',
              contact: payload.contact || '',
            })
          }
        } catch (error) {
          if (onError) {
            if (error.response?.data) {
              onError(
                typeof error.response.data === 'string'
                  ? error.response.data
                  : 'Login failed',
              )
              return
            }
            if (error.response?.status === 401) {
              onError('Login Invalid')
              return
            }
            if (error.request) {
              onError('Network error. Please try again.')
              return
            }
            onError('Login failed')
          }
        } finally {
          setIsSubmitting(false)
        }
      }}
    >
      <label className="field">
        <span>Username</span>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />
      </label>
      <button className="primary" type="submit">
        {isSubmitting ? 'Signing In...' : 'Sign In to Student Portal'}
        <span className="arrow">-&gt;</span>
      </button>
    </form>
  )
}