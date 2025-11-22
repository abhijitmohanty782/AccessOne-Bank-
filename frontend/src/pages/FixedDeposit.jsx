import React, { useState, useEffect } from 'react';

const FDCard = ({ purpose, amount, interest, maturityDate }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center border border-gray-200 hover:border-blue-400 transition-all duration-200">
    <div>
      <p className="font-semibold text-gray-800">{purpose}</p>
      <p className="text-xs text-gray-500">Matures on {maturityDate}</p>
    </div>
    <div className="text-right">
      <p className="text-lg font-bold text-blue-600">₹{amount.toLocaleString('en-IN')}</p>
      <p className="text-xs text-gray-500">{interest}% p.a.</p>
    </div>
  </div>
);

const FixedDeposit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [fixedDeposits, setFixedDeposits] = useState(() => {
    try {
      const raw = localStorage.getItem('fixedDeposits');
      return raw ? JSON.parse(raw) : [
        { id: 1, purpose: "Children's Education", amount: 50000, interest: 6.5, maturityDate: '25 Oct 2028' },
        { id: 2, purpose: 'Retirement Fund', amount: 125000, interest: 6.8, maturityDate: '10 Jan 2035' },
      ];
    } catch (err) {
      console.warn('Failed to parse fixedDeposits from localStorage, using defaults', err);
      return [
        { id: 1, purpose: "Children's Education", amount: 50000, interest: 6.5, maturityDate: '25 Oct 2028' },
        { id: 2, purpose: 'Retirement Fund', amount: 125000, interest: 6.8, maturityDate: '10 Jan 2035' },
      ];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fixedDeposits', JSON.stringify(fixedDeposits));
    } catch (err) {
      console.warn('Failed to save fixedDeposits to localStorage', err);
    }
  }, [fixedDeposits]);

  const handleAddFD = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!purpose.trim()) {
      alert('Purpose is required');
      return;
    }
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    if (!account) {
      alert('Please select an account');
      return;
    }

    const newFD = {
      id: fixedDeposits.length ? Math.max(...fixedDeposits.map(f => f.id)) + 1 : 1,
      purpose: purpose.trim(),
      amount: numericAmount,
      interest: 6.2,
      maturityDate: '15 Nov 2027',
    };

    setFixedDeposits(prev => [...prev, newFD]);
    setPurpose('');
    setAmount('');
    setAccount('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-8 text-blue-700 text-center">Atinction Bank</h2>
        <nav className="space-y-4 text-center">
          {/* Only Fixed Deposit stays */}
          <a
            href="#"
            className="block font-medium text-white bg-blue-600 rounded-md px-3 py-2 hover:bg-blue-700 transition-all"
          >
            💰 Fixed Deposit
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Fixed Deposits</h1>
        <div className="grid gap-4">
          {fixedDeposits.map(fd => (
            <FDCard key={fd.id} {...fd} />
          ))}

          {/* Add New FD button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex justify-center items-center hover:bg-gray-50 hover:border-blue-500 transition-all"
          >
            <span className="text-3xl text-blue-500 mr-2">+</span>
            <span className="text-lg font-semibold text-gray-600">Add New Fixed Deposit</span>
          </button>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md m-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-blue-600 text-2xl font-bold hover:text-blue-700"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Apply New Fixed Deposit</h2>
            <p className="text-sm text-gray-500 mb-6">
              Get per day <strong>0.1%</strong> interest by <strong>Atinction Bank</strong>
            </p>

            <form onSubmit={handleAddFD} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="purpose">
                  Purpose
                </label>
                <input
                  id="purpose"
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Enter FD Purpose..."
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="amount">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="account">
                  Account
                </label>
                <select
                  id="account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Account</option>
                  <option value="savings">Savings Account (**** 1234)</option>
                  <option value="current">Current Account (**** 5678)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Add Fixed Deposit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedDeposit;

