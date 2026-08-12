import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './SignIn.css'

interface SignInLocationState {
  from?: string
}

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated, isLoading, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = (location.state as SignInLocationState | null)?.from || '/admin'

  if (!isLoading && isAuthenticated) return <Navigate to="/admin" replace />

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const signInError = await signIn(email, password)
    setIsSubmitting(false)
    if (!signInError) {
      navigate(destination, { replace: true })
    } else {
      setError(signInError)
    }
  }

  return (
    <main className="sign-in-page">
      <section className="sign-in-card" aria-labelledby="sign-in-title">
        <button className="back-home" type="button" onClick={() => navigate('/')}>
          ← Back to collection
        </button>
        <img src="/brand-logo.png" alt="Koshy's Vintage Vault" className="sign-in-logo" />
        <p className="sign-in-eyebrow">Private administration</p>
        <h1 id="sign-in-title">Admin sign in</h1>
        <p className="sign-in-intro">Enter your administrator credentials to manage the collection.</p>

        <form className="sign-in-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
            />
          </div>
          {error && <div className="sign-in-error" role="alert">{error}</div>}
          <button className="btn btn-primary sign-in-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
