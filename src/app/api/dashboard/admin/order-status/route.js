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

        const orderStatus = await OrderModel.aggregate([
            {
                $match: {
                    deletedAt: null,
                }
            },
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: 1 }
            }
        ]);

        return response(true, 200, 'Monthly sales fetched successfully.', orderStatus);

    } catch (error) {
        return catchError(error);
    }
}
