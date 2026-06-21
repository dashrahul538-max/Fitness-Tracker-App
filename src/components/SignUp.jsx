import { useState } from 'react'
import './SignUp.css'

function SignUp({ onSignUp }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    goal: 'weight-loss'
  })

  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.age || formData.age < 13) newErrors.age = 'Valid age is required (13+)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || '' : value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age,
          goal: formData.goal
        }),
      })

      if (response.ok) {
        const user = await response.json()
        onSignUp(user)
      } else {
        const error = await response.json()
        setErrors({ submit: error.error || 'Sign up failed' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>💪 FitTracker</h1>
          <p>Join thousands tracking their fitness journey</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
                min="13"
                className={errors.age ? 'error' : ''}
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="goal">Fitness Goal</label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
              >
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="fitness">General Fitness</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••"
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>

      <div className="signup-benefits">
        <div className="benefit-card">
          <div className="benefit-icon">📊</div>
          <h3>Track Progress</h3>
          <p>Monitor your daily activities and weekly achievements</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">🎯</div>
          <h3>Achieve Goals</h3>
          <p>Set fitness goals and track your path to success</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">💪</div>
          <h3>Stay Motivated</h3>
          <p>Get insights and motivation to keep you going</p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
