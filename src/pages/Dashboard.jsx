// src/pages/Dashboard.jsx

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here's today's overview.</p>
      </div>

      {/* Top Metric Cards - DUMB UI, Hardcoded to 0.00 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-sm text-gray-500 mb-1">Daily Revenue</span>
          <span className="text-3xl font-bold text-gray-900">$0.00</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-sm text-gray-500 mb-1">Daily Expenses</span>
          <span className="text-3xl font-bold text-gray-900">$0.00</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-sm text-gray-500 mb-1">Daily Credit Issued</span>
          <span className="text-3xl font-bold text-gray-900">$0.00</span>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-sm text-gray-500 mb-1">Total All-Time Revenue</span>
          <span className="text-3xl font-bold text-gray-900">$0.00</span>
        </div>

      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[300px] flex flex-col p-5">
        <h2 className="font-semibold text-gray-900">Recent Activity</h2>
        
        {/* Empty State Centered */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-gray-500">No recent activity to display.</p>
          <p className="text-xs text-gray-400 mt-1">Sales and transactions will appear here.</p>
        </div>
      </div>

    </div>
  );
}