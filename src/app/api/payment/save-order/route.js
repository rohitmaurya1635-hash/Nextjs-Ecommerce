import { catchError, response } from "@/lib/helperFunction";

import OrderModel from "@/models/Order.Model";
import { connectDB } from "@/lib/databaseConnection";
import { orderNotification } from "@/emails/orderNotification";
import { sendMail } from "@/lib/sendMail";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import z from "zod";
import { zSchema } from "@/lib/zodSchema";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json();
        const productSchema = z.object({
            productId: z.string().length(24, 'Invalid product id format'),
            variantId: z.string().length(24, 'Invalid variant id format'),
            name: z.string().min(1),
            qty: z.number().min(1),
            mrp: z.number().nonnegative(),
            sellingPrice: z.number().nonnegative()
        })

        const orderSchema = zSchema.pick({
            name: true,
            email: true,
            phone: true,
            country: true,
            state: true,
            city: true,
            pincode: true,
            landmark: true,
            ordernote: true,
        }).extend({
            userId: z.string().optional(),
            razorpay_payment_id: z.string().min(3, 'Payment id is required.'),
            razorpay_order_id: z.string().min(3, 'Order id is required.'),
            razorpay_signature: z.string().min(3, 'Signature is required.'),
            subtotal: z.number().nonnegative(),
            discount: z.number().nonnegative(),
            total: z.number().nonnegative(),
            couponDiscountAmount: z.number().nonnegative(),
            grandTotal: z.number().nonnegative(),
            products: z.array(productSchema)
        })

        const validate = orderSchema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing input fields', validate.error)
        }

        const validatedData = validate.data;


        // payment verification
        const verification = validatePaymentVerification({
            order_id: validatedData.razorpay_order_id,
            payment_id: validatedData.razorpay_payment_id
        }, validatedData.razorpay_signature, process.env.RAZORPAY_KEY_SECRET)


        const newOrder = await OrderModel.create({
            user: validatedData.userId || null,
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            country: validatedData.country,
            state: validatedData.state,
            city: validatedData.city,
            pincode: validatedData.pincode,
            landmark: validatedData.landmark,
            ordernote: validatedData.ordernote,
            products: validatedData.products,
            subtotal: validatedData.subtotal,
            discount: validatedData.discount,
            total: validatedData.total,
            couponDiscountAmount: validatedData.couponDiscountAmount,
            grandTotal: validatedData.grandTotal,
            orderStatus: verification ? 'processing' : 'unverified',
            payment_id: validatedData.razorpay_payment_id,
            order_id: validatedData.razorpay_order_id,
        })
        try {
            const mailData = {
                order_id: validatedData.razorpay_order_id,
                orderDerailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${validatedData.razorpay_order_id}`
            }
            await sendMail('Order Placed successfully', validatedData.email, orderNotification(mailData))
        } catch (error) {
            console.log(error)
        }

        return response(true, 200, 'Order placed successfully.')

    } catch (error) {
        return catchError(error)
    }
}