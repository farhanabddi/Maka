// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { DollarSign, CreditCard, TrendingDown, PackageOpen, Wallet } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    todaySales: 0, 
    totalSales: 0, 
    pendingCredit: 0, 
    totalExpenses: 0, 
    lowStock: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // 1. Get the exact timestamp for midnight today
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      // 2. Fetch TODAY'S Paid Sales
      const { data: todayData } = await supabase
        .from('transactions')
        .select('total_amount')
        .eq('status', 'paid')
        .gte('created_at', startOfToday.toISOString());
      
      const todaySales = todayData?.reduce((sum, item) => sum + Number(item.total_amount), 0) || 0;

      // 3. Fetch ALL-TIME Paid Sales
      const { data: allSales } = await supabase
        .from('transactions')
        .select('total_amount')
        .eq('status', 'paid');
      
      const totalSales = allSales?.reduce((sum, item) => sum + Number(item.total_amount), 0) || 0;

      // 4. Fetch Unpaid Credit
      const { data: credit } = await supabase
        .from('transactions')
        .select('total_amount')
        .eq('is_credit', true);
      
      const pendingCredit = credit?.reduce((sum, item) => sum + Number(item.total_amount), 0) || 0;

      // 5. Fetch Expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount');
      
      const totalExpenses = expenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

      // 6. Fetch Low Stock Products (< 10 items)
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .lt('stock', 10);
      
      const lowStock = products?.length || 0;

      setStats({ todaySales, totalSales, pendingCredit, totalExpenses, lowStock });
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
    <div className="max-w-7xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pharmacy Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        
        {/* NEW: Today's Sales Card */}
        <StatCard 
          title="Today's Sales" 
          value={`$${stats.todaySales.toFixed(2)}`} 
          icon={<Wallet size={24} className="text-green-700" />} 
          color="bg-green-200 border border-green-300" 
        />

        <StatCard 
          title="All-Time Revenue" 
          value={`$${stats.totalSales.toFixed(2)}`} 
          icon={<DollarSign size={24} className="text-blue-600" />} 
          color="bg-blue-100" 
        />
        
        <StatCard 
          title="Pending Credit" 
          value={`$${stats.pendingCredit.toFixed(2)}`} 
          icon={<CreditCard size={24} className="text-orange-600" />} 
          color="bg-orange-100" 
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
          icon={<PackageOpen size={24} className="text-purple-600" />} 
          color="bg-purple-100" 
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
           {/* Replace with actual React Router <Link> components if you are using them */}
           <a href="/pos" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors">
             Open POS Register
           </a>
           <a href="/inventory" className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 border border-gray-200 transition-colors">
             Add New Product
           </a>
        </div>
      </div>
    </div>
  );
}