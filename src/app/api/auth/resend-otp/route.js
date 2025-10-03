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
        const paylod = await request.json()

        const validationSchema = zSchema.pick({ email: true })

        const validatedData = validationSchema.safeParse(paylod)

        const { email } = validatedData.data;

        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input fields', validatedData.error)
        }

        const getUser = UserModel.findOne({ deletedAt: null, email })
        if (!getUser) {
            return response(false, 404, 'User not found')
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
        const otpEmailStatus = await sendMail('Your Login verification code', email, otpEmail(otp))
        if (!otpEmailStatus.success) {
            return response(false, 400, 'Faild to resend OTP')
        }

        return response(true, 200, 'OTP send successfully')

    } catch (error) {
        return catchError(error)
    }
}