// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ----------------------------------------------------------------------
// PLACEHOLDER COMPONENTS (We will build these out in separate files next)
// ----------------------------------------------------------------------
const Layout = ({ children }) => (
  <div className="flex h-screen w-full overflow-hidden bg-gray-50">
    {/* Placeholder Sidebar */}
    <aside className="w-64 bg-gray-900 text-white p-4">Sidebar Navbar</aside>
    {/* Main Content Area */}
    <main className="flex-1 overflow-y-auto p-8">{children}</main>
  </div>
);

const Dashboard = () => <div><h1 className="text-2xl font-bold">Dashboard</h1><p>Metrics go here.</p></div>;
const POS = () => <div><h1 className="text-2xl font-bold">Point of Sale (POS)</h1><p>Cart and items go here.</p></div>;
const Inventory = () => <div><h1 className="text-2xl font-bold">Products & Services</h1></div>;
const CreditLedger = () => <div><h1 className="text-2xl font-bold">Credit Ledger</h1></div>;
const Expenses = () => <div><h1 className="text-2xl font-bold">Expenses</h1></div>;
const Transactions = () => <div><h1 className="text-2xl font-bold">Transactions</h1></div>;
const Reports = () => <div><h1 className="text-2xl font-bold">Reports</h1></div>;

// ----------------------------------------------------------------------
// MAIN APP ROUTER
// ----------------------------------------------------------------------
export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Default route loads the Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Feature Routes */}
          <Route path="/pos" element={<POS />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/credit" element={<CreditLedger />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}