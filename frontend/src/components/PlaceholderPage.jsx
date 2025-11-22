import React from 'react'

const PlaceholderPage = ({ title, description, icon = "🏦" }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="text-6xl mb-6">{icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {description}
            </p>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg max-w-md mx-auto">
              <p className="font-medium">🚧 Under Development</p>
              <p className="text-sm mt-1">This feature is currently being developed and will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceholderPage
