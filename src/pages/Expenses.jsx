// src/pages/Expenses.jsx
import { useState } from 'react';

export default function Expenses() {
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');

  const handleAdd = () => {
    if(!desc || !amt) return;
    alert(`Expense logged: ${desc} - $${amt}`);
    setDesc('');
    setAmt('');
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Expenses</h1>
      
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-400">Description</label>
          <input 
            value={desc} onChange={(e) => setDesc(e.target.value)}
            className="w-full mt-1 p-2 border rounded" placeholder="What was bought?" 
          />
        </div>
        <div className="w-32">
          <label className="text-xs font-bold text-gray-400">Amount</label>
          <input 
            value={amt} onChange={(e) => setAmt(e.target.value)}
            className="w-full mt-1 p-2 border rounded" placeholder="0.00" 
          />
        </div>
        <button onClick={handleAdd} className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium">Add</button>
      </div>

      {/* Empty Ledger Table */}
      <div className="bg-white rounded-xl border p-20 text-center text-gray-400">
        No expense records found for this period.
      </div>
    </div>
  );
}