import { DollarSign, FileText, ShoppingCart, Users, Settings as SettingsIcon } from 'lucide-react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { POS } from './POS';
import { useStore } from './store';
import { Inventory } from './Inventory';
import { Customers } from './Customers';
import { Settings } from './Settings';
import { Reports } from './Reports';
import { BarChart3 } from 'lucide-react';

function Layout({ children }: { children: React.ReactNode }) {
    const { role, setRole } = useStore();

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                        <DollarSign size={24} />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                        SmartTax POS
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarLink to="/" icon={<ShoppingCart size={20} />} label="Point of Sale" />
                    <SidebarLink to="/inventory" icon={<FileText size={20} />} label="Inventory" />
                    <SidebarLink to="/customers" icon={<Users size={20} />} label="Customers" />
                    {role === 'admin' && (
                        <>
                            <SidebarLink to="/reports" icon={<BarChart3 size={20} />} label="Reports" />
                            <SidebarLink to="/settings" icon={<SettingsIcon size={20} />} label="Settings" />
                        </>
                    )}
                </nav>
            </aside>

            {/* Role Switcher */}
            <div className="absolute bottom-6 left-6 w-52 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden text-sm font-medium flex">
                <button
                    onClick={() => setRole('admin')}
                    className={`flex-1 py-2 text-center transition-colors ${role === 'admin' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Admin
                </button>
                <button
                    onClick={() => setRole('staff')}
                    className={`flex-1 py-2 text-center transition-colors ${role === 'staff' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Staff
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>
        </div>
    );
}

function SidebarLink({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                }`}
        >
            <div className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                {icon}
            </div>
            <span>{label}</span>
        </Link>
    );
}

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<POS />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </Layout>
    );
}
