import { z } from "zod"

/**
 * Password rules:
 * - min 8 chars
 * - at least one lowercase
 * - at least one uppercase
 * - at least one digit
 * - at least one special char
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>\/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};:'",.<>\/?\\|`~]{8,}$/;

export const zSchema = z.object({
    email: z
        .string({ message: "Email is required" })
        .trim()
        .min(1, "Email is required")
        .email({ message: "Invalid email address" }),
    password: z
        .string({ message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(
            passwordRegex,
            "Password must contain uppercase, lowercase, number and special character"
        ),
    name: z
        .string({ message: "Username is required" })
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must not exceed 20 characters"),

    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),

    country: z
        .string()
        .min(2, "Country is required"),

    state: z
        .string()
        .min(2, "State is required"),

    city: z
        .string()
        .min(2, "City is required"),

    pincode: z
        .string()
        .regex(/^\d{6}$/, "Invalid pincode"),

    address: z
        .string()
        .min(2, "Address is required"),

    landmark: z
        .string()
        .max(150, "Landmark too long")
        .optional(),

    ordernote: z
        .string()
        .max(300, "Order note too long")
        .optional(),

    otp: z.string().min(6, { message: "Your one-time password must be 6 characters." }),

    _id: z.string().min(3, '_id is required'),

    alt: z.string().min(3, 'Alt is required'),

    title: z.string().min(3, 'Title is required'),

    slug: z.string().min(3, 'Slug is required'),

    category: z.string().min(3, 'Category is required'),

    mrp: z.union([
        z.number().positive("MRP must be a positive number"),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
    ]),

    sellingPrice: z.union([
        z.number().positive("Selling Price must be a positive number"),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
    ]),

    discountPercentage: z.union([
        z.number().positive("Discount Percentage must be a positive number"),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
    ]),

    description: z.string().min(10, "Description must be at least 10 characters long"),

    media: z.array(z.string()),

    product: z.string().min(3, 'Product is Required'),

    sku: z.string().min(3, 'SKU is Required'),

    color: z.string().min(3, 'Color is Required'),

    size: z.string().min(1, 'Size is Required'),

    code: z.string()
        .trim()
        .min(3, "Coupon code must be at least 3 characters long")
        .max(50, "Coupon code cannot exceed 50 characters"),

    amount: z.union([
        z.number().positive("Amount must be a positive number"),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
    ]),

    minShoppingAmount: z.union([
        z.number().positive("Min. shopping amount must be a positive number"),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
    ]),

    validity: z.coerce.date(),

    userId: z.string().min(3, 'User Id is Required'),

    rating: z.union([
        z.number().positive("Min. shopping amount must be a positive number"),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
    ]),

    review: z.string().min(3, 'Review is required')
})