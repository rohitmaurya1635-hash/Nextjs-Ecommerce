import { catchError, response } from "@/lib/helperFunction";

import Razorpay from "razorpay";
import { connectDB } from "@/lib/databaseConnection";
import { zSchema } from "@/lib/zodSchema";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json();
        const validtionSchema = zSchema.pick({
            amount: true,
        })

        const validatedData = validtionSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing input fields', validatedData.error)
        }

        const { amount } = validatedData.data;

        const razInstance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })

        var razOptions = {
            amount: Number(amount) * 100,
            currency: "INR",
            receipt: "order_rcptid_11"
        }

        const orderDetail = await razInstance.orders.create(razOptions);
        const order_id = orderDetail.id

        return response(true, 200, 'Order id Genrated', order_id)

    } catch (error) {
        return catchError(error)
    }
}