import { catchError, response } from "@/lib/helperFunction";

import CouponModel from "@/models/Coupon.model";
import { connectDB } from "@/lib/databaseConnection";
import { zSchema } from "@/lib/zodSchema";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()

        const validtionSchema = zSchema.pick({
            code: true,
            minShoppingAmount: true,
        })

        const validatedData = validtionSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing input fields', validatedData.error)
        }

        const { code, minShoppingAmount } = validatedData.data;
        
        const coupon = await CouponModel.findOne({ code }).lean();

        if (!coupon) {
            return response(false, 400, "Invalid coupon code");
        }

        if (new Date() > coupon.validity) {
            return response(false, 400, "Coupon has expired");
        }

        if (minShoppingAmount < coupon.minShoppingAmount) {
            return response(false, 400, `Minimum purchase amount is ₹${coupon.minShoppingAmount}`);
        }

        return response(true, 200, "Coupon applied successfully", { discountPercentage: coupon.discountPercentage, });

    } catch (error) {
        return catchError(error)
    }
}