import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">Bank App</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your trusted banking partner for secure, convenient, and modern financial services.
            Manage your money with confidence and ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Banking</h3>
              <p className="text-gray-600">
                Your financial data is protected with bank-level security and encryption.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Transactions</h3>
              <p className="text-gray-600">
                Transfer money, pay bills, and manage your finances with lightning speed.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile First</h3>
              <p className="text-gray-600">
                Access your account anywhere, anytime with our responsive design.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Choose Bank App?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                <div className="text-gray-600">Customer Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">$0</div>
                <div className="text-gray-600">Monthly Fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">256-bit</div>
                <div className="text-gray-600">SSL Encryption</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
