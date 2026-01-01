import { catchError, response } from "@/lib/helperFunction";

import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.Model";
import ProductModel from "@/models/Product.Model";
import ProductVariantModel from "@/models/ProductVariant.Model";
import { connectDB } from "@/lib/databaseConnection";

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { orderid } = params;

        if (!orderid || typeof orderid !== 'string') {
            return response(false, 400, 'Order id is required.');
        }
        console.log(orderid)
        const getOrder = await OrderModel.findOne({
            order_id: orderid,
            deletedAt: null
        })
            .populate('products.productId', 'name slug')
            .populate({
                path: 'products.variantId',
                populate: { path: 'media' }
            })
            .lean();

        if (!getOrder) {
            return response(false, 404, 'Order not found');
        }

        return response(true, 200, 'Order found', getOrder);

    } catch (error) {
        return catchError(error);
    }
}
