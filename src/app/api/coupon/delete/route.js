import { catchError, response } from "@/lib/helperFunction";

import CouponModel from "@/models/Coupon.model";
import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authantication";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const payload = await request.json();

        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid or Empty ids list.')
        }

        const getCoupon = await CouponModel.find({ _id: { $in: ids } }).lean()
        if (!getCoupon.length) {
            return response(false, 400, 'Data not found')
        }

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid delete opration. Delete type should be SD or RSD')
        }

        if (deleteType === 'SD') {
            await CouponModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date().toISOString() } })
        }
        else {
            await CouponModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
        }
        return response(true, 200, deleteType === 'SD' ? 'Data moved into trash.' : 'Data restored.')

    } catch (error) {
        return catchError(error)
    }
}




export async function DELETE(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const payload = await request.json();

        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid or Empty ids list.')
        }

        const getCoupon = await CouponModel.find({ _id: { $in: ids } }).lean()
        if (!getCoupon.length) {
            return response(false, 400, 'Data not found')
        }

        if (!deleteType === 'PD') {
            return response(false, 400, 'Invalid delete opration. Delete type should be PD')
        }

        await CouponModel.deleteMany({ _id: { $in: ids } })

        return response(true, 200, 'Data deleted permanently')

    } catch (error) { 
        return catchError(error)
    }
}