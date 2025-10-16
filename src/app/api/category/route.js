import { catchError, response } from "@/lib/helperFunction";

import CategoryModel from "@/models/Category.Model";
import { NextResponse } from "next/server";
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
        const filters = JSON.parse(searchParams.get('filters') || [])
        const globalFilter = searchParams.get('globalFilter') || ""
        const sorting = JSON.parse(searchParams.get('sorting') || [])
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
                { name: { $regex: globalFilter, $options: 'i' } },
                { slug: { $regex: globalFilter, $options: 'i' } }
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
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    created: 1,
                    updatedAt: 1,
                    deletedAt: 1,
                }
            }
        ]

        // Execute query
        const getCategory = await CategoryModel.aggregate(aggregatePipeline)
        console.log
        // Get total row count
        const totalRowCount = await CategoryModel.countDocuments(matchQuery)

        return NextResponse.json({
            data: getCategory,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }
}