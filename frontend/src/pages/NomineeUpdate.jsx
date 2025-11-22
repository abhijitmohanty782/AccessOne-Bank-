import React, { useState } from 'react';

const NomineeUpdate = () => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineeAge: '',
    nomineeAddress: '',
    nomineePhone: '',
    nomineeEmail: '',
    nomineeAadhaar: '',
    nomineeShare: '100',
    declaration: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API
    console.log('Nominee Update Form Data:', formData);
    alert('Nominee update request submitted successfully!');
    // Reset form
    setFormData({
      accountNumber: '',
      nomineeName: '',
      nomineeRelation: '',
      nomineeAge: '',
      nomineeAddress: '',
      nomineePhone: '',
      nomineeEmail: '',
      nomineeAadhaar: '',
      nomineeShare: '100',
      declaration: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Nominee Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                Account Number*
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.accountNumber}
                onChange={handleChange}
                pattern="[0-9]{9,18}"
                title="Please enter a valid account number (9-18 digits)"
              />
            </div>

            <div>
              <label htmlFor="nomineeName" className="block text-sm font-medium text-gray-700">
                Nominee Full Name*
              </label>
              <input
                type="text"
                id="nomineeName"
                name="nomineeName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.nomineeName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="nomineeRelation" className="block text-sm font-medium text-gray-700">
                Relationship with Nominee*
              </label>
              <select
                id="nomineeRelation"
                name="nomineeRelation"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.nomineeRelation}
                onChange={handleChange}
              >
                <option value="">Select Relationship</option>
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="nomineeAge" className="block text-sm font-medium text-gray-700">
                Nominee Age*
              </label>
              <input
                type="number"
                id="nomineeAge"
                name="nomineeAge"
                required
                min="1"
                max="120"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.nomineeAge}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="nomineeAddress" className="block text-sm font-medium text-gray-700">
                Nominee Address*
              </label>
              <textarea
                id="nomineeAddress"
                name="nomineeAddress"
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.nomineeAddress}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="nomineePhone" className="block text-sm font-medium text-gray-700">
                Nominee Phone Number*
              </label>
              <input
                type="tel"
                id="nomineePhone"
                name="nomineePhone"
                required
                pattern="[0-9]{10}"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.nomineePhone}
                onChange={handleChange}
                title="Please enter a 10-digit phone number"
              />
            </div>

            <div>
              <label htmlFor="nomineeEmail" className="block text-sm font-medium text-gray-700">
                Nominee Email
              </label>
              <input
                type="email"
                id="nomineeEmail"
                name="nomineeEmail"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.nomineeEmail}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="nomineeAadhaar" className="block text-sm font-medium text-gray-700">
                Nominee Aadhaar Number*
              </label>
              <input
                type="text"
                id="nomineeAadhaar"
                name="nomineeAadhaar"
                required
                pattern="[0-9]{12}"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.nomineeAadhaar}
                onChange={handleChange}
                title="Please enter a valid 12-digit Aadhaar number"
              />
            </div>

            <div>
              <label htmlFor="nomineeShare" className="block text-sm font-medium text-gray-700">
                Share Percentage*
              </label>
              <input
                type="number"
                id="nomineeShare"
                name="nomineeShare"
                required
                min="1"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={formData.nomineeShare}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="declaration"
                  name="declaration"
                  required
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={formData.declaration}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="declaration" className="font-medium text-gray-700">
                  Declaration
                </label>
                <p className="text-gray-500">
                  I hereby declare that the information provided is true and correct to the best of my knowledge.
                </p>
              </div>
            </div>

            <div className="py-3">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Nominee Update Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NomineeUpdate;
