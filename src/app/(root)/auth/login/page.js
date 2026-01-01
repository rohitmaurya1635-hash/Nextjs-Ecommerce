'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import React, { useState } from 'react'
import { USER_DASHBOARD, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from '@/routes/WebsiteRoutes'

import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoutes'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import OTPVerification from '@/components/Application/OTPVerification'
import axios from 'axios'
import { login } from '@/store/reducer/authReducer'
import { showToast } from '@/lib/showToast'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import z from 'zod'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from "@hookform/resolvers/zod"

const LoginPage = () => {
    const dispatch = useDispatch()
    const searchParams = useSearchParams()
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
    const [isTypePassword, setIsTypePassword] = useState(true)
    const [otpEmail, setOtpEmail] = useState()

    const formSchema = zSchema.pick({
        email: true,
        password: true
    }).extend({
        password: z.string().min(3, "Password Field is required.")
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values) => {
        try {
            setLoading(true)
            const { data: loginResponse } = await axios.post('/api/auth/login', values)
            if (!loginResponse.success) {
                throw new Error(loginResponse.message)
            }
            setOtpEmail(values.email)
            form.reset()
            showToast('success', loginResponse.message)

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
            const { data: otpResponse } = await axios.post('/api/auth/verify-otp', values)
            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }
            setOtpEmail('')
            form.reset()
            showToast('success', otpResponse.message)

            dispatch(login(otpResponse.data))

            if (searchParams.has('callback')) {
                router.push(searchParams.get('callback'))
            } else {
                otpResponse.data.role === 'admin' ? router.push(ADMIN_DASHBOARD) : router.push(USER_DASHBOARD);
            }
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setOtpVerificationLoading(false)
        }
    }

    return (
        <Card className='w-md'>
            <CardContent>

                {!otpEmail
                    ?
                    <>
                        <div className='flex justify-center'>
                            <Image src='/assets/images/logo-black.png' width={150} height={150} alt='Logo' />
                        </div>

                        <div className='text-center'>
                            <h1 className='text-2xl font-semibold'>Login Into Account</h1>
                            <p>Login into your account by filling out the form below.</p>
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
                                                    <FormDescription>
                                                        Enter Your email address.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className='mb-5'>
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <div className='relative'>
                                                            <Input type={isTypePassword ? "password" : "text"} placeholder="**********" {...field} />
                                                            <button
                                                                type="button"
                                                                className='absolute top-1/2 right-2 cursor-pointer -translate-y-1/2'
                                                                onClick={() => setIsTypePassword(!isTypePassword)}
                                                            >
                                                                {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Enter Your Password.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <ButtonLoading type="submit" text="Login" loading={loading} className="w-full cursor-pointer" />
                                    </div>

                                    <div className='text-center'>
                                        <div className='flex justify-center items-center gap-1'>
                                            <p>Don&apos;t have account?</p>
                                            <Link href={WEBSITE_REGISTER} className='text-primary underline'>Create Account</Link>
                                        </div>
                                        <div className='mt-3'>
                                            <Link href={WEBSITE_RESETPASSWORD} className='text-primary underline'>Forget password?</Link>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </>
                    :
                    <OTPVerification email={otpEmail} onSubmit={handleOtpVerification} loading={otpVerificationLoading} />
                }
            </CardContent>
        </Card>
    )
}

export default LoginPage