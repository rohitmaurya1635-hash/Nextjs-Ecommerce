import { catchError, response } from "@/lib/helperFunction";

import UserModel from "@/models/User.model";
import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authantication";

export async function GET(request) {
    try {
        // Check is admin
        await connectDB()

        const auth = await isAuthenticated('user')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }

        const userId = auth.userId

        // Get user Profile
        const user = await UserModel.findById(userId).lean()

        return response(true, 200, 'User Profile', user)
    } catch (error) {
        return catchError(error)
    }
}