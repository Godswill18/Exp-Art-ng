import React, { useState } from "react";
import { mockTransactions } from "../data/mockData";
import { Transaction } from "../types";
import { Search, X } from "lucide-react";

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesSearch =
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toString().includes(search);
    const matchesStatus =
      statusFilter === "All" ? true : t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Search by user, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-auto border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="All">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="w-full text-left border border-gray-200 bg-black">
          <thead className="bg-black">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t: Transaction, idx) => (
              <tr
                key={t.id}
                onClick={() => setSelectedTransaction(t)}
                className={`cursor-pointer transition-colors ${
                  idx % 2 === 0 ? "bg-black" : "bg-black"
                } hover:bg-gray-500`}
              >
                <td className="p-3 border">{t.id}</td>
                <td className="p-3 border ">{t.user}</td>
                <td className="p-3 border">{t.email}</td>
                <td className="p-3 border font-medium text-green-500">
                  ${t.amount.toFixed(2)}
                </td>
                <td className="p-3 border">{t.date}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      t.status === "Success"
                        ? "bg-green-100 text-green-700"
                        : t.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No transactions found.
          </p>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {filteredTransactions.map((t: Transaction) => (
          <div
            key={t.id}
            onClick={() => setSelectedTransaction(t)}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white cursor-pointer hover:bg-blue-50 text-black"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{t.user}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  t.status === "Success"
                    ? "bg-green-100 text-green-700"
                    : t.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {t.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{t.email}</p>
            <p className="text-sm text-gray-600 mb-1">
              Amount:{" "}
              <span className="font-medium text-gray-800">
                ${t.amount.toFixed(2)}
              </span>
            </p>
            <p className="text-sm text-gray-600">Date: {t.date}</p>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No transactions found.
          </p>
        )}
      </div>

      {/* Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setSelectedTransaction(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
            <p><strong>ID:</strong> {selectedTransaction.id}</p>
            <p><strong>User:</strong> {selectedTransaction.user}</p>
            <p><strong>Email:</strong> {selectedTransaction.email}</p>
            <p><strong>Amount:</strong> ${selectedTransaction.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> {selectedTransaction.date}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  selectedTransaction.status === "Success"
                    ? "bg-green-100 text-green-700"
                    : selectedTransaction.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {selectedTransaction.status}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
