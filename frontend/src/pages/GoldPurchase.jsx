import React, { useState } from 'react'

const PriceCard = ({ title, price, unit }) => (
  <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-white rounded-lg p-4 shadow-md">
    <div className="text-sm opacity-90">{title}</div>
    <div className="text-2xl font-bold">{price} {unit}</div>
  </div>
)

const GoldPurchase = () => {
  const [mode, setMode] = useState('buy') // buy or sell
  const [grams, setGrams] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank')
  // sample prices in INR per gram
  const goldPricePerGram = 6200 // INR per gram (sample)
  const silverPricePerGram = 70 // INR per gram (sample)

  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)
    } catch (e) {
      return `₹ ${Number(value).toFixed(2)}`
    }
  }

  const total = () => {
    const g = parseFloat(grams) || 0
    return (g * goldPricePerGram)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!grams || parseFloat(grams) <= 0) {
      alert('Enter a valid weight in grams')
      return
    }
    alert(`${mode === 'buy' ? 'Buy' : 'Sell'} request submitted: ${grams} g (~ ${formatCurrency(total())}) via ${paymentMethod}`)
    setGrams('')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <PriceCard title="Gold" price={goldPricePerGram} unit="INR" />
        <PriceCard title="Silver" price={silverPricePerGram} unit="INR" />
      </div>

      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Gold Purchase</h2>
          <div className="space-x-2">
            <button onClick={() => setMode('buy')} className={`px-3 py-1 rounded ${mode==='buy' ? 'bg-yellow-600 text-white' : 'bg-gray-100'}`}>Buy</button>
            <button onClick={() => setMode('sell')} className={`px-3 py-1 rounded ${mode==='sell' ? 'bg-yellow-600 text-white' : 'bg-gray-100'}`}>Sell</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (grams)</label>
            <input type="number" step="0.01" value={grams} onChange={(e) => setGrams(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" placeholder="e.g. 10" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2">
              <option value="bank">Bank Transfer</option>
              <option value="card">Card (Debit/Credit)</option>
              <option value="wallet">Digital Wallet</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-gray-600">Estimated Total</div>
            <div className="text-xl font-bold">{formatCurrency(total())}</div>
          </div>

          <div>
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded">{mode === 'buy' ? 'Buy Now' : 'Sell Now'}</button>
          </div>
        </form>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="p-3 border rounded text-center">
            <div className="font-semibold">Easy Gold & Silver Transaction</div>
          </div>
          <div className="p-3 border rounded text-center">
            <div className="font-semibold">Redeem Online & Offline</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoldPurchase

