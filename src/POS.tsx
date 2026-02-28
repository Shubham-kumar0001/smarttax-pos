import { Minus, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CheckoutModal } from './CheckoutModal';
import { products } from './data/products';
import { useStore } from './store';
// types are inline now through implicit imports if fully qualified or handled

// Moved out of App.tsx into its own component
export function POS() {
    const [search, setSearch] = useState('');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const { cart, addToCart, removeFromCart, updateQuantity, taxRate, clearCart } = useStore();

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <div className="p-8 h-full flex flex-col">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">New Sale</h2>
                    <p className="text-gray-500 mt-1">Select items to add to the cart</p>
                </div>

                <div className="relative w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
                        placeholder="Search products by name or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </header>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                            >
                                <div className="h-40 bg-gray-100 overflow-hidden relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-700">
                                        {product.stock} in stock
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="text-xs font-medium text-blue-600 mb-1">{product.category}</div>
                                    <h3 className="text-gray-900 font-semibold truncate" title={product.name}>{product.name}</h3>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                        <button className="bg-blue-50 text-blue-600 p-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
                                <Search size={48} className="mb-4 opacity-20" />
                                <p>No products found matching "{search}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart Sidebar */}
                <div className="w-[400px] bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col flex-shrink-0">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <ShoppingCart size={20} className="text-blue-600" />
                            Current Order
                        </h3>
                        {cart.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <ShoppingCart size={48} className="mb-4 opacity-20" />
                                <p>Cart is empty</p>
                                <p className="text-sm mt-1">Select products to add them</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight pr-2">{item.name}</h4>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="px-2 font-medium text-sm w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <span className="font-semibold text-gray-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                        <div className="flex justify-between mb-2 text-gray-500 text-sm font-medium">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-500 text-sm font-medium">
                            <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            disabled={cart.length === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl shadow-sm transition-all shadow-blue-600/20 active:scale-[0.98] disabled:active:scale-100 relative overflow-hidden"
                        >
                            Checkout / Pay
                        </button>
                    </div>
                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                total={total}
            />
        </div>
    );
}
