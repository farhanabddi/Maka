// src/pages/Expenses.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
    if (!error) setExpenses(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if(!desc || !amt) return;

    const { error } = await supabase.from('expenses').insert([{ description: desc, amount: parseFloat(amt) }]);
    if (error) alert("Failed to add expense");
    else {
      setDesc('');
      setAmt('');
      fetchExpenses();
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Operating Expenses</h1>
      
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500">Description</label>
          <input required value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full mt-1 p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Electricity Bill" />
        </div>
        <div className="w-40">
          <label className="text-xs font-bold text-gray-500">Amount ($)</label>
          <input required type="number" step="0.01" value={amt} onChange={(e) => setAmt(e.target.value)} className="w-full mt-1 p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">Add Expense</button>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {loading ? <tr><td colSpan="3" className="p-8 text-center text-gray-400">Loading...</td></tr> 
             : expenses.length === 0 ? <tr><td colSpan="3" className="p-8 text-center text-gray-400">No expenses recorded.</td></tr>
             : expenses.map(exp => (
               <tr key={exp.id}>
                 <td className="p-4 text-sm text-gray-600">{new Date(exp.created_at).toLocaleDateString()}</td>
                 <td className="p-4 text-sm font-medium">{exp.description}</td>
                 <td className="p-4 text-sm font-bold text-red-600 text-right">${Number(exp.amount).toFixed(2)}</td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}