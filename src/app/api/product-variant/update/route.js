import { catchError, response } from "@/lib/helperFunction"

import ProductVariantModel from "@/models/ProductVariant.Model"
import { connectDB } from "@/lib/databaseConnection"
import { isAuthenticated } from "@/lib/authantication"
import { zSchema } from "@/lib/zodSchema"

export async function PUT(request) {
    try {
        // Check is admin
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const payload = await request.json()

        const validtionSchema = zSchema.pick({
            _id: true,
            product: true,
            sku: true,
            color: true,
            size: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
        }).refine(
            (data) => data.sellingPrice <= data.mrp,
            {
                message: "Selling Price must be less than or equal to MRP",
                path: ["sellingPrice"],
            }
        );

        const validatedData = validtionSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing input fields', validatedData.error)
        }

        const { _id, product, sku, color, size, mrp, sellingPrice, discountPercentage, media } = validatedData.data

        const getProductVariant = await ProductVariantModel.findOne({ deletedAt: null, _id })
        if (!getProductVariant) {
            return response(false, 404, 'Product variant not found')
        }


        getProductVariant.product = product
        getProductVariant.sku = sku
        getProductVariant.color = color
        getProductVariant.size = size
        getProductVariant.mrp = mrp
        getProductVariant.sellingPrice = sellingPrice
        getProductVariant.discountPercentage = discountPercentage
        getProductVariant.media = media

        await getProductVariant.save()

        return response(true, 200, 'Product variant updated successfully')

    } catch (error) {
        return catchError(error)
    }
}