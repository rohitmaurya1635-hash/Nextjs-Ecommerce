import { catchError, isAuthenticated, response } from "@/lib/helperFunction";

import MediaModel from "@/models/Media.model";
import { connectDB } from "@/lib/databaseConnection";
import { isValidObjectId } from "mongoose";
import { zSchema } from "@/lib/zodSchema";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const payload = await request.json()

        const validationSchema = zSchema.pick({
            _id: true,
            alt: true,
            title: true,
        })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing fields', validatedData.error)
        }

        const { _id, alt, title } = validatedData.data

        if (!isValidObjectId(_id)) {
            return response(false, 400, 'Invalid object id.')
        }

        const getMedia = await MediaModel.findById(_id)
        if (!getMedia) {
            return response(false, 404, 'Media not found')
        }

        getMedia.alt = alt
        getMedia.title = title
        await getMedia.save()
        
        return response(true, 200, 'Media Updated Successfully', getMedia)

    } catch (error) {
        return catchError(error)
    }
}