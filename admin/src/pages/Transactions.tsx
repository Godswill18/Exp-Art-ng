import { CreditCard } from "lucide-react";

/**
 * The backend does not expose a transactions endpoint yet, so this page
 * deliberately shows no records instead of sample data.
 * Required contract: docs/BACKEND_REQUIREMENTS.md ("Transactions").
 */
export default function Transactions() {
  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-emerald-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center max-w-2xl">
        <CreditCard className="w-10 h-10 text-gray-400 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900">No payment data available</h2>
        <p className="text-sm text-gray-600 mt-2">
          Online ticket payments are not enabled, so there are no transactions to display. This page
          will list real transactions once the backend payment API is connected.
        </p>
      </div>
    </div>
  );
}
