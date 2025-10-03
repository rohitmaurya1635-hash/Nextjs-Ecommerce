import { catchError, generateOTP, response } from "@/lib/helperFunction";

import OTPModel from "@/models/Otp.model";
import { SignJWT } from "jose";
import UserModel from "@/models/User.model";
import { connectDB } from "@/lib/databaseConnection";
import { emailVerificationLink } from "@/emails/emailVerificationLink";
import { otpEmail } from "@/emails/otpEmail";
import { sendMail } from "@/lib/sendMail";
import z from "zod";
import { zSchema } from "@/lib/zodSchema";

export async function POST(request) {
    try {
        await connectDB()

        const payload = await request.json()

        const validationSchema = zSchema.pick({
            email: true
        }).extend({
            password: z.string()
        })

        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field.', validatedData.error)
        }

        const { email, password } = validatedData.data

        // Get User data
        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password");
        if (!getUser) {
            return response(false, 400, 'Invalid login Credentials');
        }

        // Resend emil verificatin link
        if (!getUser.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY);
            const token = await new SignJWT({ userId: getUser._id.toString() })
                .setIssuedAt()
                .setExpirationTime('1h')
                .setProtectedHeader({ alg: 'HS256' })
                .sign(secret);

            await sendMail('Email Verification request from Nextjs', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`));

            return response(false, 200, 'Your Email is not verified. We have sent a verification link to your registerd email address.')
        }

        // Validate password
        const isPasswordValid = await getUser.comparePassword(password)
        if (!isPasswordValid) {
            return response(false, 400, 'Invalid login Credentials2')
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
            return response(false, 400, 'Faild to send OTP')
        }

        return response(true, 200, 'Please verify your OTP')

    } catch (error) {
        return catchError(error)
    }
}