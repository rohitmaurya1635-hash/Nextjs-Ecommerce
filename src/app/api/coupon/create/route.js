import { catchError, response } from "@/lib/helperFunction"

import CouponModel from "@/models/Coupon.model"
import { connectDB } from "@/lib/databaseConnection"
import { isAuthenticated } from "@/lib/authantication"
import { zSchema } from "@/lib/zodSchema"

export async function POST(request) {
    try {
        // Check is admin
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const payload = await request.json()

        const validtionSchema = zSchema.pick({
            code: true,
            discountPercentage: true,
            minShoppingAmount: true,
            validity: true,
        })

        const validatedData = validtionSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing input fields', validatedData.error)
        }

        const { code, discountPercentage, minShoppingAmount, validity } = validatedData.data

        const newCoupon = new CouponModel({ code, discountPercentage, minShoppingAmount, validity })

        await newCoupon.save()

        return response(true, 200, 'Coupon craeted successfully',)

    } catch (error) {
        return catchError(error)
    }
}