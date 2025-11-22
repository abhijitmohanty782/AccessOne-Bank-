import React, { useState } from 'react'

const sampleTransactions = [
  { id: 1, date: '2025-10-20', desc: 'Coffee Shop', amount: -1.50 },
  { id: 2, date: '2025-10-18', desc: 'Grocery Store', amount: -23.75 },
  { id: 3, date: '2025-10-15', desc: 'Salary (Credit)', amount: 500.00 }
]

export default function CreditCardDetails() {
  const [isBlocked, setIsBlocked] = useState(false)
  const [dueAmount, setDueAmount] = useState(4525.00) // sample INR due
  const [payNowLoading, setPayNowLoading] = useState(false)

  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)
    } catch (e) {
      return `₹ ${Number(value).toFixed(2)}`
    }
  }

  const handleToggleBlock = () => {
    setIsBlocked(!isBlocked)
  }

  const handlePayNow = () => {
    if (dueAmount <= 0) {
      alert('No due amount')
      return
    }
    setPayNowLoading(true)
    setTimeout(() => {
      setDueAmount(0)
      setPayNowLoading(false)
      alert('Payment successful (mock)')
    }, 900)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">Credit Card</h2>
            <div className="text-sm text-gray-500">Platinum Rewards • •••• 4242</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Available Credit</div>
            <div className="text-2xl font-bold">{formatCurrency(195475)}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Current Due</div>
            <div className="font-semibold">{formatCurrency(dueAmount)}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Minimum Due</div>
            <div className="font-semibold">{formatCurrency(5)}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Statement Date</div>
            <div className="font-semibold">25 Oct 2025</div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={handlePayNow} disabled={payNowLoading} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-60">
            {payNowLoading ? 'Paying...' : 'Pay Now'}
          </button>
          <button onClick={handleToggleBlock} className={`px-4 py-2 rounded ${isBlocked ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
            {isBlocked ? 'Unblock Card' : 'Block Card'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
        <ul className="divide-y">
          {sampleTransactions.map(tx => (
            <li key={tx.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{tx.desc}</div>
                <div className="text-sm text-gray-500">{tx.date}</div>
              </div>
              <div className={`font-medium ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{tx.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

