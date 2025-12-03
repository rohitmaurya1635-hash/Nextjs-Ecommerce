import { catchError, response } from "@/lib/helperFunction";

import CategoryModel from "@/models/Category.Model";
import ProductModel from "@/models/Product.Model";
import UserModel from "@/models/User.model";
import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authantication";

export async function GET() {
    try {
        // Check is admin
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const [categoryCount, productCount, userCount] = await Promise.all([
            CategoryModel.countDocuments({ deletedAt: null }),
            ProductModel.countDocuments({ deletedAt: null }),
            UserModel.countDocuments({ deletedAt: null, role: 'user' }),
        ])

        return response(true, 200, 'Dashboard counts fetched successfully.', {
            categoryCount,
            productCount,
            userCount,
        })

    } catch (error) {
        return catchError(error)
    }
}