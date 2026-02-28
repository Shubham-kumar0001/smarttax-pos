import { Banknote, CheckCircle, CreditCard, Printer, X, Smartphone, QrCode, User, ScanLine } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useStore } from './store';
import { Receipt } from './Receipt';
import type { Order, PaymentMethod } from './types';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
}

export function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
    const [method, setMethod] = useState<PaymentMethod>(null);
    const [subMethod, setSubMethod] = useState<PaymentMethod>(null);
    const [showOnlineOptions, setShowOnlineOptions] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [qrDetecting, setQrDetecting] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

    const { cart, clearCart, taxRate, addOrder, shopDetails, customers } = useStore();

    const receiptRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: `Receipt_${completedOrder?.id}`,
    });

    // Auto-detect QR code scanning simulation
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (subMethod === 'qr_code' && !isProcessing && !isSuccess) {
            setQrDetecting(true);
            timeout = setTimeout(() => {
                setQrDetecting(false);
                handleProcessPayment();
            }, 3000);
        } else {
            setQrDetecting(false);
        }
        return () => clearTimeout(timeout);
    }, [subMethod, isProcessing, isSuccess]);

    if (!isOpen) return null;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * taxRate;

    const handleProcessPayment = () => {
        setIsProcessing(true);
        const finalMethod = showOnlineOptions ? subMethod : 'cash';

        // Simulate API delay for payment processing
        setTimeout(() => {
            const newOrder: Order = {
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                customerId: selectedCustomerId || undefined,
                items: [...cart],
                subtotal,
                tax,
                total,
                method: finalMethod
            };

            addOrder(newOrder);
            setCompletedOrder(newOrder);

            setIsProcessing(false);
            setIsSuccess(true);
            downloadCSV(newOrder);
            clearCart();
        }, 1500);
    };

    const downloadCSV = (order: Order) => {
        const rows = [
            ['Item', 'Quantity', 'Price', 'Total'],
            ...order.items.map(item => [
                item.name,
                item.quantity.toString(),
                `$${item.price.toFixed(2)}`,
                `$${(item.price * item.quantity).toFixed(2)}`
            ]),
            [],
            ['Subtotal', '', '', `$${order.subtotal.toFixed(2)}`],
            ['Tax (GST)', '', '', `$${order.tax.toFixed(2)}`],
            ['Total', '', '', `$${order.total.toFixed(2)}`]
        ];

        const csvContent = rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `receipt_${order.id}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClose = () => {
        if (isSuccess) {
            // Reset state when closing after success
            setIsSuccess(false);
            setMethod(null);
            setSubMethod(null);
            setShowOnlineOptions(false);
            setCompletedOrder(null);
        } else {
            setMethod(null);
            setSubMethod(null);
            setShowOnlineOptions(false);
        }
        onClose();
    };

    const getFormatedMethod = (m: PaymentMethod) => {
        switch (m) {
            case 'cash': return 'Cash';
            case 'credit_card': return 'Credit Card';
            case 'debit_card': return 'Debit Card';
            case 'gpay': return 'Google Pay';
            case 'phonepe': return 'PhonePe';
            case 'paytm': return 'Paytm';
            case 'qr_code': return 'QR Code';
            default: return 'Online Payment';
        }
    };

    const isReadyToPay = method === 'cash' || (method === 'online' && subMethod !== null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
                {/* Print Receipt Reference Component */}
                <Receipt ref={receiptRef} order={completedOrder} shopDetails={shopDetails} />

                {/* Close Button */}
                {!isProcessing && !isSuccess && (
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors z-10"
                    >
                        <X size={20} />
                    </button>
                )}

                {isSuccess ? (
                    <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 mb-8">
                            Order has been placed using {getFormatedMethod(completedOrder?.method || null)}.
                            CSV Data has been downloaded automatically.
                        </p>

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={() => handlePrint()}
                                className="w-full bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 focus:ring-4 focus:ring-blue-100 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Printer size={20} />
                                Print Receipt
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-sm transition-all"
                            >
                                Start New Sale
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 sm:p-8 flex flex-col h-full max-h-[90vh]">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h2>
                        <p className="text-gray-500 mb-6">Select a payment method to complete the transaction.</p>

                        <div className="mb-6 flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><User size={16} /> Associate Customer (Optional)</label>
                            <select
                                value={selectedCustomerId}
                                onChange={(e) => setSelectedCustomerId(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none block text-sm bg-white shadow-sm"
                            >
                                <option value="">Walk-in Customer</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100 flex-shrink-0">
                            <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                                <span>Tax/GST:</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-2">
                                <span className="text-gray-900 font-semibold">Total Due:</span>
                                <span className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                            {!showOnlineOptions ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => { setMethod('cash'); setShowOnlineOptions(false); setSubMethod(null); }}
                                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${method === 'cash'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-blue-300 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Banknote size={32} className={method === 'cash' ? 'text-blue-600' : 'text-gray-400'} />
                                        <span className="font-semibold">Cash</span>
                                    </button>

                                    <button
                                        onClick={() => { setMethod('online'); setShowOnlineOptions(true); }}
                                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${method === 'online'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-blue-300 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <CreditCard size={32} className={method === 'online' ? 'text-blue-600' : 'text-gray-400'} />
                                        <span className="font-semibold">Online / UPI</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <button
                                        onClick={() => setShowOnlineOptions(false)}
                                        className="text-sm text-blue-600 hover:underline mb-4 flex items-center gap-1"
                                    >
                                        &larr; Back to Payment Types
                                    </button>
                                    <h3 className="font-semibold text-gray-800 mb-3">Select Online Method</h3>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <OnlineMethodButton id="credit_card" label="Credit Card" icon={<CreditCard size={20} />} current={subMethod} onSelect={setSubMethod} />
                                        <OnlineMethodButton id="debit_card" label="Debit Card" icon={<CreditCard size={20} />} current={subMethod} onSelect={setSubMethod} />
                                        <OnlineMethodButton id="gpay" label="Google Pay" icon={<Smartphone size={20} />} current={subMethod} onSelect={setSubMethod} />
                                        <OnlineMethodButton id="phonepe" label="PhonePe" icon={<Smartphone size={20} />} current={subMethod} onSelect={setSubMethod} />
                                        <OnlineMethodButton id="paytm" label="Paytm" icon={<Smartphone size={20} />} current={subMethod} onSelect={setSubMethod} />
                                        <OnlineMethodButton id="qr_code" label="Scan QR" icon={<QrCode size={20} />} current={subMethod} onSelect={setSubMethod} />
                                    </div>

                                    {subMethod === 'qr_code' && (
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center mt-4">
                                            <div className="relative">
                                                <QrCode size={120} className={`text-gray-800 transition-all ${qrDetecting ? 'opacity-20' : ''}`} />
                                                {qrDetecting && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <ScanLine size={48} className="text-blue-600 animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">{qrDetecting ? 'Waiting for successful scan...' : 'Scan with any UPI App'}</p>
                                            <p className="font-bold text-xl mt-1">${total.toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex-shrink-0">
                            <button
                                onClick={handleProcessPayment}
                                disabled={!isReadyToPay || isProcessing || qrDetecting || subMethod === 'qr_code'}
                                className={`w-full font-medium py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${subMethod === 'qr_code'
                                        ? 'bg-blue-50 text-blue-600 border border-blue-200 cursor-default'
                                        : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white'
                                    }`}
                            >
                                {isProcessing || qrDetecting ? (
                                    <>
                                        <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${subMethod === 'qr_code' ? 'border-blue-600' : 'border-white'}`} />
                                        {qrDetecting ? 'Detecting Payment...' : 'Processing...'}
                                    </>
                                ) : (
                                    subMethod === 'qr_code' ? 'Awaiting QR Scan' : `Pay $${total.toFixed(2)}`
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function OnlineMethodButton({ id, label, icon, current, onSelect }: { id: PaymentMethod, label: string, icon: React.ReactNode, current: PaymentMethod, onSelect: (id: PaymentMethod) => void }) {
    const isSelected = current === id;

    return (
        <button
            onClick={() => onSelect(id)}
            className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium ${isSelected
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 text-gray-700 bg-white'
                }`}
        >
            <div className={isSelected ? 'text-blue-600' : 'text-gray-400'}>{icon}</div>
            {label}
        </button>
    )
}
