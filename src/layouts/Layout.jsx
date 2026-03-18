// src/layouts/Layout.jsx
import { NavLink } from 'react-router-dom';
import { PanelLeft } from 'lucide-react'; // Topbar icon

export default function Layout({ children }) {
  // Navigation links array for clean mapping
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Sell (POS)', path: '/pos' },
    { name: 'Products', path: '/inventory' },
    { name: 'Credit', path: '/credit' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-[240px] bg-[#111827] text-gray-300 flex flex-col flex-shrink-0">
        {/* Brand/Logo Area */}
        <div className="flex items-center gap-3 p-5 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500 font-bold text-white">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-tight">MAM System</span>
            <span className="text-[11px] text-gray-400 leading-tight">Management</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col px-3 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#1f2937] text-white' // Darker gray for active state
                    : 'hover:bg-[#1f2937] hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-gray-200 bg-white flex items-center px-4 flex-shrink-0">
          <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
            <PanelLeft size={20} strokeWidth={1.5} />
          </button>
        </header>

        {/* Page Content goes here */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}