import { catchError, response } from "@/lib/helperFunction";

import UserModel from "@/models/User.model";
import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated } from "@/lib/authantication";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const filter = {
            deletedAt: null
        }

        const getUser = await UserModel.find(filter).sort({ createdAt: -1 }).lean()

        if (!getUser) {
            return response(false, 404, 'Collection Empty')
        }

        return response(true, 200, 'User found', getUser)

    } catch (error) {
        return catchError(error)
    }
}