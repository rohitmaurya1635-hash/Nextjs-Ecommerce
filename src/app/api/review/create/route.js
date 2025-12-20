import { catchError, response } from "@/lib/helperFunction"

import ReviewModel from "@/models/Review.model"
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

        const validtionSchema = zSchema.pick({
            product: true,
            userId: true,
            rating: true,
            title: true,
            review: true,
        })

        const validatedData = validtionSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing input fields', validatedData.error)
        }

        const { product, userId, rating, title, review } = validatedData.data

        const newReview = new ReviewModel({ product, user: userId, rating, title, review })

        await newReview.save()

        return response(true, 200, 'Thank you for submitting your review.',)

    } catch (error) {
        return catchError(error)
    }
}