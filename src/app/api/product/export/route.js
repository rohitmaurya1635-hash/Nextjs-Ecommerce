import { catchError, response } from "@/lib/helperFunction";

import ProductModel from "@/models/Product.Model";
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

        const getProduct = await ProductModel.find(filter).select('-media -description').sort({ createdAt: -1 }).lean()

        if (!getProduct) {
            return response(false, 404, 'Collection Empty')
        }

        return response(true, 200, 'Category found', getProduct)

    } catch (error) {
        return catchError(error)
    }
}