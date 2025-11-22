import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsNavbarOpen(false)
  }

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen)
    setActiveDropdown(null)
  }

  const closeNavbar = () => {
    setIsNavbarOpen(false)
    setActiveDropdown(null)
  }

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  if (!user) {
    return (
      <header className="bg-white shadow-sm border-b relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Bank App</h1>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-primary-600 font-medium"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn-primary"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Bank App</h1>
          </Link>
          
          {/* Hamburger menu button - Top Right Corner */}
          <button
            onClick={toggleNavbar}
            className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Full Navigation Menu */}
        {isNavbarOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50 max-h-screen overflow-y-auto">
            <nav className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                
                {/* 1. Home */}
                <div className="space-y-2">
                  <Link 
                    to="/" 
                    className="block text-lg font-semibold text-gray-900 hover:text-primary-600 py-2 border-b border-gray-200"
                    onClick={closeNavbar}
                  >
                    🏠 Home
                  </Link>
                </div>

                {/* 2. Accounts */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleDropdown('accounts')}
                    className="w-full text-left text-lg font-semibold text-gray-900 hover:text-primary-600 py-2 border-b border-gray-200 flex items-center justify-between"
                  >
                    <span>💳 Accounts</span>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'accounts' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'accounts' && (
                    <div className="ml-4 space-y-1">
                      {/*<Link to="/payments/overview" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Account Overview</Link>
                      <Link to="/payments/statement" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Account Statements</Link>
                      <Link to="/payments/history" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Transaction History</Link>
                      */}
                      <Link to="/payments/history/advanced" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Advanced Transaction History</Link>
                    </div>
                  )}
                </div>

                {/* 3. YONO Pay */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleDropdown('payments')}
                    className="w-full text-left text-lg font-semibold text-gray-900 hover:text-primary-600 py-2 border-b border-gray-200 flex items-center justify-between"
                  >
                    <span>💸 YONO Pay</span>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'payments' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'payments' && (
                    <div className="ml-4 space-y-1">
                      <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Fund Transfer</div>
                      <Link to="/payments/transfer" className="block text-gray-700 hover:text-primary-600 py-1 ml-2" onClick={closeNavbar}>Transfer Money</Link>
                      <Link to="/payments/beneficiaries" className="block text-gray-700 hover:text-primary-600 py-1 ml-2" onClick={closeNavbar}>Manage Beneficiaries</Link>
                    </div>
                  )}
                </div>

                {/* 4. Shop & Order */}
                <div className="space-y-2">
                  <Link 
                    to="/shop" 
                    className="block text-lg font-semibold text-gray-900 hover:text-primary-600 py-2 border-b border-gray-200"
                    onClick={closeNavbar}
                  >
                    🛒 Shop & Order
                  </Link>
                </div>

                {/* 5. Investments */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleDropdown('investments')}
                    className="w-full text-left text-lg font-semibold text-gray-900 hover:text-primary-600 py-2 border-b border-gray-200 flex items-center justify-between"
                  >
                    <span>📈 Investments</span>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'investments' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'investments' && (
                    <div className="ml-4 space-y-1">
                      <Link to="/mutual-funds" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Mutual Funds</Link>
                      <Link to="/fixed-deposit" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Fixed Deposits</Link>
                      <Link to="/investments/recurring-deposits" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Recurring Deposits</Link>
                      <Link to="/investments/gold" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Gold Purchase</Link>
                    </div>
                  )}
                </div>

                {/* 6. Loans */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleDropdown('loans')}
                    className="w-full text-left text-lg font-semibold text-gray-900 hover:text-primary-600 py-2 border-b border-gray-200 flex items-center justify-between"
                  >
                    <span>🏠 Loans</span>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'loans' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'loans' && (
                    <div className="ml-4 space-y-1">
                      <Link to="/loans/personal" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Apply for Personal Loan</Link>
                      <Link to="/loans/home" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Home Loan</Link>
                      <Link to="/loans/education" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Education Loan</Link>
                      <Link to="/loans/car" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Car Loan</Link>
                    </div>
                  )}
                </div>

                {/* 7. Cards */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleDropdown('cards')}
                    className="w-full text-left text-lg font-semibold text-gray-900 hover:text-primary-600 py-2 border-b border-gray-200 flex items-center justify-between"
                  >
                    <span>💳 Cards</span>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'cards' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'cards' && (
                    <div className="ml-4 space-y-1">
                      <Link to="/cards/details" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Credit Card Details</Link>
                      <Link to="/cards/apply" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Apply for New Card</Link>
                      <Link to="/cards/block" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Block Card</Link>
                    </div>
                  )}
                </div>

                {/* 8. Insurance */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleDropdown('insurance')}
                    className="w-full text-left text-lg font-semibold text-gray-900 hover:text-primary-600 py-2 border-b border-gray-200 flex items-center justify-between"
                  >
                    <span>🛡️ Insurance</span>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'insurance' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'insurance' && (
                    <div className="ml-4 space-y-1">
                      <Link to="/insurance/life" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Life Insurance</Link>
                      <Link to="/insurance/general" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>General Insurance</Link>
                    </div>
                  )}
                </div>

                {/* 9. Services / Requests */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleDropdown('services')}
                    className="w-full text-left text-lg font-semibold text-gray-900 hover:text-primary-600 py-2 border-b border-gray-200 flex items-center justify-between"
                  >
                    <span>🔧 Services / Requests</span>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'services' && (
                    <div className="ml-4 space-y-1">
                      <Link to="/services/cheque-book" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Cheque Book Request</Link>
                      <Link to="/services/atm-card" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>ATM Card Services</Link>
                      <Link to="/services/block-atm" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Block ATM Card</Link>
                      <Link to="/services/card-limit" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Set Card Limit</Link>
                      <Link to="/services/nominee-update" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Nominee Update</Link>
                      <Link to="/services/track-requests" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Track Requests</Link>
                    </div>
                  )}
                </div>

                {/* 10. Profile / Settings */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleDropdown('profile')}
                    className="w-full text-left text-lg font-semibold text-gray-900 hover:text-primary-600 py-2 border-b border-gray-200 flex items-center justify-between"
                  >
                    <span>👤 Profile / Settings</span>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'profile' && (
                    <div className="ml-4 space-y-1">
                      <Link to="/profile/manage-accounts" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Manage Accounts</Link>
                      <Link to="/profile/update" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Update Profile</Link>
                      <Link to="/profile/change-password" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Change MPIN / Password</Link>
                      <Link to="/profile/security" className="block text-gray-700 hover:text-primary-600 py-1" onClick={closeNavbar}>Security Settings</Link>
                    </div>
                  )}
                </div>

                {/* 11. Logout */}
                <div className="space-y-2">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-lg font-semibold text-red-600 hover:text-red-700 py-2 border-b border-gray-200"
                  >
                    🚪 Logout
                  </button>
                </div>

              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Overlay to close navbar when clicking outside */}
      {isNavbarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25" 
          onClick={closeNavbar}
        ></div>
      )}
    </header>
  )
}

export default Header
