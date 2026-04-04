// src/pages/Products.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State for adding new products
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Service'); // Default type
  const [newStock, setNewStock] = useState('');      // NEW: Stock state added back

  // 1. FETCH DATA FROM SUPABASE
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  // Run fetch when the component loads
  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. ADD DATA TO SUPABASE 
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!newName) return alert('Please enter a product name');

    const { error } = await supabase.from('products').insert([
      { 
        name: newName, 
        type: newType,   
        price: 0,        // Default hidden price
        // If they leave stock empty, default to 9999, otherwise use the number they typed
        stock: newStock === '' ? 9999 : parseInt(newStock) 
      }
    ]);

    if (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } else {
      // Reset form and refresh list
      setNewName('');
      setNewType('Service');
      setNewStock('');
      setShowForm(false);
      fetchProducts(); 
    }
  };

  // 3. EDIT STOCK IN SUPABASE (Restored exactly as you had it)
  const handleUpdateStock = async (id, currentStock, productName) => {
    const newStockStr = window.prompt(`Enter new stock quantity for ${productName}:`, currentStock);
    
    if (newStockStr === null || newStockStr.trim() === '') return;
    
    const newStockAmount = parseInt(newStockStr, 10);
    
    if (isNaN(newStockAmount) || newStockAmount < 0) {
      return alert('Please enter a valid positive number for the stock.');
    }

    const { error } = await supabase
      .from('products')
      .update({ stock: newStockAmount })
      .eq('id', id);

    if (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock.');
    } else {
      fetchProducts(); 
    }
  };

  // 4. DELETE DATA FROM SUPABASE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
    } else {
      fetchProducts(); 
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products & Services</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your open-price inventory, classifications, and stock.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add New Item'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form onSubmit={handleAddProduct} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-500 font-medium mb-1">Item Name</label>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              placeholder="e.g. Consultation, Paracetamol, Lab Test" 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>

          <div className="w-48">
            <label className="block text-xs text-gray-500 font-medium mb-1">Type Classification</label>
            <select 
              value={newType} 
              onChange={(e) => setNewType(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="Service">Service (e.g. Consult, Lab)</option>
              <option value="Medical">Medical / Drugs</option>
              <option value="Card">Card</option>
              <option value="Glasses">Glasses</option>
            </select>
          </div>

          <div className="w-24">
            <label className="block text-xs text-gray-500 font-medium mb-1">Stock</label>
            <input 
              type="number" 
              value={newStock} 
              onChange={(e) => setNewStock(e.target.value)} 
              placeholder="9999" 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md text-sm font-medium transition-colors">
            Save
          </button>
        </form>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase w-48">Type</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase w-32">Stock</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase text-right w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-400">Loading items...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-400">No items found. Add one above.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="p-4 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full font-medium uppercase tracking-wide">
                      {product.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">
                    {product.type === 'Service' ? '∞' : product.stock}
                  </td>
                  <td className="p-4 text-sm text-right space-x-4">
                    <button 
                      onClick={() => handleUpdateStock(product.id, product.stock, product.name)} 
                      className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                    >
                      Edit Stock
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)} 
                      className="text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Delete
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