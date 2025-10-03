import { catchError, response } from "@/lib/helperFunction";

import { SignJWT } from "jose";
import UserModel from "@/models/User.model";
import { connectDB } from "@/lib/databaseConnection";
import { emailVerificationLink } from "@/emails/emailVerificationLink";
import { sendMail } from "@/lib/sendMail";
import z from "zod";
import { zSchema } from "@/lib/zodSchema";

export async function POST(request) {
    try {
        // Connect DB
        await connectDB()
        
        const payload = await request.json()
       
        // Validation Schema
        const validationSchema = zSchema.pick({
            name: true, email: true, password: true
        })

        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field.', validatedData.error)
        }

        const { name, email, password } = validatedData.data

        // Chech user exist or not
        const checkUser = await UserModel.exists({ email })
        if (checkUser) {
            return response(true, 409, 'User allredy registerd')
        }

        // Register new user 
        const NewRegistration = new UserModel({
            name, email, password
        })

        await NewRegistration.save()

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT({ userId: NewRegistration._id.toString() })
        .setIssuedAt()
        .setExpirationTime('1h')
        .setProtectedHeader({alg: 'HS256'})
        .sign(secret);

        await sendMail('Email Verification request from Nextjs', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))

        return response(true, 200, 'Registration seccess, Please verify your email')

    } catch (error) {
        return catchError(error);
    }

}