import { catchError, response } from "@/lib/helperFunction";

import MediaModel from "@/models/Media.model";
import ProductVariantModel from "@/models/ProductVariant.Model";
import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authantication";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const getParams = await params
        const id = getParams.id

        const filter = {
            deletedAt: null
        }

        if (!isValidObjectId(id)) {
            return response(false, 400, 'Invalid object id.')
        }

        filter._id = id

        const getproduct = await ProductVariantModel.findOne(filter).populate('media', '_id secure_url').lean()

        if (!getproduct) {
            return response(false, 404, 'Product variant not found')
        }
        return response(true, 200, 'Product variant found', getproduct)

    } catch (error) {
        return catchError(error)
    }
}