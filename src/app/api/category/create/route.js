import { catchError, response } from "@/lib/helperFunction"

import CategoryModel from "@/models/Category.Model"
import { connectDB } from "@/lib/databaseConnection"
import { isAuthenticated } from "@/lib/authantication"
import { zSchema } from "@/lib/zodSchema"

export async function POST(request) {
    try {
        // Check is admin
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const payload = await request.json()

        const validtionSchema = zSchema.pick({ name: true, slug: true })

        const validatedData = validtionSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing input fields', validatedData.error)
        }

        const { name, slug } = validatedData.data

        const newCategory = new CategoryModel({ name, slug })

        await newCategory.save()

        return response(true, 200, 'Category craeted successfully',)

    } catch (error) {
        return catchError(error)
    }
}