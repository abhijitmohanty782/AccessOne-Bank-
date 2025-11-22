import React, { useState } from 'react'

const FloatingButtons = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [isHelperOpen, setIsHelperOpen] = useState(false)

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen)
    setIsHelperOpen(false)
  }

  const toggleHelper = () => {
    setIsHelperOpen(!isHelperOpen)
    setIsChatbotOpen(false)
  }

  return (
    <>
      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
        
        {/* Helper Button */}
        <div className="relative">
          <button
            onClick={toggleHelper}
            className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            title="Helper"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          {/* Helper Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Helper
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>

          {/* Helper Dropdown */}
          {isHelperOpen && (
            <div className="absolute bottom-full right-0 mb-4 w-80 bg-white rounded-lg shadow-xl border p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Banking Helper</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Quick Actions</h4>
                  <p className="text-sm text-gray-600">Get help with common banking tasks</p>
                </div>
                
                <div className="space-y-2">
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="text-sm font-medium text-gray-900">How to transfer money?</span>
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="text-sm font-medium text-gray-900">Check account balance</span>
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="text-sm font-medium text-gray-900">Apply for loan</span>
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="text-sm font-medium text-gray-900">Card services</span>
                  </button>
                </div>
                
                <div className="pt-2 border-t">
                  <button className="w-full text-center py-2 text-sm text-green-600 hover:text-green-700 font-medium">
                    View All Help Topics
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chatbot Button */}
        <div className="relative">
          <button
            onClick={toggleChatbot}
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            title="Chatbot"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          
          {/* Chatbot Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chatbot
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>

          {/* Chatbot Dropdown */}
          {isChatbotOpen && (
            <div className="absolute bottom-full right-0 mb-4 w-80 bg-white rounded-lg shadow-xl border">
              {/* Chatbot Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Banking Assistant</h3>
                    <p className="text-sm text-gray-500">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatbotOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Chatbot Messages */}
              <div className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-900">Hello! I'm your banking assistant. How can I help you today?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-end">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-900">I need help with money transfer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-900">I can help you with money transfers! You can transfer money through YONO Pay section in the navigation menu.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chatbot Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close dropdowns when clicking outside */}
      {(isChatbotOpen || isHelperOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsChatbotOpen(false)
            setIsHelperOpen(false)
          }}
        ></div>
      )}
    </>
  )
}

export default FloatingButtons
