import { catchError, isAuthenticated, response } from "@/lib/helperFunction";

import MediaModel from "@/models/Media.model";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import mongoose from "mongoose";

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

        const media = await MediaModel.find({ _id: { $in: ids } }).lean()
        if (!media.length) {
            return response(false, 400, 'Data not found')
        }

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid delete opration. Delete type should be SD or RSD')
        }

        if (deleteType === 'SD') {
            await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date().toISOString() } })
        }
        else {
            await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
        }
        return response(true, 200, deleteType === 'SD' ? 'Data moved into trash.' : 'Data restored.')

    } catch (error) {
        return catchError(error)
    }
}




export async function DELETE(request) {
    const session = await mongoose.startSession()
    session.startTransaction()
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

        const media = await MediaModel.find({ _id: { $in: ids } }).session(session).lean()
        if (!media.length) {
            return response(false, 400, 'Data not found')
        }

        if (!deleteType === 'PD') {
            return response(false, 400, 'Invalid delete opration. Delete type should be PD')
        }

        await MediaModel.deleteMany({ _id: { $in: ids } }).session(session)

        // delete all media from cloudinary
        const publicIds = media.map(m => m.public_id)

        try {
            await cloudinary.api.delete_resources(publicIds)
        } catch (error) {
            throw new Error(error.message)
        }

        await session.commitTransaction()
        session.endSession()

        return response(true, 200, 'Data deleted permanently')

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return catchError(error)
    }
}