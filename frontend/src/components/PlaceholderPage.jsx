import React from 'react'

const PlaceholderPage = ({ title, description, icon = "🏦" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="text-6xl md:text-7xl mb-6">{icon}</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {description}
            </p>
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 text-teal-800 px-6 py-4 rounded-xl max-w-md mx-auto shadow-md">
              <p className="font-semibold text-lg">🚧 Under Development</p>
              <p className="text-sm mt-2">This feature is currently being developed and will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceholderPage
