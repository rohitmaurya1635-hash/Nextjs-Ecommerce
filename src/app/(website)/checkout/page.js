'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useEffect, useState } from 'react'
import { WEBSITE_ORDER_DETAILS, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/WebsiteRoutes'
import { addIntoCart, clearCart } from '@/store/reducer/cartReducer'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { FaShippingFast } from 'react-icons/fa'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { IoCloseCircleSharp } from 'react-icons/io5'
import Link from 'next/link'
import Script from 'next/script'
import { Textarea } from '@/components/ui/textarea'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import useFetch from '@/hooks/useFetch'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import z from 'zod'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'

const bredcrumbs = {
    title: 'Checkout',
    links: [
        { label: 'Checkout', href: '' }
    ]
}

const Checkout = () => {
    const [verifiedCartData, setVerifiedCartData] = useState([])
    const [isCouponApplied, setIsCouponApplied] = useState(false)
    const [couponCode, setCouponCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [subtotal, setSubtotal] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [total, setTotal] = useState(0)
    const [grandTotal, setGrandTotal] = useState(0)
    const [couponDiscountAmount, setCouponDiscountAmount] = useState(0)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [savingOrder, setSavingOrder] = useState(false)
    const dispatch = useDispatch()
    const cart = useSelector(store => store.cartStore)
    const { auth } = useSelector(store => store.authStore)
    const router = useRouter()
    const { data: getVerifiedCartData } = useFetch("/api/cart-verification", "POST", { data: cart.products })

    useEffect(() => {
        if (getVerifiedCartData && getVerifiedCartData.success) {
            const cartData = getVerifiedCartData.data
            setVerifiedCartData(cartData)
            dispatch(clearCart())

            cartData.forEach(cartItem => {
                dispatch(addIntoCart(cartItem))
            });
        }
    }, [getVerifiedCartData])

    useEffect(() => {
        const cartProduct = cart.products
        const subtotalAmount = cartProduct.reduce((sum, product) => sum + (product.mrp * product.qty), 0)
        const discountAmount = cartProduct.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice) * product.qty), 0)
        const totalAmount = cartProduct.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0)

        setSubtotal(subtotalAmount)
        setDiscount(discountAmount)
        setTotal(totalAmount)
        setGrandTotal(totalAmount)
        form.setValue('minShoppingAmount', totalAmount)
    }, [cart])

    // Coupon form
    const formSchema = zSchema.pick({
        code: true,
        minShoppingAmount: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            minShoppingAmount: total,
        },
    })
    const onSubmit = async (values) => {
        try {
            setLoading(true)
            const { data: couponResponse } = await axios.post('/api/coupon/apply', values)
            if (!couponResponse.success) {
                throw new Error(couponResponse.message)
            }
            const discountPercentage = couponResponse.data.discountPercentage
            setCouponDiscountAmount((total * discountPercentage) / 100)
            setGrandTotal(total - ((total * discountPercentage) / 100))
            setIsCouponApplied(true)
            setCouponCode(form.getValues('code'))
            form.reset()
            showToast('success', couponResponse.message)

        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    const removeCoupon = () => {
        setIsCouponApplied(false)
        setCouponCode('')
        setCouponDiscountAmount(0)
        setGrandTotal(total)
        form.setValue('minShoppingAmount', total)
    }

    // Place Order
    const orderFormSchema = zSchema.pick({
        name: true,
        email: true,
        phone: true,
        country: true,
        state: true,
        city: true,
        pincode: true,
        landmark: true,
        ordernote: true,
    }).extend({
        userId: z.string().optional()
    })

    const orderForm = useForm({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            country: "",
            state: "",
            city: "",
            pincode: "",
            landmark: "",
            ordernote: "",
            userId: null,
        },
    })

    useEffect(() => {
        if (auth?._id) {
            orderForm.setValue('userId', auth?._id)
            orderForm.setValue('name', auth?.name)

        }
    }, [auth])

    const getorderId = async (amount) => {
        try {
            const { data: orderIdData } = await axios.post('/api/payment/get-order-id', { amount })
            if (!orderIdData.success) {
                throw new Error(orderIdData.error)
            }
            return { success: true, order_id: orderIdData.data }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    const placeOrder = async (value) => {
        setPlacingOrder(true)
        try {
            const genrateOrderId = await getorderId(grandTotal)
            if (!genrateOrderId.success) {
                throw new Error(genrateOrderId.message)
            }

            const order_id = genrateOrderId.order_id;

            const razOptions = {
                "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                "amount": Number(grandTotal) * 100,
                "currency": "INR",
                "name": "E-Store",
                "description": "Order placed",
                "image": "https://res.cloudinary.com/du84pvhbl/image/upload/v1766594148/logo-black_sh56dd.webp",
                "order_id": order_id,
                "handler": async function (response) {
                    setSavingOrder(true)
                    const products = verifiedCartData.map((cartItem) => ({
                        productId: cartItem.productId,
                        variantId: cartItem.variantId,
                        name: cartItem.productName,
                        qty: cartItem.qty,
                        mrp: cartItem.mrp,
                        sellingPrice: cartItem.sellingPrice,
                    }))

                    const { data: paymentResponseData } = await axios.post('api/payment/save-order', {
                        ...value,
                        ...response,
                        products: products,
                        subtotal: subtotal,
                        discount: discount,
                        total: total,
                        couponDiscountAmount: couponDiscountAmount,
                        grandTotal: grandTotal,
                    })

                    if (paymentResponseData.success) {
                        showToast('success', paymentResponseData.message)
                        dispatch(clearCart())
                        orderForm.reset()
                        router.push(WEBSITE_ORDER_DETAILS(response.razorpay_order_id))
                        setSavingOrder(false)
                    } else {
                        showToast('error', paymentResponseData.error)
                        setSavingOrder(false)
                    }
                },
                "prefill": {
                    "name": value.name,
                    "email": value.email,
                    "contact": value.number
                },
                "notes": {
                    "address": value.ordernote
                },
                "theme": {
                    "color": "#7c3aed"
                    // "color": "#3399cc"
                }
            }

            const rzp = new Razorpay(razOptions)

            rzp.on('payment.failed', function (response) {
                showToast('error', response.error.description)
            });

            rzp.open();

        } catch (error) {
            showToast('error', error.message)
        } finally {
            setPlacingOrder(false)
        }
    }


    return (
        <div>
            {savingOrder &&
                <div className="fixed top-1/2 left-1/2 -translate-1/2 z-50">
                    <Image
                        src='/assets/images/loading.svg'
                        height={80}
                        width={80}
                        alt='Loading...'
                    />
                </div>
            }
            <WebsiteBreadcrumb props={bredcrumbs} />

            {cart.totalQty === 0 ?
                <div className='w-screen h-96 flex justify-center items-center py-32'>
                    <div className='text-center'>
                        <h4 className='text-4xl font-semibold mb-5'>Your cart is empty!</h4>
                        <Button type="button" asChild>
                            <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
                :
                <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4'>
                    <div className="lg:w-[60%] w-full">
                        <div className='flex font-semibold gap-2 items-center'>
                            <FaShippingFast size={30} /> Shipping Address:
                        </div>
                        <div className='mt-5'>
                            <Form {...orderForm}>
                                <form className='grid grid-cols-2 gap-5' onSubmit={orderForm.handleSubmit(placeOrder)}>

                                    {/* Name */}
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Enter your name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="email" placeholder="Enter your email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Enter your phone" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* country */}
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name="country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Enter your country" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* state */}
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name="state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Enter your state" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* city */}
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Enter your city" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* pincode */}
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name="pincode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Enter your pincode" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* landmark */}
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name="landmark"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Enter your landmark" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* ordernote */}
                                    <div className='mb-3 col-span-2'>
                                        <FormField
                                            control={orderForm.control}
                                            name="ordernote"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea placeholder="Enter order note" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <ButtonLoading type='submit' text='Place Order' loading={placingOrder} className='bg-black rounded-full px-5 cursor-pointer' />
                                    </div>
                                </form>
                            </Form>

                        </div>
                    </div>
                    <div className="lg:w-[40%] w-full">
                        <div className='rouded bg-gray-50 p-5 sticky top-5'>
                            <h4 className='text-lg font-semibold mb-5'>Order Summary</h4>
                            <div>
                                <table className='w-full border'>
                                    <tbody>
                                        {verifiedCartData && verifiedCartData.map(product => (
                                            <tr key={product.variantId}>
                                                <td className='p-3'>
                                                    <div className='flex items-center gap-3'>
                                                        <Image
                                                            src={product?.media || '/assets/images/img-placeholder.webp'}
                                                            width={60}
                                                            height={60}
                                                            alt={product?.productName || 'Product Image'}
                                                        />
                                                        <div>
                                                            <h4 className='text-lg font-medium line-clamp-1'>
                                                                <Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>{product?.productName}</Link>
                                                            </h4>
                                                            <p className='text-sm'>Color: {product?.color}</p>
                                                            <p className='text-sm'>Size: {product.size}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='p-3 text-center'>
                                                    <div className='flex justify-center gap-1 text-nowrap text-sm'>
                                                        <span>{product.qty} X {product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                                                        <span className="text-sm line-through text-gray-500">{product.mrp.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <table className='w-full'>
                                    <tbody>
                                        <tr>
                                            <td className='font-medium py-2'>SubTotal</td>
                                            <td className='text-end py-2'>{subtotal?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                                        </tr>
                                        <tr>
                                            <td className='font-medium py-2'>Discount</td>
                                            <td className='text-end py-2'>- {discount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                                        </tr>
                                        <tr>
                                            <td className='font-medium py-2'>Total</td>
                                            <td className='text-end py-2'>{total?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                                        </tr>
                                        {isCouponApplied &&
                                            <tr>
                                                <td className='font-medium py-2'>Coupon Discount</td>
                                                <td className='text-end py-2'>- {couponDiscountAmount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                                            </tr>
                                        }

                                        <tr>
                                            <td className='font-medium py-2 text-xl'>Grand Total</td>
                                            <td className='text-end py-2'>{grandTotal?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className='mt-2 mb-2'>
                                    {!isCouponApplied
                                        ?
                                        <Form {...form}>
                                            <form className='flex justify-center gap-5' onSubmit={form.handleSubmit(onSubmit)}>

                                                {/* Email */}
                                                <div className='w-[calc(100%-100px)]'>
                                                    <FormField
                                                        control={form.control}
                                                        name="code"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input type="text" placeholder="Enter coupon code" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className='w-[100px]'>
                                                    <ButtonLoading type="submit" text="Apply" loading={loading} className="w-full cursor-pointer" />
                                                </div>
                                            </form>
                                        </Form>
                                        :
                                        <div className='flex justify-between py-1 px-5 rounded-lg bg-gray-200'>
                                            <div>
                                                <span className='text-xs'>Coupon:</span>
                                                <p className='text-sm font-semibold'>{couponCode}</p>
                                            </div>
                                            <button type='button' className='text-red-500 cursor-pointer' onClick={removeCoupon}>
                                                <IoCloseCircleSharp size={25} />
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <Script src='https://checkout.razorpay.com/v1/checkout.js' />
        </div>
    )
}

export default Checkout