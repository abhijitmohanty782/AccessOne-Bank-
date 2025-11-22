// export default Dashboard
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAccounts();
      fetchTransactions();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/user/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data.accounts || []);
    } catch (e) {
      setAccounts([]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.transactions || []);
    } catch (e) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white py-6 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center tracking-wide mb-2">
            Dashboard
          </h1>
          <p className="text-center font-bold text-gray-600 text-sm sm:text-base">
            Welcome back, {user?.name}
          </p>
          <div className="flex justify-center mt-2 mb-6">
            <div className="w-20 h-1 bg-gray-900 rounded-full"></div>
          </div>

          {/* <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Welcome back, {user?.name}
          </p> */}
        </div>

        {/* 🔹 Accounts Section (from ManageAccounts.jsx) */}
        <h2 className="text-xl font-semibold mb-3">Your Accounts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {accounts.map((acc) => (
            <div key={acc.account_number} className="card">
              <h3 className="font-semibold capitalize text-gray-900">
                {acc.account_type} Account
              </h3>
              <p className="text-sm text-gray-600 break-all">
                {acc.account_number}
              </p>
              <p className="font-medium text-teal-600 text-lg">
                ₹{acc.balance?.toLocaleString()}
              </p>
              {acc.business_name && (
                <p className="text-sm">Business: {acc.business_name}</p>
              )}
            </div>
          ))}
        </div>

        {/* 🔹 Recent Transactions (TransactionHistory.jsx table) */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No transactions yet</p>
              <p className="text-sm text-gray-400">
                Your transaction history will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mode
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.slice(0, 5).map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{formatDate(t.timestamp)}</td>
                      <td
                        className={`px-4 py-3 font-medium capitalize 
                        ${
                          t.type === "credit"
                            ? "text-green-600"
                            : t.type === "debit"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {t.type}
                      </td>
                      <td className="px-4 py-3">
                        {t.type === "debit" ? "-" : "+"}₹
                        {t.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{t.mode || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {transactions.length > 0 && (
            <p className="mt-4 text-center text-xs text-gray-500">
              Showing last {Math.min(transactions.length, 5)} of{" "}
              {transactions.length} transactions
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
