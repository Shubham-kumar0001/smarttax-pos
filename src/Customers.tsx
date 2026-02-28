import { Mail, Phone, Award, Package, Calendar, DollarSign, Receipt, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useStore } from './store';
import type { Customer } from './types';

export function Customers() {
    const { role, customers, orders } = useStore();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const handleCustomerClick = (customer: Customer) => {
        if (role === 'admin') {
            setSelectedCustomer(customer);
        }
    };

    if (selectedCustomer) {
        const customerOrders = orders.filter(o => o.customerId === selectedCustomer.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);

        return (
            <div className="p-8 h-full flex flex-col gap-6 overflow-y-auto bg-gray-50 custom-scrollbar">
                <button
                    onClick={() => setSelectedCustomer(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors w-fit font-medium"
                >
                    <ChevronLeft size={20} />
                    Back to Customers
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Info Card */}
                    <div className="lg:col-span-1 border border-gray-200 bg-white rounded-3xl p-8 shadow-sm flex flex-col gap-6 h-fit">
                        <div className="flex flex-col items-center text-center gap-4 border-b border-gray-100 pb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-4xl shadow-inner">
                                {selectedCustomer.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                                <div className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1 mt-2">
                                    <Award size={14} /> {selectedCustomer.points} Points
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-3">
                                <Mail size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-500 font-medium">Email</p>
                                    <p className="text-gray-900">{selectedCustomer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-500 font-medium">Phone</p>
                                    <p className="text-gray-900">{selectedCustomer.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Package size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-500 font-medium">Address</p>
                                    <p className="text-gray-900 leading-relaxed">{selectedCustomer.address || 'No address provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Purchase History */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><DollarSign size={24} /></div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Spent</p>
                                    <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Receipt size={24} /></div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">{customerOrders.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex-1 flex flex-col">
                            <div className="px-6 py-5 border-b border-gray-100 bg-white">
                                <h3 className="font-bold text-gray-800 text-lg">Purchase History</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                                {customerOrders.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                                        <Receipt size={48} className="mb-4 opacity-20" />
                                        <p>No purchases found for this customer.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold sticky top-0">
                                            <tr>
                                                <th className="py-4 px-6">Date</th>
                                                <th className="py-4 px-6">Order ID</th>
                                                <th className="py-4 px-6">Items</th>
                                                <th className="py-4 px-6 text-right">GST</th>
                                                <th className="py-4 px-6 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {customerOrders.map(order => (
                                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-6 text-gray-900">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} className="text-gray-400" />
                                                            {new Date(order.date).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 font-mono text-gray-500 text-xs">
                                                        {order.id.slice(0, 8)}
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-600">
                                                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                                                    </td>
                                                    <td className="py-4 px-6 text-right text-gray-500">
                                                        ${order.tax.toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-6 text-right font-bold text-gray-900">
                                                        ${order.total.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 h-full flex flex-col gap-8 overflow-y-auto bg-gray-50 custom-scrollbar">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Customer Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {customers.map((customer) => (
                    <div
                        key={customer.id}
                        onClick={() => handleCustomerClick(customer)}
                        className={`bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col gap-4 transition-all ${role === 'admin' ? 'cursor-pointer hover:shadow-md hover:border-blue-200 hover:-translate-y-1' : ''}`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                    {customer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight">{customer.name}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">ID: {customer.id}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Points</span>
                                <span className="font-bold text-emerald-600 flex items-center gap-1">
                                    <Award size={14} />
                                    {customer.points}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2.5 mt-2 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                <Mail size={16} className="text-gray-400 shrink-0" />
                                <span className="truncate" title={customer.email}>{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                <Phone size={16} className="text-gray-400 shrink-0" />
                                <span>{customer.phone}</span>
                            </div>
                        </div>

                        {role === 'admin' && (
                            <div className="mt-2 pt-4 border-t border-gray-50 text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                View History &rarr;
                            </div>
                        )}
                    </div>
                ))}

                {customers.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
                        <p>No customers recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
