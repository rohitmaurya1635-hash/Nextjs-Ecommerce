import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import React, { useState } from 'react'

import ButtonLoading from './ButtonLoading'
import axios from "axios"
import { showToast } from "@/lib/showToast"
import { useForm } from 'react-hook-form'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from "@hookform/resolvers/zod"

const OTPVerification = ({ email, onSubmit, loading }) => {
    const [isResendingOtp, setIsResendingOtp] = useState(false)
    const formSchema = zSchema.pick({
        otp: true,
        email: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
            email: email,
        },
    })

    const handleOtpVerification = async (values) => {
        onSubmit(values)
    }

    const resendOTP = async () => {
        try {
            setIsResendingOtp(true)
            const { data: loginResendResponse } = await axios.post('/api/auth/resend-otp', {email})
            if (!loginResendResponse.success) {
                throw new Error(loginResendResponse.message)
            }
            showToast('success', loginResendResponse.message)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setIsResendingOtp(false)
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOtpVerification)}>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Please complete verifictaion</h1>
                        <p className="text-md">We have sent One Time Password (OTP) to your rgistered email address. The OTP is valid for 10 minuts only.</p>

                    </div>

                    {/* OTP */}
                    <div className='my-5 flex justify-center'>
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-semibold'>One-time Password (OTP)</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot className='text-xl size-10' index={0} />
                                                <InputOTPSlot className='text-xl size-10' index={1} />
                                                <InputOTPSlot className='text-xl size-10' index={2} />
                                                <InputOTPSlot className='text-xl size-10' index={3} />
                                                <InputOTPSlot className='text-xl size-10' index={4} />
                                                <InputOTPSlot className='text-xl size-10' index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='mb-3'>
                        <ButtonLoading type="submit" text="Verify" loading={loading} className="w-full cursor-pointer" />
                        {isResendingOtp
                            ?
                            <span className="text-md">Resending...</span>
                            :
                            <div className="text-center mt-5">
                                <button type='button' onClick={resendOTP} className='text-blue-500 cursor-pointer hover:underline'>Resend OTP</button>
                            </div>
                        }
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default OTPVerification