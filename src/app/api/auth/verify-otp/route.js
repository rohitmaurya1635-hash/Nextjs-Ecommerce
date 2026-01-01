import { catchError, response } from "@/lib/helperFunction";

import OTPModel from "@/models/Otp.model";
import { SignJWT } from "jose";
import UserModel from "@/models/User.model";
import { connectDB } from "@/lib/databaseConnection";
import { cookies } from "next/headers";
import { zSchema } from "@/lib/zodSchema";

export async function POST(request) {
    try {
        await connectDB()

        const paylod = await request.json()

        const validationSchema = zSchema.pick({ email: true, otp: true })

        const validatedData = validationSchema.safeParse(paylod)

        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field.', validatedData.error);
        }

        const { email, otp } = validatedData.data;

        // get OTP data
        const getOtpData = await OTPModel.findOne({ email, otp })
        if (!getOtpData) {
            return response(false, 404, 'Invalid or expired OTP')
        }

        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()
        if (!getUser) {
            return response(false, 404, 'User not found')
        }

        const loggedInUserData = {
            _id: getUser._id.toString(),
            role: getUser.role,
            name: getUser.name,
            avatar: getUser.avatar,
        }
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT(loggedInUserData)
            .setIssuedAt()
            .setExpirationTime('24h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret);

        const cookieStore = await cookies()
        cookieStore.set({
            name: 'access_token',
            value: token,
            httpOnly: process.env.NODE_ENV === 'production',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        })

        // remove otp after validation
        await getOtpData.deleteOne()
        return response(true, 200, 'Login Successfull', loggedInUserData)

    } catch (error) {
        return catchError(error)
    }

} 