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

import ButtonLoading from '@/components/Application/ButtonLoading'
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input"
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoutes'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import z from 'zod'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from "@hookform/resolvers/zod"

const UpdatePassword = ({ email }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [isTypePassword, setIsTypePassword] = useState(true)

    const formSchema = zSchema.pick({
        email: true, password: true
    }).extend({
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password and Confirm password must be same.",
        path: ['confirmPassword']
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values) => {
        console.log(values);
        try {
            setLoading(true)
            const { data: passwordUpdateResponse } = await axios.put('/api/auth/reset-password/update-password', values)
            if (!passwordUpdateResponse.success) {
                throw new Error(passwordUpdateResponse.message)
            }
            form.reset()
            showToast('success', passwordUpdateResponse.message)
            router.push(WEBSITE_LOGIN);
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <div className='text-center'>
                <h1 className='text-2xl font-semibold'>Update Password</h1>
                <p>Create your new password by filling below form.</p>
            </div>

            <div className='mt-5'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
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
                            <ButtonLoading type="submit" text="Update Password" loading={loading} className="w-full cursor-pointer" />
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default UpdatePassword