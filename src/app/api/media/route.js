import MediaModel from "@/models/Media.model";
import { NextResponse } from "next/server";
import { catchError } from "@/lib/helperFunction";
import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authantication";

export async function GET(request) {
    try {
        // Check is admin
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const serchParams = request.nextUrl.searchParams;
        const page = parseInt(serchParams.get('page'), 10) || 0
        const limit = parseInt(serchParams.get('limit'), 10) || 10
        const deleteType = serchParams.get('deleteType') // SD => Soft delete, RSD=>Restore soft deleted, PD=>permanet delete

        let filter = {}
        if (deleteType === 'SD') {
            filter = { deletedAt: null }
        } else if (deleteType === 'PD') {
            filter = { deletedAt: { $ne: null } }
        }

        const mediaData = await MediaModel.find(filter).sort({ createdAt: -1 }).skip(page * limit).limit(limit).lean()
        const totalMedia = await MediaModel.countDocuments(filter)

        return NextResponse.json({
            mediaData: mediaData,
            hasMore: (page + 1) * limit < totalMedia
        })

    } catch (error) {
        return catchError(error)
    }
}