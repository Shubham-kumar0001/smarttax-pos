import { forwardRef } from 'react';
import type { Order, ShopDetails } from './types';

interface ReceiptProps {
    order: Order | null;
    shopDetails: ShopDetails;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ order, shopDetails }, ref) => {
    if (!order) return null;

    return (
        <div style={{ display: 'none' }}>
            <div ref={ref} className="p-8 bg-white text-black font-sans w-[80mm] mx-auto text-sm" style={{ width: '80mm', minHeight: '100% ' }}>
                {/* Header */}
                <div className="text-center mb-6 border-b-2 border-dashed border-gray-800 pb-4">
                    <h1 className="text-2xl font-bold uppercase mb-1">{shopDetails.name}</h1>
                    <p className="text-xs">{shopDetails.address}</p>
                    <p className="text-xs">Phone: {shopDetails.phone}</p>
                    <p className="text-xs">Email: {shopDetails.email}</p>
                    <p className="text-xs font-semibold mt-1">GSTIN: {shopDetails.gstNumber}</p>
                </div>

                {/* Order Meta */}
                <div className="mb-4 text-xs">
                    <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{new Date(order.date).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>Receipt #:</span>
                        <span>{order.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>Payment Method:</span>
                        <span className="capitalize">{order.method || 'Cash'}</span>
                    </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                    <div className="flex justify-between font-bold border-b border-gray-800 pb-1 mb-2 text-xs">
                        <span className="flex-1">Item</span>
                        <span className="w-12 text-center">Qty</span>
                        <span className="w-16 text-right">Amount</span>
                    </div>
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-xs mb-1">
                            <span className="flex-1 truncate pr-2">{item.name}</span>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <span className="w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t-2 border-dashed border-gray-800 pt-2 mb-6">
                    <div className="flex justify-between text-xs mb-1">
                        <span>Subtotal:</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>Tax / GST:</span>
                        <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base mt-2">
                        <span>Total:</span>
                        <span>${order.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs mt-8">
                    <p className="font-bold mb-1">Thank you for your business!</p>
                    <p>Please visit us again.</p>
                </div>
            </div>
        </div>
    );
});
