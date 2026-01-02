import { catchError, response } from "@/lib/helperFunction";

import OrderModel from "@/models/Order.Model";
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

        const getOrder = await OrderModel.find(filter).select("-products").sort({ createdAt: -1 }).lean()

        if (!getOrder) {
            return response(false, 404, 'Collection Empty')
        }

        return response(true, 200, 'Order found', getOrder)

    } catch (error) {
        return catchError(error)
    }
}