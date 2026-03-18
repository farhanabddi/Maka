// src/pages/Reports.jsx
export default function Reports() {
  return (
    <div className="max-w-6xl flex flex-col gap-6">
      
      {/* Header and Controls */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Financial summary for the selected period.</p>
        </div>
        <div className="flex gap-3 items-center">
          <input type="text" value="Mar 1, 2026" readOnly className="p-2 border border-gray-200 rounded-md text-sm w-32 text-center bg-white" />
          <span className="text-sm text-gray-500">to</span>
          <input type="text" value="Mar 18, 2026" readOnly className="p-2 border border-gray-200 rounded-md text-sm w-32 text-center bg-white" />
          <button className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors ml-2">
            Export to Word
          </button>
        </div>
      </div>

      {/* Grid for Inflow / Outflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Money In Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-green-600">Money In</h2>
          </div>
          <table className="w-full text-left border-collapse flex-1">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="p-4 text-xs font-medium uppercase tracking-wider">Source</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="p-4 text-sm text-gray-700">Cash Sales</td>
                <td className="p-4 text-sm text-green-600 font-medium text-right">$0.00</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="p-4 text-sm font-bold text-gray-900">Total</td>
                <td className="p-4 text-sm font-bold text-green-600 text-right">$0.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Money Out Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-red-600">Money Out</h2>
          </div>
          <table className="w-full text-left border-collapse flex-1">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="p-4 text-xs font-medium uppercase tracking-wider">Source</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="p-4 text-sm text-gray-700">Inventory Purchases</td>
                <td className="p-4 text-sm text-red-600 font-medium text-right">$0.00</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="p-4 text-sm font-bold text-gray-900">Total</td>
                <td className="p-4 text-sm font-bold text-red-600 text-right">$0.00</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* Net Profit Footer Bar */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center mt-2">
        <span className="text-lg font-bold text-gray-900">Net Profit</span>
        <span className="text-3xl font-bold text-green-600">$0.00</span>
      </div>

    </div>
  );
}