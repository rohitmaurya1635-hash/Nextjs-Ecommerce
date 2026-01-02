import { catchError, response } from "@/lib/helperFunction";

import CouponModel from "@/models/Coupon.model";
import { NextResponse } from "next/server";
import OrderModel from "@/models/Order.Model";
import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authantication";

export async function GET(request, { params }) {
    try {
        // Check is admin
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()
        const searchParams = request.nextUrl.searchParams;

        // Extract query parameters
        const start = parseInt(searchParams.get('start') || 0, 10)
        const size = parseInt(searchParams.get('size') || 10, 10)
        const filters = JSON.parse(searchParams.get('filters') || '[]')
        const globalFilter = searchParams.get('globalFilter') || ""
        const sorting = JSON.parse(searchParams.get('sorting') || '[]')
        const deleteType = searchParams.get('deleteType')

        // Build match query
        let matchQuery = {}

        // Check delete type
        if (deleteType === 'SD') {
            matchQuery = { deletedAt: null }
        } else if (deleteType === 'PD') {
            matchQuery = { deletedAt: { $ne: null } }
        }

        // Global filter
        if (globalFilter) {
            matchQuery["$or"] = [
                { order_id: { $regex: globalFilter, $options: 'i' } },
                { payment_id: { $regex: globalFilter, $options: 'i' } },
                { name: { $regex: globalFilter, $options: 'i' } },
                { email: { $regex: globalFilter, $options: 'i' } },
                { phone: { $regex: globalFilter, $options: 'i' } },
                { country: { $regex: globalFilter, $options: 'i' } },
                { state: { $regex: globalFilter, $options: 'i' } },
                { city: { $regex: globalFilter, $options: 'i' } },
                { pincode: { $regex: globalFilter, $options: 'i' } },
                { discount: { $regex: globalFilter, $options: 'i' } },
                { subtotal: { $regex: globalFilter, $options: 'i' } },
                { total: { $regex: globalFilter, $options: 'i' } },
                { couponDiscountAmount: { $regex: globalFilter, $options: 'i' } },
                { grandTotal: { $regex: globalFilter, $options: 'i' } },
            ]
        }

        // Column filtration
        filters.forEach(filter => {
            matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
        });

        // Sorting
        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        });

        // Agrigate pipeline
        const aggregatePipeline = [
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: 1 } },
            { $skip: start },
            { $limit: size },
        ]

        // Execute query
        const getorders = await OrderModel.aggregate(aggregatePipeline)

        // Get total row count
        const totalRowCount = await OrderModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getorders,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }
}