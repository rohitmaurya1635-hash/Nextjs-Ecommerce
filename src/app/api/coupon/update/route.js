import { catchError, response } from "@/lib/helperFunction"

import CouponModel from "@/models/Coupon.model"
import { connectDB } from "@/lib/databaseConnection"
import { isAuthenticated } from "@/lib/authantication"
import { zSchema } from "@/lib/zodSchema"

export async function PUT(request) {
    try {
        // Check is admin
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const payload = await request.json()

        const validtionSchema = zSchema.pick({
            _id: true,
            code: true,
            discountPercentage: true,
            minShoppingAmount: true,
            validity: true,
        })

        const validatedData = validtionSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing input fields', validatedData.error)
        }

        const { _id, code, discountPercentage, minShoppingAmount, validity } = validatedData.data

        const getCoupon = await CouponModel.findOne({ deletedAt: null, _id })
        if (!getCoupon) {
            return response(false, 404, 'Coupon not found')
        }

        getCoupon.code = code
        getCoupon.discountPercentage = discountPercentage
        getCoupon.minShoppingAmount = minShoppingAmount
        getCoupon.validity = validity

        await getCoupon.save()

        return response(true, 200, 'Product updated successfully')

    } catch (error) {
        return catchError(error)
    }
}