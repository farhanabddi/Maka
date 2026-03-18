// src/pages/POS.jsx
import { useState } from 'react';

export default function POS() {
  // Temporary local state for prototype interaction
  const [cart, setCart] = useState([]);
  const [isCredit, setIsCredit] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Mock available products (Just for UI testing "Add" button)
  const availableItems = [
    { id: 1, name: 'Amoxicillin 500mg', price: 5.00, stock: 50, type: 'Medicine' },
    { id: 2, name: 'Blood Pressure Check', price: 2.00, stock: null, type: 'Service' },
  ];

  const addToCart = (item) => {
    setCart([...cart, { ...item, quantity: 1 }]);
  };

  const resetSale = () => {
    setCart([]);
    setIsCredit(false);
    setCustomerName('');
    setCustomerPhone('');
    alert("Sale Processed (UI Only)");
  };

  return (
    <div className="flex h-full gap-6 max-w-7xl mx-auto">
      {/* LEFT: Search & Item Selection */}
      <div className="flex-1 flex flex-col gap-4">
        <input type="text" placeholder="Search..." className="w-full p-3 border rounded-lg" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex justify-between font-bold">
                <span>{item.name}</span>
                <span className="text-blue-600">${item.price.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => addToCart(item)}
                className="w-full mt-4 bg-blue-500 text-white py-1.5 rounded-md text-sm hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Cart Interface */}
      <div className="w-[400px] bg-white rounded-xl border shadow-sm flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Cart</h2>
          <input 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer Name" 
            className="w-full mt-2 p-2 border rounded text-sm" 
          />
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">Cart is empty</div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm border-b pb-2">
                <span>{item.name} x1</span>
                <span className="font-bold">${item.price.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        {/* Checkout Logic */}
        <div className="p-4 border-t bg-gray-50 rounded-b-xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Grand Total</span>
            <span className="text-2xl font-bold text-gray-900">
               ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </span>
          </div>

          {/* Credit Toggle Interaction */}
          <div className="flex justify-between items-center p-2 bg-white border rounded">
            <span className="text-sm font-medium">Credit Sale?</span>
            <input 
              type="checkbox" 
              checked={isCredit} 
              onChange={() => setIsCredit(!isCredit)} 
              className="w-5 h-5 accent-blue-500"
            />
          </div>

          {isCredit && (
            <input 
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Customer Phone (Required)" 
              className="w-full p-2 border border-red-200 rounded text-sm bg-red-50" 
            />
          )}

          <button 
            disabled={cart.length === 0}
            onClick={resetSale}
            className={`w-full py-3 rounded-md font-bold text-white transition-all ${
              cart.length > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}