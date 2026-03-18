// src/pages/Transactions.jsx
export default function Transactions() {
  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Complete history of all sales.</p>
        </div>
        <input 
          type="text" 
          placeholder="Search by customer name..." 
          className="w-64 p-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Static Row */}
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="p-4 text-sm text-gray-500">2026-03-18 14:30</td>
              <td className="p-4 text-sm font-medium text-gray-900">Ahmed Hassan</td>
              <td className="p-4 text-sm text-gray-500">Paracetamol x2, Cough Syrup x1</td>
              <td className="p-4 text-sm text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">Zaad Dollar</span>
              </td>
              <td className="p-4 text-sm">
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Paid</span>
              </td>
              <td className="p-4 text-sm font-bold text-gray-900 text-right">$13.50</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}