import { catchError, generateOTP, response } from "@/lib/helperFunction";

import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { connectDB } from "@/lib/databaseConnection";
import { otpEmail } from "@/emails/otpEmail";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";

export async function POST(request) {

    try {
        await connectDB()

        const payload = await request.json()

        const validationSchema = zSchema.pick({ email: true })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 401, 'Invalid or miassing input fields', validatedData.error)
        }

        const { email } = validatedData.data

        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()
        if (!getUser) {
            return response(false, 404, 'User not found');
        }

        // OTP Genration
        await OTPModel.deleteMany({ email }) // Deleting old otps
        const otp = generateOTP()

        // Store otp in database
        const newOtpData = new OTPModel({
            email, otp
        })
        await newOtpData.save();

        // Send OTP email
        const otpEmailStatus = await sendMail('Password reset OTP', email, otpEmail(otp))
        if (!otpEmailStatus.success) {
            return response(false, 400, 'Faild to resend OTP')
        }

        return response(true, 200, 'Please verify Your OTP')

    } catch (error) {
        return catchError(error)
    }
}