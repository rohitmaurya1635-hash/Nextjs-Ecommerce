import { catchError, response } from "@/lib/helperFunction";

import CouponModel from "@/models/Coupon.model";
import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authantication";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const filter = {
            deletedAt: null
        }

        const getCoupon = await CouponModel.find(filter).sort({ createdAt: -1 }).lean()

        if (!getCoupon) {
            return response(false, 404, 'Collection Empty')
        }

        return response(true, 200, 'Coupon found', getCoupon)

    } catch (error) {
        return catchError(error)
    }
}