import React from 'react'

const RatesCharges = () => {
  const rates = [
    {
      rate: '6.60%',
      title: 'Fixed Deposit',
      subtitle: 'Regular',
      hasAsterisk: false
    },
    {
      rate: '7.10%',
      title: 'Senior Citizen FD',
      subtitle: 'Special Rate',
      hasAsterisk: false
    },
    {
      rate: '2.50%*',
      title: 'Savings Account',
      subtitle: 'Interest Rate',
      hasAsterisk: true
    },
    {
      rate: '7.99%*',
      title: 'Home Loan',
      subtitle: 'Starting Rate',
      hasAsterisk: true
    },
    {
      rate: '9.98%*',
      title: 'Personal Loan',
      subtitle: 'Starting Rate',
      hasAsterisk: true
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Rates & Charges</h1>
          <p className="text-lg md:text-xl text-gray-600">Transparent and competitive rates</p>
        </div>

        {/* Rate Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {rates.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-teal-300 transform hover:-translate-y-1"
              >
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-3">
                  {item.rate}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </div>
                <div className="text-sm text-gray-500">
                  {item.subtitle}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Information</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-semibold">*</span> Rates are subject to change based on market conditions and individual eligibility.
              </p>
              <p>
                <span className="font-semibold">Fixed Deposits:</span> Rates mentioned are for deposits of 1 year and above. Rates may vary for different tenures.
              </p>
              <p>
                <span className="font-semibold">Savings Account:</span> Interest is calculated on daily balance and credited quarterly.
              </p>
              <p>
                <span className="font-semibold">Loans:</span> Interest rates are starting rates and may vary based on credit profile, loan amount, and tenure. Processing fees and other charges may apply.
              </p>
              <p className="text-sm text-gray-500 mt-6">
                For detailed terms and conditions, please contact our customer service or visit your nearest branch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RatesCharges

