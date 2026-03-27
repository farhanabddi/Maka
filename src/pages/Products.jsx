// src/pages/Products.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State for adding new products
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Tablet');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');

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
    
    if (!newName || !newPrice || !newStock) return alert('Please fill all fields');

    const { error } = await supabase.from('products').insert([
      { 
        name: newName, 
        type: newType, 
        price: parseFloat(newPrice), 
        stock: parseInt(newStock) 
      }
    ]);

    if (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } else {
      // Reset form and refresh list
      setNewName('');
      setNewPrice('');
      setNewStock('');
      setShowForm(false);
      fetchProducts(); 
    }
  };

  // 3. EDIT STOCK IN SUPABASE (NEW FUNCTION)
  const handleUpdateStock = async (id, currentStock, productName) => {
    // Open a quick prompt to ask for the new stock amount
    const newStockStr = window.prompt(`Enter new stock quantity for ${productName}:`, currentStock);
    
    // If the user clicks "Cancel" or leaves it empty, do nothing
    if (newStockStr === null || newStockStr.trim() === '') return;
    
    const newStock = parseInt(newStockStr, 10);
    
    // Validate that they entered a real number
    if (isNaN(newStock) || newStock < 0) {
      return alert('Please enter a valid positive number for the stock.');
    }

    // Update Supabase
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id);

    if (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock.');
    } else {
      fetchProducts(); // Refresh the list to show the updated stock
    }
  };

  // 4. DELETE DATA FROM SUPABASE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
    } else {
      fetchProducts(); // Refresh list
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your medicines and services inventory.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form onSubmit={handleAddProduct} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 font-medium mb-1">Name</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Paracetamol" className="w-full p-2 border rounded" required />
          </div>
          <div className="w-32">
            <label className="block text-xs text-gray-500 font-medium mb-1">Type</label>
            <select value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full p-2 border rounded bg-white">
              <option value="Card">Card</option>
              <option value="Drugs">Drugs</option>
              <option value="Glasses">Glasses</option>
              <option value="Service">Service</option>
            </select>
          </div>
          <div className="w-24">
            <label className="block text-xs text-gray-500 font-medium mb-1">Price ($)</label>
            <input type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="0.00" className="w-full p-2 border rounded" required />
          </div>
          <div className="w-24">
            <label className="block text-xs text-gray-500 font-medium mb-1">Stock</label>
            <input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="0" className="w-full p-2 border rounded" required />
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium">Save</button>
        </form>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">Loading products...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">No products found. Add one above.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="p-4 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">{product.type}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-900 font-medium">${product.price.toFixed(2)}</td>
                  <td className="p-4 text-sm text-gray-600">{product.stock}</td>
                  <td className="p-4 text-sm text-right space-x-4">
                    {/* NEW EDIT BUTTON */}
                    <button 
                      onClick={() => handleUpdateStock(product.id, product.stock, product.name)} 
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Edit Stock
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)} 
                      className="text-red-500 hover:text-red-700 font-medium"
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