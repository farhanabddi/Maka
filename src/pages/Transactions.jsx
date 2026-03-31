// src/pages/Transactions.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. NEW STATE: Holds whatever the user types in the search box
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id, 
        created_at, 
        customer_name,
        total_amount,
        payment_method, 
        status,
        transaction_items (
          id, 
          price_at_sale, 
          quantity,
          products (
            name, 
            type
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100); // Bumped up slightly so search has more data to look through

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
    }
    
    setLoading(false);
  };

  // 2. NEW LOGIC: Filter the transactions before we show them
  const filteredTransactions = transactions.filter((txn) => {
    const term = searchTerm.toLowerCase();
    
    // Check main transaction details
    const customer = (txn.customer_name || 'Walk-in').toLowerCase();
    const method = (txn.payment_method || '').toLowerCase();
    const status = (txn.status || '').toLowerCase();
    
    // Check inside the nested items to see if a specific product was bought
    const hasMatchingProduct = txn.transaction_items?.some(item => 
      (item.products?.name || '').toLowerCase().includes(term) ||
      (item.products?.type || '').toLowerCase().includes(term)
    );

    // If ANY of these match what the user typed, show the row
    return customer.includes(term) || 
           method.includes(term) || 
           status.includes(term) || 
           hasMatchingProduct;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0 pb-10">
      
      {/* 3. NEW UI: Header and Search Bar aligned cleanly */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Showing all sales with grouped items.</p>
        </div>
        
        {/* Search Input Box */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* Magnifying Glass SVG */}
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search customer, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date & Time</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Products Purchased</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Amount</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Method</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading transactions...
                  </div>
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? ( // 4. CHANGED: Using filteredTransactions here
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  {searchTerm ? 'No matches found for your search.' : 'No sales recorded yet.'}
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => ( // 5. CHANGED: Mapping over filteredTransactions
                <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(txn.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {txn.customer_name || 'Walk-in'}
                  </td>
                  
                  <td className="p-4 text-sm text-gray-900">
                    <div className="flex flex-col gap-1.5">
                      {txn.transaction_items && txn.transaction_items.length > 0 ? (
                        txn.transaction_items.map(item => (
                          <div key={item.id} className="flex items-center gap-2">
                            <span className="font-bold text-xs">{item.quantity}x {item.products?.name || 'Unknown'}</span>
                            <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] font-medium">
                              {item.products?.type || '-'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-xs">No items</span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                    ${Number(txn.total_amount || 0).toFixed(2)}
                  </td>
                  
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {txn.payment_method}
                  </td>
                  <td className="p-4 text-sm whitespace-nowrap">
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