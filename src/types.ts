export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    barcode: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    points: number;
}

export type PaymentMethod = 'cash' | 'online' | 'debit_card' | 'credit_card' | 'gpay' | 'phonepe' | 'paytm' | 'qr_code' | null;

export interface Order {
    id: string;
    date: string;
    customerId?: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    method: PaymentMethod;
}

export interface ShopDetails {
    name: string;
    address: string;
    phone: string;
    email: string;
    gstNumber: string;
}
