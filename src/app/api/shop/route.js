import { catchError, response } from "@/lib/helperFunction";

import CategoryModel from "@/models/Category.Model";
import ProductModel from "@/models/Product.Model";
import { connectDB } from "@/lib/databaseConnection";

export async function GET(request) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        const size = searchParams.get('size');
        const color = searchParams.get('color');
        const categorySlug = searchParams.get('categories');
        const minPrice = parseInt(searchParams.get('minPrice')) || 0;
        const maxPrice = parseInt(searchParams.get('maxPrice')) || Number.MAX_SAFE_INTEGER;
        const search = searchParams.get('q');

        const limit = parseInt(searchParams.get('limit')) || 9;
        const page = parseInt(searchParams.get('page')) || 1;
        const skip = (page - 1) * limit;
        const sortingOptions = searchParams.get('sort') || 'default';

        let sortQuery = {};
        if (sortingOptions === 'default' || sortingOptions === 'newest') sortQuery = { createdAt: -1 };
        if (sortingOptions === 'asc') sortQuery = { name: 1 };
        if (sortingOptions === 'desc') sortQuery = { name: -1 };
        if (sortingOptions === 'price-asc') sortQuery = { sellingPrice: 1 };
        if (sortingOptions === 'price-desc') sortQuery = { sellingPrice: -1 };

        let categoryId = [];
        if (categorySlug) {
            const slugs = categorySlug.split(',')
            const categoryData = await CategoryModel.find({
                deletedAt: null,
                slug: { $in: slugs },
            })
                .select('_id')
                .lean();

            categoryId = categoryData.map(category => category._id)
        }

        let matchStage = {};
        if (categoryId.length > 0) matchStage.category = { $in: categoryId };

        if (search) {
            matchStage.name = { $regex: search, $options: 'i' };
        }

        const products = await ProductModel.aggregate([
            { $match: matchStage },
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: limit + 1 },
            {
                $lookup: {
                    from: 'productvariants',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'variants',
                },
            },
            {
                $addFields: {
                    variants: {
                        $filter: {
                            input: '$variants',
                            as: 'variant',
                            cond: {
                                $and: [
                                    size ? { $in: ['$$variant.size', size.split(',')] } : true,
                                    color ? { $in: ['$$variant.color', color.split(',')] } : true,
                                    { $gte: ['$$variant.sellingPrice', minPrice] },
                                    { $lte: ['$$variant.sellingPrice', maxPrice] },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $match: {
                    variants: {$ne: []}
                }
            },
            {
                $lookup: {
                    from: 'medias',
                    localField: 'media',
                    foreignField: '_id',
                    as: 'media',
                },
            },
        ])
        let nextPage = null
        if (products.length > limit) {
            nextPage = page + 1
            products.pop() // remove extra items
        }

        return response(true, 200, 'Products fetched successfully', { products, nextPage });
    } catch (error) {
        return catchError(error);
    }
}
