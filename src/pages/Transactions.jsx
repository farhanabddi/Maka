// src/pages/Transactions.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function Transactions() {
  const [transactionRows, setTransactionRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    
    // FETCH MAIN TXN, PLUS NESTED ITEMS, PLUS NESTED PRODUCT NAMES
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id, 
        created_at, 
        customer_name, 
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
      .limit(50); // Lowered limit slightly because 1 txn = multiple rows now

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      // FLATTEN THE DATA: Turn nested items into individual rows
      const flattenedRows = [];
      
      data.forEach((txn) => {
        // If the transaction has items, loop through them
        if (txn.transaction_items && txn.transaction_items.length > 0) {
          txn.transaction_items.forEach((item) => {
            flattenedRows.push({
              rowId: item.id, // Unique ID for React key
              txnId: txn.id,
              date: txn.created_at,
              customer: txn.customer_name || 'Walk-in',
              productName: item.products?.name || 'Deleted Product',
              productType: item.products?.type || 'Unknown',
              price: item.price_at_sale,
              qty: item.quantity,
              method: txn.payment_method,
              status: txn.status
            });
          });
        } else {
          // Fallback just in case a transaction is empty
          flattenedRows.push({
            rowId: txn.id,
            txnId: txn.id,
            date: txn.created_at,
            customer: txn.customer_name || 'Walk-in',
            productName: 'No Items Found',
            productType: '-',
            price: 0,
            qty: 0,
            method: txn.payment_method,
            status: txn.status
          });
        }
      });

      setTransactionRows(flattenedRows);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0 pb-10">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Showing itemized sales breakdown.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date & Time</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Product</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Qty x Price</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Method</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading itemized transactions...
                  </div>
                </td>
              </tr>
            ) : transactionRows.length === 0 ? (
              <tr><td colSpan="7" className="p-8 text-center text-gray-400">No sales recorded yet.</td></tr>
            ) : (
              transactionRows.map((row) => (
                <tr key={row.rowId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(row.date).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900 whitespace-nowrap">{row.customer}</td>
                  <td className="p-4 text-sm font-bold text-gray-900 whitespace-nowrap">{row.productName}</td>
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{row.productType}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-900 whitespace-nowrap">
                    {row.qty} x ${Number(row.price).toFixed(2)}
                  </td>
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {row.method}
                  </td>
                  <td className="p-4 text-sm whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      row.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {row.status}
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