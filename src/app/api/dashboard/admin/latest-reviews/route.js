import { catchError, response } from "@/lib/helperFunction";

import ReviewModel from "@/models/Review.model";
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

        const latestReviews = await ReviewModel.find({ deletedAt: null })
            .sort({ crearedAt: -1 })
            .populate({
                path: 'product',
                select: 'name media',
                populate: {
                    path: 'media',
                    select: 'secure_url'
                }
            })

        return response(true, 200, 'Latest Order Fetched.', latestReviews);

    } catch (error) {
        return catchError(error);
    }
}
