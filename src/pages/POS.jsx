// src/pages/POS.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function POS() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [cart, setCart] = useState([]);
  const [isCredit, setIsCredit] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash Dollar');
  const [loading, setLoading] = useState(false);

  // 1. FETCH REAL PRODUCTS FROM SUPABASE
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. INSTANT SEARCH FILTERING
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. ADD TO CART LOGIC (UPDATED WITH STOCK CHECKS)
  const addToCart = (product) => {
    const currentStock = product.stock || 0;
    
    // Prevent adding if stock is 0
    if (currentStock <= 0) {
      return alert("This product is out of stock!");
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      // Prevent adding more than what we have in stock
      if (existingItem.quantity >= currentStock) {
        return alert(`Cannot add more! Only ${currentStock} left in stock.`);
      }
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, cartPrice: '' }]);
    }
  };

  const updateCartPrice = (id, newPrice) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, cartPrice: newPrice } : item
    ));
  };

  // UPDATED WITH MAX STOCK LIMIT CHECK
  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        const maxStock = item.stock || 0;
        
        // Prevent increasing past max stock
        if (newQuantity > maxStock) {
          alert(`Maximum stock reached! Only ${maxStock} available.`);
          return item;
        }
        
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // 4. COMPLETE SALE & DEDUCT INVENTORY
  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    if (isCredit && !customerName) return alert("Customer Name is required for credit sales.");
    
    const missingPrices = cart.some(item => item.cartPrice === '' || Number(item.cartPrice) < 0);
    if (missingPrices) return alert('Please enter a price for all items in the cart.');
    
    setLoading(true);
    
    const totalAmount = cart.reduce((sum, item) => sum + (Number(item.cartPrice) * item.quantity), 0);

    // Save the main transaction
    const { data: transaction, error: txnError } = await supabase
      .from('transactions')
      .insert([{
        customer_name: customerName || 'Walk-in Customer',
        customer_phone: customerPhone || null,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        is_credit: isCredit,
        status: isCredit ? 'unpaid' : 'paid'
      }])
      .select()
      .single();

    if (txnError) {
      console.error(txnError);
      alert("Error saving transaction");
      setLoading(false); 
      return;
    }

    // Save the transaction items
    const transactionItems = cart.map(item => ({
      transaction_id: transaction.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_sale: Number(item.cartPrice)
    }));

    const { error: itemsError } = await supabase
      .from('transaction_items')
      .insert(transactionItems);

    if (itemsError) console.error("Error saving items:", itemsError);

    // Deduct the sold quantity from the products inventory
    const stockUpdatePromises = cart.map(item => {
      const newStock = Math.max(0, (item.stock || 0) - item.quantity);
      return supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', item.id);
    });

    try {
      await Promise.all(stockUpdatePromises);
    } catch (stockError) {
      console.error("Error updating inventory stock:", stockError);
    }

    // Reset UI and re-enable button
    setCart([]);
    setIsCredit(false);
    setCustomerName('');
    setCustomerPhone('');
    setPaymentMethod('Cash Dollar');
    setSearchTerm(''); 
    
    // Refresh products to show updated stock numbers immediately
    fetchProducts();
    setLoading(false); 
    
    alert("Sale Completed Successfully!");
  };

  return (
    <div className="flex h-full gap-6 max-w-7xl mx-auto">
      {/* LEFT: Search & Item Selection */}
      <div className="flex-1 flex flex-col gap-4">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search medicines or services..." 
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">
              {searchTerm ? 'No products match your search.' : 'No products found. Add some in the Inventory page.'}
            </div>
          ) : (
            filteredProducts.map(item => {
              const outOfStock = (item.stock || 0) <= 0;
              
              return (
                <div key={item.id} className={`bg-white p-4 rounded-xl border ${outOfStock ? 'border-red-200 opacity-75' : 'border-gray-200'} shadow-sm flex flex-col justify-between`}>
                  <div>
                    <h3 className={`font-semibold mb-1 ${outOfStock ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{item.name}</h3>
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full mb-3">
                      {item.type || 'Product'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-sm font-medium text-gray-500">
                      Stock: <span className={outOfStock ? "text-red-600 font-bold" : "text-green-600"}>{item.stock || 0}</span>
                    </span>
                    <button 
                      disabled={outOfStock}
                      onClick={() => addToCart(item)}
                      className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        outOfStock 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {outOfStock ? 'Out of Stock' : 'Add'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: Cart Interface */}
      <div className="w-[450px] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Cart</h2>
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <input 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer Name" 
            className="w-full p-2.5 border border-gray-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50" 
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">Cart is empty</div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 text-sm truncate pr-2 flex-1">{item.name}</span>
                  <div className="flex items-center gap-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-white border border-gray-200 rounded-md h-8">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-2 text-gray-500 hover:text-gray-800 transition-colors">-</button>
                      <span className="px-2 text-sm font-medium text-gray-700 min-w-[20px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-2 text-gray-500 hover:text-gray-800 transition-colors">+</button>
                    </div>
                    {/* Total Item Price */}
                    <span className="font-bold text-gray-900 w-16 text-right text-sm">
                      ${(Number(item.cartPrice || 0) * item.quantity).toFixed(2)}
                    </span>
                    {/* Remove Button */}
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Custom Price Input */}
                <div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price"
                    value={item.cartPrice}
                    onChange={(e) => updateCartPrice(item.id, e.target.value)}
                    className="w-24 p-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <span className="text-sm text-gray-500">Grand Total</span>
            <span className="text-3xl font-black text-gray-900">
               ${cart.reduce((sum, item) => sum + (Number(item.cartPrice || 0) * item.quantity), 0).toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Payment Method</label>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-md text-sm outline-none bg-white"
            >
              <option value="Zaad Dollar">Zaad Dollar</option>
              <option value="Zaad Cash">Zaad Cash</option>
              <option value="E-Dahab Dollar">E-Dahab Dollar</option>
              <option value="E-Dahab Cash">E-Dahab Cash</option>
              <option value="Cash Dollar">Cash Dollar</option>
              <option value="Cash Shillling">Cash Shillling</option>
              <option value="Account">Account</option>
            </select>
          </div>

          <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex justify-between items-center">
            <span className="text-sm text-red-700 font-bold">Mark as Credit (Debt)</span>
            <input 
              type="checkbox" 
              checked={isCredit} 
              onChange={() => setIsCredit(!isCredit)} 
              className="w-5 h-5 accent-red-600"
            />
          </div>

          {isCredit && (
            <input 
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Customer Phone Number" 
              className="w-full p-2 border border-red-200 rounded-md text-sm outline-none bg-white" 
            />
          )}

          <button 
            disabled={cart.length === 0 || loading}
            onClick={handleCompleteSale}
            className={`w-full py-4 mt-2 rounded-xl font-black text-white transition-all duration-200 text-lg uppercase tracking-wide shadow-md flex justify-center items-center gap-2 ${
              cart.length > 0 && !loading 
                ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg active:scale-95' 
                : 'bg-gray-400 cursor-not-allowed opacity-75'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Sale...
              </>
            ) : (
              'Complete Sale'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}