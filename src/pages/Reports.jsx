// src/pages/Reports.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Activity } from 'lucide-react';

export default function Reports() {
  const [timeframe, setTimeframe] = useState('today');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    revenue: 0,
    creditPending: 0,
    expenses: 0,
    netProfit: 0,
    salesCount: 0
  });

  // Helper function to get the start date based on the selected timeframe
  const getStartDate = (filter) => {
    const date = new Date();
    if (filter === 'today') {
      date.setHours(0, 0, 0, 0);
    } else if (filter === 'week') {
      date.setDate(date.getDate() - 7);
    } else if (filter === 'month') {
      date.setMonth(date.getMonth() - 1);
    } else if (filter === 'year') {
      date.setFullYear(date.getFullYear() - 1);
    }
    return date.toISOString();
  };

  const generateReport = async () => {
    setLoading(true);
    const startDate = getStartDate(timeframe);

    try {
      // 1. Fetch Transactions (Sales)
      const { data: transactions, error: txnError } = await supabase
        .from('transactions')
        .select('total_amount, status')
        .gte('created_at', startDate);

      if (txnError) throw txnError;

      // 2. Fetch Expenses (Costs)
      const { data: expenses, error: expError } = await supabase
        .from('expenses')
        .select('amount')
        .gte('created_at', startDate);

      if (expError) throw expError;

      // 3. Crunch the numbers
      let revenue = 0;
      let creditPending = 0;
      let totalExpenses = 0;

      transactions?.forEach(txn => {
        if (txn.status === 'paid') {
          revenue += Number(txn.total_amount);
        } else {
          creditPending += Number(txn.total_amount);
        }
      });

      expenses?.forEach(exp => {
        totalExpenses += Number(exp.amount);
      });

      const netProfit = revenue - totalExpenses;

      // 4. Update state
      setReportData({
        revenue,
        creditPending,
        expenses: totalExpenses,
        netProfit,
        salesCount: transactions?.length || 0
      });

    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to load report data.');
    } finally {
      setLoading(false);
    }
  };

  // Re-run the report whenever the timeframe changes
  useEffect(() => {
    generateReport();
  }, [timeframe]);

  // UI Component for Stats
  const ReportCard = ({ title, value, subtitle, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-3xl font-black text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-2 font-medium">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-10">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-md-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Live Profit & Loss calculations.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <Calendar size={16} className="text-gray-400 ml-2" />
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="p-2 bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
          >
            <option value="today">Today's Report</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ReportCard 
          title="Actual Revenue" 
          value={loading ? '...' : `$${reportData.revenue.toFixed(2)}`}
          subtitle={`${reportData.salesCount} total invoices`}
          icon={<DollarSign size={24} className="text-blue-600" />}
          colorClass="bg-blue-100"
        />
        
        <ReportCard 
          title="Unpaid Debts" 
          value={loading ? '...' : `$${reportData.creditPending.toFixed(2)}`}
          subtitle="Money owed to you"
          icon={<Activity size={24} className="text-orange-600" />}
          colorClass="bg-orange-100"
        />

        <ReportCard 
          title="Total Expenses" 
          value={loading ? '...' : `$${reportData.expenses.toFixed(2)}`}
          subtitle="Operating costs"
          icon={<TrendingDown size={24} className="text-red-600" />}
          colorClass="bg-red-100"
        />

        <ReportCard 
          title="Net Profit" 
          value={loading ? '...' : `$${reportData.netProfit.toFixed(2)}`}
          subtitle="Revenue minus Expenses"
          icon={<TrendingUp size={24} className="text-green-600" />}
          colorClass="bg-green-100 border-b-4 border-b-green-500"
        />
      </div>

      {/* Visual Summary Area */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        {loading ? (
           <div className="animate-pulse flex flex-col items-center">
             <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
             <p className="text-gray-500 font-medium">Crunching the numbers...</p>
           </div>
        ) : (
          <div className="w-full max-w-2xl text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profitability Summary</h2>
            
            {/* Simple CSS Progress Bar representing Profit Margin */}
            <div className="relative w-full h-8 bg-red-100 rounded-full overflow-hidden mb-4 flex">
               {reportData.revenue > 0 ? (
                 <div 
                   className="h-full bg-green-500 transition-all duration-1000 ease-out"
                   style={{ 
                     width: `${Math.max(0, Math.min(100, (reportData.netProfit / reportData.revenue) * 100))}%` 
                   }}
                 ></div>
               ) : (
                 <div className="w-full h-full bg-gray-200"></div>
               )}
            </div>
            
            <div className="flex justify-between text-sm font-bold text-gray-500 px-2">
              <span>Expenses (${reportData.expenses.toFixed(2)})</span>
              <span>Revenue (${reportData.revenue.toFixed(2)})</span>
            </div>

            <p className="mt-8 text-gray-600">
              For the selected period, your pharmacy generated <strong>${reportData.revenue.toFixed(2)}</strong> in collected cash. 
              After deducting <strong>${reportData.expenses.toFixed(2)}</strong> in operating expenses, your take-home profit is 
              <span className={`font-black ml-1 ${reportData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${reportData.netProfit.toFixed(2)}
              </span>.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}