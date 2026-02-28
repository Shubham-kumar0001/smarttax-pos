import { Building2, Percent, ShieldCheck } from 'lucide-react';
import { useStore } from './store';
import { useState } from 'react';

export function Settings() {
    const { role, taxRate, shopDetails, updateShopDetails } = useStore();
    const [details, setDetails] = useState(shopDetails);

    if (role !== 'admin') {
        return (
            <div className="p-8 h-full flex flex-col">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-8">Settings</h2>
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center gap-4">
                    <ShieldCheck size={48} className="text-gray-300" />
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Access Restricted</h3>
                        <p className="text-gray-500 max-w-sm mt-2">
                            Only administrators and store owners can access and modify business settings.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const handleSave = () => {
        updateShopDetails(details);
        alert('Settings saved successfully!');
    };

    return (
        <div className="p-8 h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Business Settings</h2>

            <div className="max-w-3xl space-y-6">

                {/* Store Profile */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                        <Building2 size={20} className="text-gray-500" />
                        <h3 className="font-semibold text-gray-800">Store Profile</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                <input type="text" value={details.name} onChange={e => setDetails({ ...details, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GST/Registration Number</label>
                                <input type="text" value={details.gstNumber} onChange={e => setDetails({ ...details, gstNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input type="text" value={details.address} onChange={e => setDetails({ ...details, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="text" value={details.phone} onChange={e => setDetails({ ...details, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" value={details.email} onChange={e => setDetails({ ...details, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tax & Financials */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                        <Percent size={20} className="text-gray-500" />
                        <h3 className="font-semibold text-gray-800">Tax Settings</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax/GST Rate (%)</label>
                            <input type="number" readOnly value={taxRate * 100} className="bg-gray-100 cursor-not-allowed w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            <p className="text-xs text-gray-500 mt-1">Tax rate is currently fixed in the system state.</p>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4 pb-12">
                    <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
