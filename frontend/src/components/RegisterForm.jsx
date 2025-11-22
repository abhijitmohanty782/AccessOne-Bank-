import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    date_of_birth: '',
    phone: '',
    account_type: 'savings'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { registerInitiate, registerVerify } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (!formData.address.trim()) {
      setError('Address is required')
      return false
    }
    if (!formData.date_of_birth) {
      setError('Date of birth is required')
      return false
    }
    return true
  }

  const [otpPhase, setOtpPhase] = useState(false)
  const [otp, setOtp] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setError('')
    setSuccess('')

    const { confirmPassword, ...userData } = formData
    const result = await registerInitiate(userData)
    if (result.success) {
      setSuccess('OTP sent to your email. Please enter the 6-digit code.')
      setOtpPhase(true)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!/^[0-9]{6}$/.test(otp)) {
      setError('Enter a valid 6-digit OTP')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    const result = await registerVerify(formData.email, otp)
    if (result.success) {
      setSuccess('Account created successfully! Please login.')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {!otpPhase ? (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="input-field mt-1"
                rows="3"
                placeholder="Enter your address"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                required
                value={formData.date_of_birth}
                onChange={handleChange}
                className="input-field mt-1"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="account_type" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="account_type"
                name="account_type"
                value={formData.account_type}
                onChange={handleChange}
                className="input-field mt-1"
                disabled={loading}
              >
                <option value="savings">Savings Account</option>
                <option value="checking">Checking Account</option>
                <option value="business">Business Account</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        ) : (
        <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
          <div className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP sent to {formData.email}
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field mt-1 tracking-widest text-center"
                placeholder="______"
                disabled={loading}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="w-40 bg-gray-200 text-gray-800 py-2 px-4 rounded-md disabled:opacity-50"
            >
              Resend OTP
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}

export default RegisterForm
