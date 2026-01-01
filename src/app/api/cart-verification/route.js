import { catchError, response } from "@/lib/helperFunction";

import ProductVariantModel from "@/models/ProductVariant.Model";
import { connectDB } from "@/lib/databaseConnection";

export async function POST(request) {
    try {
        await connectDB();

        const payload = await request.json();

        if (!Array.isArray(payload) || payload.length === 0) {
            return response(false, 400, "Invalid cart data");
        }

        const verifiedCartData = (
            await Promise.all(
                payload.map(async (cartItem) => {
                    const variant = await ProductVariantModel
                        .findById(cartItem.variantId)
                        .populate("product", "name slug")
                        .populate("media", "secure_url")
                        .lean();

                    if (!variant) return null;

                    return {
                        productId: variant.product._id,
                        variantId: variant._id,
                        productName: variant.product.name,
                        url: variant.product.slug,
                        size: variant.size,
                        color: variant.color,
                        mrp: variant.mrp,
                        sellingPrice: variant.sellingPrice,
                        media: variant.media?.[0]?.secure_url ?? null,
                        qty: Math.max(1, cartItem.qty),
                    };
                })
            )
        ).filter(Boolean);

        return response(true, 200, "Verified cart data", verifiedCartData);

    } catch (error) {
        return catchError(error);
    }
}
