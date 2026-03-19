// src/pages/CreditLedger.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function CreditLedger() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDebts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('is_credit', true)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching debts:', error);
    else setDebts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleMarkAsPaid = async (id) => {
    if (!window.confirm('Confirm this debt has been paid?')) return;

    const { error } = await supabase
      .from('transactions')
      .update({ is_credit: false, status: 'paid' })
      .eq('id', id);

    if (error) alert('Error updating record');
    else fetchDebts(); // Refresh list to remove the paid debt
  };

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Credit / Debt Ledger</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-red-50 border-b border-red-100">
            <tr>
              <th className="p-4 text-xs font-bold text-red-700 uppercase">Date</th>
              <th className="p-4 text-xs font-bold text-red-700 uppercase">Customer</th>
              <th className="p-4 text-xs font-bold text-red-700 uppercase">Phone</th>
              <th className="p-4 text-xs font-bold text-red-700 uppercase">Amount Due</th>
              <th className="p-4 text-xs font-bold text-red-700 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">Loading debts...</td></tr>
            ) : debts.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-green-500 font-medium">No outstanding debts!</td></tr>
            ) : (
              debts.map((debt) => (
                <tr key={debt.id} className="hover:bg-red-50/30">
                  <td className="p-4 text-sm text-gray-600">{new Date(debt.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-sm font-medium text-gray-900">{debt.customer_name}</td>
                  <td className="p-4 text-sm text-gray-600">{debt.customer_phone || 'N/A'}</td>
                  <td className="p-4 text-sm font-bold text-red-600">${Number(debt.total_amount).toFixed(2)}</td>
                  <td className="p-4 text-sm text-right">
                    <button 
                      onClick={() => handleMarkAsPaid(debt.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                    >
                      Mark Paid
                    </button>
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