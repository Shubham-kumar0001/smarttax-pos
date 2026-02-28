import { useStore } from './store';
import { products } from './data/products';
import { DollarSign, TrendingDown, Wallet, LayoutList } from 'lucide-react';

export function Inventory() {
    const { role } = useStore();

    // Mock calculations
    const assets = products.reduce((acc: number, p: any) => acc + (p.price * p.stock), 0);
    const liabilities = role === 'admin' ? 12000 : 0; // Only admin sees real liabilities
    const equity = role === 'admin' ? assets - liabilities : 0;
    const profit = role === 'admin' ? 5400 : 0;
    const loss = role === 'admin' ? 200 : 0;

    return (
        <div className="p-8 h-full flex flex-col gap-8 overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Inventory Management</h2>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <MetricCard icon={<LayoutList />} label="Total Stock Value" value={`$${assets.toFixed(2)}`} />
                {role === 'admin' && (
                    <>
                        <MetricCard icon={<TrendingDown className="text-red-500" />} label="Liabilities" value={`$${liabilities.toFixed(2)}`} />
                        <MetricCard icon={<Wallet className="text-emerald-500" />} label="Equity" value={`$${equity.toFixed(2)}`} />
                        <MetricCard icon={<DollarSign className="text-blue-500" />} label="Net Profit" value={`$${profit.toFixed(2)}`} />
                        <MetricCard icon={<TrendingDown className="text-orange-500" />} label="Loss" value={`$${loss.toFixed(2)}`} />
                    </>
                )}
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 font-semibold text-gray-600">Product</th>
                            <th className="p-4 font-semibold text-gray-600">Category</th>
                            <th className="p-4 font-semibold text-gray-600">Price</th>
                            <th className="p-4 font-semibold text-gray-600">Stock</th>
                            <th className="p-4 font-semibold text-gray-600">Barcode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product: any) => (
                            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                    <span className="font-medium text-gray-800">{product.name}</span>
                                </td>
                                <td className="p-4 text-gray-600">{product.category}</td>
                                <td className="p-4 text-gray-800 font-medium">${product.price.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.stock} in stock
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 font-mono text-sm">{product.barcode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <span className="text-gray-500 font-medium">{label}</span>
                <div className="text-gray-400">{icon}</div>
            </div>
            <span className="text-2xl font-bold text-gray-900">{value}</span>
        </div>
    );
}
