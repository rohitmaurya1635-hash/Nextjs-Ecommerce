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

    otp: z.string()
        .min(6, { message: "Your one-time password must be 6 characters." }),

    _id: z.string().min(3, '_id is required'),

    alt: z.string().min(3, 'Alt is required'),

    title: z.string().min(3, 'Title is required'),

})