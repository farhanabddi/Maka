// src/pages/Products.jsx
export default function Products() {
  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm">+ Add Item</button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden min-h-[400px] flex flex-col">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Item Name</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* NO DATA STATE */}
            <tr>
              <td colSpan="4" className="py-20 text-center text-gray-400">
                <p className="font-medium">No products found</p>
                <p className="text-xs">Items you add will appear here.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}