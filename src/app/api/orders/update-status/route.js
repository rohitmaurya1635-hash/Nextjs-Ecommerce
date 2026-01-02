import { catchError, response } from "@/lib/helperFunction";

import OrderModel from "@/models/Order.Model";
import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authantication";

export async function PUT(request) {
    try {
        await connectDB();

        // Check is admin
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }

        const { _id, status } = await request.json();

        if (!_id || !status) {
            return response(false, 400, 'Order id and status are required.')
        }

        const getOrder = await OrderModel.findById(_id)

        if (!getOrder) {
            return response(false, 404, 'Order not found');
        }

        getOrder.orderStatus = status

        await getOrder.save()

        return response(true, 200, 'Order Status updated successfully', getOrder);

    } catch (error) {
        return catchError(error);
    }
}
