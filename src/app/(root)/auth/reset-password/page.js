'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import React, { useState } from 'react'

import ButtonLoading from '@/components/application/ButtonLoading'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import OTPVerification from '@/components/application/OTPVerification'
import UpdatePassword from '@/components/application/UpdatePassword'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoutes'
import axios from 'axios'
import { email } from 'zod'
import { login } from '@/store/reducer/authReducer'
import { showToast } from '@/lib/showToast'
import { useForm } from 'react-hook-form'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from "@hookform/resolvers/zod"

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
    const [otpEmail, setOtpEmail] = useState()
    const [isOtpVerified, setIsOtpVerified] = useState(false)

    const formSchema = zSchema.pick({ email: true })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (values) => {
        try {
            setLoading(true)
            const { data: sendOtpResponse } = await axios.post('/api/auth/reset-password/send-otp', values)
            if (!sendOtpResponse.success) {
                throw new Error(sendOtpResponse.message)
            }
            setOtpEmail(values.email)
            showToast('success', sendOtpResponse.message)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    // otp verification
    const handleOtpVerification = async (values) => {
        try {
            setOtpVerificationLoading(true)
            const { data: otpResponse } = await axios.post('/api/auth/reset-password/verify-otp', values)
            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }
            showToast('success', otpResponse.message)
            setIsOtpVerified(true)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setOtpVerificationLoading(false)
        }
    }
    return (
        <Card className='w-md'>
            <CardContent>
                <div className='flex justify-center'>
                    <Image src='/assets/images/logo-black.png' width={150} height={150} alt='Logo' />
                </div>
                {!otpEmail
                    ?
                    <>

                        <div className='text-center'>
                            <h1 className='text-2xl font-semibold'>Reset Password</h1>
                            <p>Enter Your Email for password reset.</p>
                        </div>

                        <div className='mt-5'>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>

                                    {/* Email */}
                                    <div className='mb-5'>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="example@gmail.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='mb-3'>
                                        <ButtonLoading type="submit" text="Send OTP" loading={loading} className="w-full cursor-pointer" />
                                    </div>

                                    <div className='text-center'>
                                        <div className='mt-3'>
                                            <Link href={WEBSITE_LOGIN} className='text-primary underline'>Back To Login</Link>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </>
                    :
                    <>
                        {!isOtpVerified
                            ?
                            <OTPVerification email={otpEmail} onSubmit={handleOtpVerification} loading={otpVerificationLoading} />
                            :
                            <UpdatePassword email={otpEmail} />
                        }
                    </>
                }
            </CardContent>
        </Card>
    )
}

export default ResetPassword