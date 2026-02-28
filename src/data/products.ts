import type { Product } from '../types';

const categories = [
    'Electronics', 'Home & Garden', 'Clothing', 'Sports', 'Toys',
    'Books', 'Beauty', 'Automotive', 'Grocery', 'Pet Supplies',
    'Office', 'Health', 'Music', 'Tools', 'Jewelry'
];

const adjectives = [
    'Premium', 'Basic', 'Advanced', 'Smart', 'Eco-friendly',
    'Portable', 'Heavy-duty', 'Compact', 'Vintage', 'Modern',
    'Wireless', 'Ergonomic', 'Professional', 'Handcrafted', 'Digital'
];

const nouns = [
    'Widget', 'System', 'Device', 'Kit', 'Set',
    'Tool', 'Accessory', 'Module', 'Unit', 'Pack',
    'Monitor', 'Controller', 'Scanner', 'Adapter', 'Station'
];

const images = [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1572635196237-14b3f281501f?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400'
];

// Helper to generate a random number between min and max
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => Number((Math.random() * (max - min) + min).toFixed(2));

// Generate 320 products
export const products: Product[] = Array.from({ length: 320 }, (_, index) => {
    const i = index + 1;
    const category = categories[randomInt(0, categories.length - 1)];
    const adjective = adjectives[randomInt(0, adjectives.length - 1)];
    const noun = nouns[randomInt(0, nouns.length - 1)];

    return {
        id: i.toString(),
        name: `${adjective} ${noun} ${String.fromCharCode(65 + randomInt(0, 25))}${randomInt(10, 99)}`,
        price: randomFloat(5, 499),
        category: category,
        image: images[randomInt(0, images.length - 1)],
        stock: randomInt(0, 250),
        barcode: (10000 + i).toString()
    };
});
