import { catchError, isAuthenticated, response } from "@/lib/helperFunction";

import MediaModel from "@/models/Media.model";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";

export async function POST(request) {
    const payload = await request.json()
    try {

        // Check is admin
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()
        const newMedia = await MediaModel.insertMany(payload)

        return response(true, 200, 'Media Uploaded Successfully.', newMedia)
    } catch (error) {
        if (payload && payload.length > 0) {
            const publicIds = payload.map(data => data.public_id)

            try {
                await cloudinary.api.delete_resources(publicIds)
            } catch (deleteError) {
                error.cloudnary = deleteError
            }
        }
        catchError(error)
    }
}