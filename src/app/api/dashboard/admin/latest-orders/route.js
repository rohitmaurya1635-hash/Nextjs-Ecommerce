import { catchError, response } from "@/lib/helperFunction";

import OrderModel from "@/models/Order.Model";
import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authantication";

export async function GET() {
    try {
        // ✅ Connect DB first
        await connectDB();

        // ✅ Check admin auth
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.');
        }

        const latestOrders = await OrderModel.find({ deletedAt: null }).sort({ crearedAt: -1 }).limit(10).lean()

        return response(true, 200, 'Latest Order Fetched.', latestOrders);

    } catch (error) {
        return catchError(error);
    }
}
