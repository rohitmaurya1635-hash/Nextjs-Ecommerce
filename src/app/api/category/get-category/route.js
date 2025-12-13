import { catchError, response } from "@/lib/helperFunction";

import CategoryModel from "@/models/Category.Model";
import { connectDB } from "@/lib/databaseConnection";

export async function GET() {
    try { 
        await connectDB()

        const filter = {
            deletedAt: null
        }

        const getCategory = await CategoryModel.find(filter).lean()

        if (!getCategory) {
            return response(false, 404, 'Category not found')
        }
        return response(true, 200, 'Category found', getCategory)

    } catch (error) {
        return catchError(error)
    }
}