// src/layouts/Layout.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  Wallet, 
  History, 
  BarChart3, 
  LogOut, 
  PanelLeft,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  // Navigation configuration for easy maintenance
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Sell (POS)', path: '/pos', icon: <ShoppingCart size={18} /> },
    { name: 'Products', path: '/inventory', icon: <Package size={18} /> },
    { name: 'Credit Ledger', path: '/credit', icon: <CreditCard size={18} /> },
    { name: 'Expenses', path: '/expenses', icon: <Wallet size={18} /> },
    { name: 'Transactions', path: '/transactions', icon: <History size={18} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={18} /> },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-[#111827] text-gray-300 flex flex-col flex-shrink-0 border-r border-gray-800">
        
        {/* Brand/Logo Area */}
        <div className="flex items-center gap-3 p-6 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-900/20">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight uppercase">MAM System</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Pharmacy Manager</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col px-4 gap-1 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'hover:bg-gray-800 hover:text-white text-gray-400'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout Section */}
        <div className="p-4 mt-auto border-t border-gray-800 bg-[#0b0f1a]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 border border-gray-600">
              <User size={16} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-white truncate">Admin User</span>
              <span className="text-[10px] text-gray-500 truncate">{user?.email}</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Top Header */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors lg:hidden">
              <PanelLeft size={20} />
            </button>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">System Status</span>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-gray-700">Online & Encrypted</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Quick Actions or Notification icons could go here */}
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900 leading-none">Pharmacy POS</p>
                <p className="text-[10px] text-gray-500 mt-1 uppercase">v1.0.0 Stable</p>
             </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f8fafc]">
          <div className="p-6 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}