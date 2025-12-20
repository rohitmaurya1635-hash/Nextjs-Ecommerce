import { catchError, response } from "@/lib/helperFunction";

import ReviewModel from "@/models/Review.model";
import { connectDB } from "@/lib/databaseConnection";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('productId');

        if (!productId) {
            return response(false, 400, 'Product Id missing');
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return response(false, 400, 'Invalid product id');
        }

        const reviews = await ReviewModel.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId), deletedAt: null } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: -1 } },
        ]);

        // Total Reviews
        const totalReviews = reviews.reduce((sum, r) => sum + r.count, 0);

        // Average Rating (weighted)
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r._id * r.count, 0) / totalReviews
            : 0;

        const rating = reviews.reduce((acc, r) => {
            acc[r._id] = r.count
            return acc
        }, {})

        const percentage = reviews.reduce((acc, r) => {
            acc[r._id] = totalReviews > 0 ? (r.count / totalReviews) * 100 : 0
            return acc
        }, {})

        return response(true, 200, 'Reviews details fetched successfully', { totalReviews, averageRating, rating, percentage });
    } catch (error) {
        return catchError(error);
    }
}
