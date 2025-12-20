import { catchError, response } from "@/lib/helperFunction"

import ReviewModel from "@/models/Review.model"
import { connectDB } from "@/lib/databaseConnection"
import mongoose from "mongoose"

export async function GET(request) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('productId');
        const page = parseInt(searchParams.get('page')) || 0;
        const limit = 10;
        const skip = page * limit;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return response(false, 400, 'Invalid product id');
        }

        const matchQuery = {
            deletedAt: null,
            product: new mongoose.Types.ObjectId(productId),
        };

        const aggregation = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData',
                },
            },
            {
                $unwind: {
                    path: '$userData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit + 1 },
            {
                $project: {
                    _id: 1,
                    reviewedBy: '$userData.name',
                    avatar: '$userData.avatar',
                    rating: 1,
                    review: 1,
                    createdAt: 1,
                },
            },
        ];

        const reviews = await ReviewModel.aggregate(aggregation);
        const totalReview = await ReviewModel.countDocuments(matchQuery)

        let nextPage = null;
        if (reviews.length > limit) {
            reviews.pop();
            nextPage = page + 1;
        }

        return response(true, 200, 'Review data.', { reviews, nextPage, totalReview });
    } catch (error) {
        return catchError(error);
    }
}