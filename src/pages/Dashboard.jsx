// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { DollarSign, CreditCard, TrendingDown, PackageOpen, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom'; // Added for active linking

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

  // UPDATED: Added linkTo prop and hover effects for active linking
  const StatCard = ({ title, value, icon, color, linkTo }) => {
    const cardContent = (
      <div className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 h-full ${linkTo ? 'hover:shadow-md hover:border-blue-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer' : ''}`}>
        <div className={`p-4 rounded-lg ${color}`}>{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : value}</h3>
        </div>
      </div>
    );

    // If a link is provided, wrap the card in a Link component
    if (linkTo) {
      return (
        <Link to={linkTo} className="block outline-none">
          {cardContent}
        </Link>
      );
    }

    return cardContent;
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pharmacy Overview</h1>
      
      <div className="flex flex-col gap-6">
        {/* TOP ROW: Today's Sales, Pending Credit, Total Expenses (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Today's Sales" 
            value={`$${stats.todaySales.toFixed(2)}`} 
            icon={<Wallet size={24} className="text-green-700" />} 
            color="bg-green-200 border border-green-300" 
          />
          
          <StatCard 
            title="Pending Credit" 
            value={`$${stats.pendingCredit.toFixed(2)}`} 
            icon={<CreditCard size={24} className="text-orange-600" />} 
            color="bg-orange-100" 
            linkTo="/credit" // Active Link
          />
          
          <StatCard 
            title="Total Expenses" 
            value={`$${stats.totalExpenses.toFixed(2)}`} 
            icon={<TrendingDown size={24} className="text-red-600" />} 
            color="bg-red-100" 
            linkTo="/expenses" // Active Link
          />
        </div>

        {/* BOTTOM ROW: All-Time Revenue, Low Stock Alerts (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard 
            title="All-Time Revenue" 
            value={`$${stats.totalSales.toFixed(2)}`} 
            icon={<DollarSign size={24} className="text-blue-600" />} 
            color="bg-blue-100" 
          />
          
          <StatCard 
            title="Low Stock Alerts" 
            value={stats.lowStock} 
            icon={<PackageOpen size={24} className="text-purple-600" />} 
            color="bg-purple-100" 
            linkTo="/inventory" // Active Link (change to /products if your route is different)
          />
        </div>
      </div>
    </div>
  );
}