// src/pages/Transactions.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    
    // FETCHING WITH LIMIT FOR MAXIMUM SPEED
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // <--- HERE IS THE SPEED BOOST!

    if (error) console.error('Error fetching transactions:', error);
    else setTransactions(data || []);
    
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-sm text-gray-500 mt-1">Showing the 100 most recent sales.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading recent transactions...
                  </div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">No sales recorded yet.</td></tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(txn.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">{txn.customer_name || 'Walk-in'}</td>
                  <td className="p-4 text-sm font-bold text-gray-900">${Number(txn.total_amount).toFixed(2)}</td>
                  <td className="p-4 text-sm text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{txn.payment_method}</span>
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      txn.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}