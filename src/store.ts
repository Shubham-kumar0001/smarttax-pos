import { create } from 'zustand';
import type { CartItem, Product, Order, ShopDetails, Customer } from './types';

interface POSState {
    cart: CartItem[];
    orders: Order[];
    customers: Customer[];
    shopDetails: ShopDetails;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    addOrder: (order: Order) => void;
    addCustomer: (customer: Customer) => void;
    updateShopDetails: (details: Partial<ShopDetails>) => void;
    taxRate: number;
    role: 'admin' | 'staff';
    setRole: (role: 'admin' | 'staff') => void;
}

export const useStore = create<POSState>((set) => ({
    cart: [],
    orders: [],
    customers: [
        {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Fake Street, CA',
            points: 450
        },
        {
            id: '2',
            name: 'Michael Chen',
            email: 'm.chen@example.com',
            phone: '+1 (555) 987-6543',
            address: '456 Test Ave, NY',
            points: 120
        },
        {
            id: '3',
            name: 'Emily Davis',
            email: 'emily.d@example.com',
            phone: '+1 (555) 456-7890',
            address: '789 Demo Blvd, TX',
            points: 890
        }
    ],
    shopDetails: {
        name: 'SmartTax POS',
        address: '123 Main Street, City, Country',
        phone: '+1 234 567 8900',
        email: 'contact@smarttax.local',
        gstNumber: 'GSTIN123456789'
    },
    taxRate: 0.08, // 8% tax rate
    role: 'admin', // Default role

    setRole: (role) => set({ role }),
    updateShopDetails: (details) => set((state) => ({ shopDetails: { ...state.shopDetails, ...details } })),
    addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),

    addToCart: (product) =>
        set((state) => {
            const existingItem = state.cart.find(item => item.id === product.id);
            if (existingItem) {
                return {
                    cart: state.cart.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }
            return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

    removeFromCart: (productId) =>
        set((state) => ({
            cart: state.cart.filter(item => item.id !== productId)
        })),

    updateQuantity: (productId, quantity) =>
        set((state) => ({
            cart: state.cart.map(item =>
                item.id === productId
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        })),

    clearCart: () => set({ cart: [] }),
}));
