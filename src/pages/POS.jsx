// src/pages/POS.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function POS() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // NEW: Search state
  const [cart, setCart] = useState([]);
  const [isCredit, setIsCredit] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
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
  // This filters the products in milliseconds without hitting the database again
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. ADD TO CART LOGIC (Ignores stock if type is 'Service')
  const addToCart = (product) => {
    const isService = product.type === 'Service';

    if (!isService && product.stock <= 0) {
      alert("Out of stock!");
      return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (!isService && existingItem.quantity >= product.stock) {
         alert("Cannot add more than available stock!");
         return;
      }
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // 4. COMPLETE SALE
  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    if (isCredit && !customerName) return alert("Customer Name is required for credit sales.");
    
    // INSTANTLY DISABLE THE BUTTON
    setLoading(true);
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
      setLoading(false); // Re-enable if there is an error
      return;
    }

    const transactionItems = cart.map(item => ({
      transaction_id: transaction.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_sale: item.price
    }));

    const { error: itemsError } = await supabase
      .from('transaction_items')
      .insert(transactionItems);

    if (itemsError) console.error("Error saving items:", itemsError);

    // Update the stock ONLY if the item is not a Service
    for (const item of cart) {
      if (item.type !== 'Service') {
        await supabase
          .from('products')
          .update({ stock: item.stock - item.quantity })
          .eq('id', item.id);
      }
    }

    // Reset UI and re-enable button
    setCart([]);
    setIsCredit(false);
    setCustomerName('');
    setCustomerPhone('');
    setPaymentMethod('Cash');
    setSearchTerm(''); // Clear the search bar
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
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">
              {searchTerm ? 'No products match your search.' : 'No products found. Add some in the Inventory page.'}
            </div>
          ) : (
            filteredProducts.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                    <span className="text-blue-600 font-bold text-lg">${Number(item.price).toFixed(2)}</span>
                  </div>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-full font-medium uppercase">{item.type}</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-xs font-bold ${item.type === 'Service' ? 'text-blue-500' : item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {item.type === 'Service' ? 'Unlimited' : `Stock: ${item.stock}`}
                  </span>
                  <button 
                    onClick={() => addToCart(item)}
                    disabled={item.type !== 'Service' && item.stock <= 0}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Cart Interface */}
      <div className="w-[400px] bg-white rounded-xl border shadow-sm flex flex-col flex-shrink-0">
        <div className="p-4 border-b bg-gray-50 rounded-t-xl">
          <h2 className="text-lg font-bold text-gray-900">Current Sale</h2>
          <input 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer Name (Optional)" 
            className="w-full mt-3 p-2 border border-gray-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white" 
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">Cart is empty</div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-xs text-gray-500">${Number(item.price).toFixed(2)} x {item.quantity}</span>
                </div>
                <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <span className="text-sm text-gray-500">Grand Total</span>
            <span className="text-3xl font-black text-gray-900">
               ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Payment Method</label>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-md text-sm outline-none bg-white"
            >
             <option value="Zaad Dollar ">Zaad Dollar</option>
              <option value="Zaad Cash ">Zaad Cash</option>
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