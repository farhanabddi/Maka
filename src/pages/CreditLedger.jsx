// src/pages/CreditLedger.jsx
export default function CreditLedger() {
  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Credit Ledger</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage customer debts.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Debt</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date Issued</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Static Row */}
            <tr className="hover:bg-gray-50/50 transition-colors items-center">
              <td className="p-4 text-sm font-medium text-gray-900">Ahmed Hassan</td>
              <td className="p-4 text-sm text-gray-500">+252-61-1234567</td>
              <td className="p-4 text-sm">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">$45.00</span>
              </td>
              <td className="p-4 text-sm text-gray-500">2026-03-15</td>
              <td className="p-4 text-sm text-right">
                <button className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded text-sm font-medium transition-colors">
                  Receive Payment
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}