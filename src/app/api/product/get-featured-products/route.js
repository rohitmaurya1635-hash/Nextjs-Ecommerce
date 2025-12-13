import { catchError, response } from "@/lib/helperFunction";

import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/Product.Model";
import { connectDB } from "@/lib/databaseConnection";

export async function GET() {
    try {
        await connectDB()

        const filter = {
            deletedAt: null
        }

        const getproduct = await ProductModel.find(filter).populate('media', '_id secure_url').limit(8).lean()

        if (!getproduct) {
            return response(false, 404, 'Product not found')
        }
        return response(true, 200, 'Product found', getproduct)

    } catch (error) {
        return catchError(error)
    }
}