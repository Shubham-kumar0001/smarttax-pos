import { Calendar, Download, AlertCircle, ShoppingBag, Banknote } from 'lucide-react';
import { useStore } from './store';
import { useState, useMemo } from 'react';
import { products } from './data/products';
import { Navigate } from 'react-router-dom';

export function Reports() {
    const { role, orders } = useStore();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    if (role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const { todaySales, monthlySales, outOfStock, filteredOrders } = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let today = 0;
        let month = 0;

        orders.forEach(order => {
            const date = new Date(order.date);
            if (date >= startOfToday) today += order.total;
            if (date >= startOfMonth) month += order.total;
        });

        const oos = products.filter(p => p.stock === 0);

        let filtered = orders;
        if (startDate) {
            filtered = filtered.filter(o => new Date(o.date) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(o => new Date(o.date) <= end);
        }

        return { todaySales: today, monthlySales: month, outOfStock: oos, filteredOrders: filtered };
    }, [orders, startDate, endDate]);

    const handleDownloadReport = () => {
        if (filteredOrders.length === 0) {
            alert('No orders found to download.');
            return;
        }

        const rows = [
            ['Order ID', 'Date', 'Items Count', 'Subtotal', 'Tax (GST)', 'Total', 'Payment Method'],
            ...filteredOrders.map(order => [
                order.id,
                new Date(order.date).toLocaleString(),
                order.items.reduce((sum, item) => sum + item.quantity, 0).toString(),
                `$${order.subtotal.toFixed(2)}`,
                `$${order.tax.toFixed(2)}`,
                `$${order.total.toFixed(2)}`,
                order.method || 'Unknown'
            ])
        ];

        const csvContent = rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `sales_report_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard & Reports</h2>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-blue-600 mb-2">
                        <Banknote size={24} />
                        <h3 className="font-semibold">Today's Sales</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">${todaySales.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-indigo-600 mb-2">
                        <Calendar size={24} />
                        <h3 className="font-semibold">Monthly Sales</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">${monthlySales.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-red-600 mb-2">
                        <AlertCircle size={24} />
                        <h3 className="font-semibold">Out of Stock Items</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{outOfStock.length} items</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Reports Section */}
                <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-blue-500" />
                            Sales History
                        </h3>
                        <button
                            onClick={handleDownloadReport}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Download size={16} /> Export CSV
                        </button>
                    </div>

                    <div className="p-4 border-b border-gray-100 flex gap-4 bg-white">
                        <div className="flex flex-col gap-1 w-1/3">
                            <label className="text-xs font-semibold text-gray-500">From Date</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                        </div>
                        <div className="flex flex-col gap-1 w-1/3">
                            <label className="text-xs font-semibold text-gray-500">To Date</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                        </div>
                        <div className="flex items-end flex-1">
                            <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-sm text-gray-500 hover:text-blue-600 pb-1">Clear Filters</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto p-4 custom-scrollbar">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-gray-500 border-b border-gray-200">
                                    <th className="pb-3 font-semibold">Date</th>
                                    <th className="pb-3 font-semibold">Order ID</th>
                                    <th className="pb-3 font-semibold text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-gray-400">No orders found.</td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id} className="border-b border-gray-50 text-gray-800">
                                            <td className="py-3">{new Date(order.date).toLocaleDateString()}</td>
                                            <td className="py-3 text-gray-500 font-mono text-xs">{order.id.slice(0, 8)}</td>
                                            <td className="py-3 font-bold text-right">${order.total.toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Restock Alerts */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-200 bg-red-50 flex items-center gap-2">
                        <AlertCircle size={20} className="text-red-500" />
                        <h3 className="font-semibold text-red-900">Needs Restock</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
                        {outOfStock.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">All items are in stock!</div>
                        ) : (
                            outOfStock.map(p => (
                                <div key={p.id} className="border border-red-100 bg-white p-3 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">{p.name}</h4>
                                            <p className="text-xs text-gray-500">{p.category}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md">Empty</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
