import { catchError, response } from "@/lib/helperFunction";

import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/Product.Model";
import ProductVariantModel from "@/models/ProductVariant.Model";
import ReviewModel from "@/models/Review.model";
import { connectDB } from "@/lib/databaseConnection";

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { slug } = await params;

        if (!slug) {
            return response(false, 404, 'Product not found');
        }

        const searchParams = request.nextUrl.searchParams;
        const size = searchParams.get('size');
        const color = searchParams.get('color');

        // get Product
        const product = await ProductModel.findOne({ slug, deletedAt: null }).populate('media', 'secure_url').lean();

        if (!product) {
            return response(false, 404, 'Product not found');
        }

        const variantFilter = { product: product._id };
        if (size) variantFilter.size = size;
        if (color) variantFilter.color = color;

        // get Product varient
        const variant = await ProductVariantModel.findOne(variantFilter).populate('media', 'secure_url').lean();

        if (!variant) {
            return response(false, 404, 'Product variants not found');
        }

        const colors = await ProductVariantModel.distinct('color', { product: product._id });
        const sizes = await ProductVariantModel.aggregate([
            { $match: { product: product._id } },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: '$size',
                    first: { $first: '$_id' }
                }
            },
            { $sort: { first: 1 } },
            { $project: { _id: 0, size: '$_id' } }
        ]);

        // get review 
        const reviewCount = await ReviewModel.countDocuments({ product: product._id });

        const productData = {
            product,
            variant,
            colors,
            sizes: sizes.map(item => item.size),
            reviewCount
        };

        return response(true, 200, 'Product found', productData);
    } catch (error) {
        return catchError(error);
    }
}
