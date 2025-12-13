import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const sizes = ['S', 'M', 'L', 'XL', 'XXL'].map(size => ({
    label: size,
    value: size
}));

export const sortingOptions = [
    { label: 'Default Sorting', value: 'default' },
    { label: 'Ascending A-Z', value: 'asc' },
    { label: 'Descending Z-A', value: 'desc' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Newest Arrivals', value: 'newest' },
]