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

        const monthlySales = await OrderModel.aggregate([
            {
                $match: {
                    deletedAt: null,
                    orderStatus: { $in: ['processing', 'shipped', 'delivered'] }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    totalSales: { $sum: '$total' }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        return response(
            true,
            200,
            'Monthly sales fetched successfully.',
            monthlySales
        );

    } catch (error) {
        return catchError(error);
    }
}
