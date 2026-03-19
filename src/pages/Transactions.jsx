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
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching transactions:', error);
    else setTransactions(data || []);
    
    setLoading(false);
  };

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Method</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">Loading transactions...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">No sales recorded yet.</td></tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50/50">
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(txn.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">{txn.customer_name || 'Walk-in'}</td>
                  <td className="p-4 text-sm font-bold text-gray-900">${Number(txn.total_amount).toFixed(2)}</td>
                  <td className="p-4 text-sm text-gray-600">{txn.payment_method}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      txn.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {txn.status.toUpperCase()}
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