import { catchError, response } from "@/lib/helperFunction";

import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.Model";
import ProductModel from "@/models/Product.Model";
import ProductVariantModel from "@/models/ProductVariant.Model";
import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authantication";

export async function GET(request) {
    try {
        // Check is admin
        await connectDB()

        const auth = await isAuthenticated('user')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }

        const userId = auth.userId

        const orders = await OrderModel.find({ user: userId })
            .populate('products.productId', 'name slug')
            .populate({
                path: 'products.variantId',
                populate: { path: 'media' }
            }).lean();

        return response(true, 200, 'dashboard Info', orders)
    } catch (error) {
        return catchError(error)
    }
}