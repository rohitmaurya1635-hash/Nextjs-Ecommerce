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
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoutes'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from "@hookform/resolvers/zod"

const registerpage = () => {
    const [loading, setLoading] = useState(false);
    const [isTypePassword, setIsTypePassword] = useState(true)

    const formSchema = zSchema.pick({
        name: true,
        email: true,
        password: true
    }).extend({
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password and Confirm password must be same.",
        path: ['confirmPassword']
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values) => {
        try {
            setLoading(true)
            const { data: registerResponse } = await axios.post('/api/auth/register', values)
            if (!registerResponse.success) {
                throw new Error(registerResponse.message)
            }
            form.reset()
            showToast('success', registerResponse.message)

        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <Card className='w-md'>
            <CardContent>
                <div className='flex justify-center'>
                    <Image src='/assets/images/logo-black.png' width={150} height={150} alt='Logo' />
                </div>

                <div className='text-center'>
                    <h1 className='text-2xl font-semibold'>Create Account</h1>
                    <p>Create new account by filling out the form below.</p>
                </div>

                <div className='mt-5'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>

                            {/* User Name */}
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>UserName</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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

                            {/* Password */}
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="**********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='mb-3'>
                                <ButtonLoading type="submit" text="Register" loading={loading} className="w-full cursor-pointer" />
                            </div>

                            <div className='text-center'>
                                <div className='flex justify-center items-center gap-1'>
                                    <p>Allredy have account?</p>
                                    <Link href={WEBSITE_LOGIN} className='text-primary underline'>Login</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>

            </CardContent>
        </Card>
    )
}

export default registerpage