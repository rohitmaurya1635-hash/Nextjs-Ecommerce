import { catchError, response } from "@/lib/helperFunction"

import CategoryModel from "@/models/Category.Model"
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

        const validtionSchema = zSchema.pick({ _id: true, name: true, slug: true })

        const validatedData = validtionSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing input fields', validatedData.error)
        }

        const {_id, name, slug } = validatedData.data

        const getCategory = await CategoryModel.findOne({ deletedAt: null, _id })
        if (!getCategory) {
            return response(false, 404, 'Category not found')
        }

        getCategory.name = name;
        getCategory.slug = slug
        await getCategory.save()

        return response(true, 200, 'Category updated successfully')

    } catch (error) {
        return catchError(error)
    }
}