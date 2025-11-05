import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const sizes = ['S', 'M', 'L', 'XL', 'XXL'].map(size => ({
    label: size,
    value: size
}));