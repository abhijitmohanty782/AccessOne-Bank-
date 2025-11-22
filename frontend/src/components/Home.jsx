import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const featuredProducts = [
    {
      icon: '💳',
      title: 'Savings Account',
      description: 'Step up with the right account',
      subDescription: 'Enjoy offers on multiple brands.',
      link: '/accounts',
      color: 'from-teal-400 to-teal-600'
    },
    {
      icon: '💳',
      title: 'Credit Cards',
      description: 'Exclusive offers await',
      subDescription: 'Rewards | Cashback | EMI Deals.',
      link: '/cards',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: '🏠',
      title: 'Personal Loans',
      description: 'Power your aspirations',
      subDescription: 'Get loan up to ₹35 lakh.',
      link: '/loans',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: '📈',
      title: 'Mutual Funds',
      description: 'Grow your investments',
      subDescription: 'Expert-managed portfolios.',
      link: '/mutual-funds',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: '🛡️',
      title: 'Insurance',
      description: 'Protect what matters',
      subDescription: 'Comprehensive coverage plans.',
      link: '/insurance',
      color: 'from-orange-400 to-orange-600'
    },
    {
      icon: '🏢',
      title: 'Business Banking',
      description: 'Power your business',
      subDescription: 'Tailored solutions for growth.',
      link: '/accounts',
      color: 'from-purple-400 to-purple-600'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
            <span className="text-gray-900">Introducing </span>
            <span className="text-teal-500">AccessOne</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Your ultimate AI-powered banking assistant — making your finances effortless, intelligent, and secure.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
          >
            <span>Try AccessOne</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Featured Products</h2>
          <p className="text-base sm:text-lg text-gray-600 px-4">Explore our range of banking solutions.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {featuredProducts.map((product, index) => (
            <Link
              key={index}
              to={product.link}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-teal-300 transform hover:-translate-y-1"
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br ${product.color} flex items-center justify-center mb-3 sm:mb-4 text-2xl sm:text-3xl`}>
                {product.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
              <p className="text-sm sm:text-base text-gray-700 font-medium mb-1">{product.description}</p>
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{product.subDescription}</p>
              <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 text-sm sm:text-base">
                <span>Apply Now</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-teal-500 via-teal-600 to-green-500 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-lg text-teal-50 mb-8">
              Join millions of customers who trust AccessOne for their banking needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-teal-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Open Account</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nav-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">X</span>
                </div>
                <h3 className="text-xl font-bold">AccessOne</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Your trusted banking partner for secure and innovative financial solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition-colors">Personal Banking</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition-colors">Business Banking</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition-colors">NRI Services</Link></li>
                <li><Link to="/rates-charges" className="text-gray-400 hover:text-teal-400 transition-colors">Rates & Charges</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/accounts" className="text-gray-400 hover:text-teal-400 transition-colors">Savings Account</Link></li>
                <li><Link to="/cards" className="text-gray-400 hover:text-teal-400 transition-colors">Credit Cards</Link></li>
                <li><Link to="/loans" className="text-gray-400 hover:text-teal-400 transition-colors">Loans</Link></li>
                <li><Link to="/insurance" className="text-gray-400 hover:text-teal-400 transition-colors">Insurance</Link></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <div className="text-gray-400">1800-XXX-XXXX</div>
                    <div className="text-gray-500 text-xs">24/7 Customer Support</div>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="text-gray-400">support@accessone.com</div>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-gray-400">123 Banking Street, Financial District, Kolkata 711103</div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 mt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 AccessOne Bank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
