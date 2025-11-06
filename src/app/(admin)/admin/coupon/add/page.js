'use client'

import { ADMIN_COUPON_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoutes'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const breadcrumbData = [
    { label: 'Home', href: ADMIN_DASHBOARD },
    { label: 'Coupons', href: ADMIN_COUPON_SHOW },
    { label: 'Add Coupon', href: "" },
]
const AddCoupon = () => {
    const [loading, setLoading] = useState(false);

    const formSchema = zSchema.pick({
        code: true,
        discountPercentage: true,
        minShoppingAmount: true,
        validity: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            discountPercentage: 0,
            minShoppingAmount: "",
            validity: "",
        },
    })
    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const { data: couponResponse } = await axios.post('/api/coupon/create', values)
            if (!couponResponse.success) {
                throw new Error(couponResponse.message)
            }
            form.reset()
            showToast('success', couponResponse.message)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-2 px-3 border-b [.border-b]:pb-2'>
                    <h4 className='font-semibold text-xl uppercase'>Add Coupon</h4>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='grid md:grid-cols-2 gap-5 mb-3'>

                                {/* Coupon Code */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Coupon Code<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter coupon code" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Discount Percentage */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="discountPercentage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Discount Percentage<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter Discount percentage" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Min Shopping Amount */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="minShoppingAmount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Min. Shopping Amount<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter Min. shopping amount" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Min Shopping Amount */}
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="validity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Validity<span className='text-red-500'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </div>

                            <div className='mb-3'>
                                <ButtonLoading type="submit" text="Add Coupon" loading={loading} className="cursor-pointer" />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddCoupon