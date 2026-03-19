// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { DollarSign, CreditCard, TrendingDown, PackageOpen } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalSales: 0, pendingCredit: 0, totalExpenses: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Fetch Paid Sales
      const { data: sales } = await supabase.from('transactions').select('total_amount').eq('status', 'paid');
      const totalSales = sales?.reduce((sum, item) => sum + Number(item.total_amount), 0) || 0;

      // Fetch Unpaid Credit
      const { data: credit } = await supabase.from('transactions').select('total_amount').eq('is_credit', true);
      const pendingCredit = credit?.reduce((sum, item) => sum + Number(item.total_amount), 0) || 0;

      // Fetch Expenses
      const { data: expenses } = await supabase.from('expenses').select('amount');
      const totalExpenses = expenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

      // Fetch Low Stock Products (< 10 items)
      const { data: products } = await supabase.from('products').select('id').lt('stock', 10);
      const lowStock = products?.length || 0;

      setStats({ totalSales, pendingCredit, totalExpenses, lowStock });
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : value}</h3>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pharmacy Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Paid Sales" 
          value={`$${stats.totalSales.toFixed(2)}`} 
          icon={<DollarSign size={24} className="text-green-600" />} 
          color="bg-green-100" 
        />
        <StatCard 
          title="Pending Credit" 
          value={`$${stats.pendingCredit.toFixed(2)}`} 
          icon={<CreditCard size={24} className="text-blue-600" />} 
          color="bg-blue-100" 
        />
        <StatCard 
          title="Total Expenses" 
          value={`$${stats.totalExpenses.toFixed(2)}`} 
          icon={<TrendingDown size={24} className="text-red-600" />} 
          color="bg-red-100" 
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={stats.lowStock} 
          icon={<PackageOpen size={24} className="text-orange-600" />} 
          color="bg-orange-100" 
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
           {/* These will use React Router links in a full build, but act as visual guides here */}
           <a href="/pos" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Open POS Register</a>
           <a href="/inventory" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">Add New Product</a>
        </div>
      </div>
    </div>
  );
}