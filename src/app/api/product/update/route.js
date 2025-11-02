import { catchError, response } from "@/lib/helperFunction"

import ProductModel from "@/models/Product.Model"
import { connectDB } from "@/lib/databaseConnection"
import { encode } from "entities"
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
            name: true,
            slug: true,
            category: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
            description: true,
            media: true,
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

        const { _id, name, slug, category, mrp, sellingPrice, discountPercentage, description, media } = validatedData.data

        const getProduct = await ProductModel.findOne({ deletedAt: null, _id })
        if (!getProduct) {
            return response(false, 404, 'Product not found')
        }

        getProduct.name = name;
        getProduct.slug = slug
        getProduct.category = category
        getProduct.mrp = mrp
        getProduct.sellingPrice = sellingPrice
        getProduct.discountPercentage = discountPercentage
        getProduct.description = encode(description) 
        getProduct.media = media

        await getProduct.save()

        return response(true, 200, 'Product updated successfully')

    } catch (error) {
        return catchError(error)
    }
}