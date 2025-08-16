import React, { useEffect } from "react";
import { Users, DollarSign, Activity, Calendar, TrendingUp } from "lucide-react";
import { mockTransactions, mockEvents } from "../data/mockData";
import { useAuthStore } from "@/context/AuthContext";

export default function Dashboard() {
 
  const { getUser, user, isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    // Only fetch if not already authenticated
    if (!isAuthenticated && !loading) {
      getUser().catch((err) => console.error("Failed to fetch user:", err));
    }
  }, [isAuthenticated, loading, getUser]);

  // console.log("User:" , user);

  const totalRevenue = mockTransactions
    .filter(t => t.status === "Success")
    .reduce((sum, t) => sum + t.amount, 0);

  const successRate =
    (mockTransactions.filter(t => t.status === "Success").length / mockTransactions.length) * 100;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Success":
        return "px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full";
      case "Pending":
        return "px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full";
      case "Failed":
        return "px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full";
      default:
        return "";
    }
  };

  return (
    <div className=" sm:p-6 lg:p-8 max-w-8xl mx-auto">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <MetricCard
          icon={<Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />}
          title="Total Users"
          value="1,234"
          growth="+12% from last month"
          bgColor="bg-blue-100"
        />
        <MetricCard
          icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />}
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          growth="+8% from last month"
          bgColor="bg-green-100"
        />
        <MetricCard
          icon={<Activity className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />}
          title="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          growth="+3% from last month"
          bgColor="bg-indigo-100"
        />
        <MetricCard
          icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />}
          title="Active Events"
          value={mockEvents.length}
          growth="+2 new this week"
          bgColor="bg-amber-100"
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTransactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.user}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(transaction.status)}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-gray-200">
          {mockTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="p-4 flex flex-col gap-2 hover:bg-gray-50">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900">Transaction</span>
                <span className="text-sm text-gray-900">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">User</span>
                <span className="text-sm text-gray-500">{transaction.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Amount</span>
                <span className="text-sm text-gray-900">${transaction.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <span className={getStatusBadge(transaction.status)}>{transaction.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  growth,
  bgColor,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-200 flex flex-col justify-between">
      <div className="flex items-center">
        <div className={`p-2 sm:p-3 ${bgColor} rounded-lg`}>{icon}</div>
        <div className="ml-3 sm:ml-4">
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-green-600">
        <TrendingUp className="w-4 h-4 mr-1" /> {growth}
      </div>
    </div>
  );
}
