'use client'

import { HiMinus, HiPlus } from 'react-icons/hi2'
import React, { useEffect, useState } from 'react'
import { WEBSITE_CART, WEBSITE_CHECKOUT, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/WebsiteRoutes'
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { IoCloseCircleOutline } from 'react-icons/io5'
import Link from 'next/link'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'

const bredcrumbs = {
    title: 'Cart',
    links: [
        { label: 'Cart', href: WEBSITE_CART }
    ]
}

const CartPage = () => {
    const [subtotal, setSubtotal] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [total, setTotal] = useState(0)
    const cart = useSelector(store => store.cartStore)
    const dispatch = useDispatch()

    useEffect(() => {
        const cartProduct = cart.products
        const subtotalAmount = cartProduct.reduce((sum, product) => sum + (product.mrp * product.qty), 0)
        const discountAmount = cartProduct.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice) * product.qty), 0)
        const totalAmount = cartProduct.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0)

        setSubtotal(subtotalAmount)
        setDiscount(discountAmount)
        setTotal(totalAmount)
    }, [cart])

    return (
        <div>
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
                    <div className="lg:w-[70%] w-full">
                        <table className='w-full border'>
                            <thead className='border-b bg-gray-50 md:table-header-group hidden'>
                                <tr>
                                    <th className='text-start p-3'>Product</th>
                                    <th className='text-center p-3'>Price</th>
                                    <th className='text-center p-3'>Quantity</th>
                                    <th className='text-center p-3'>Total</th>
                                    <th className='text-center p-3'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.products.map(product => (
                                    <tr key={product.variantId} className='md:table-row block border-b'>
                                        <td className='p-3'>
                                            <div className='flex items-center gap-5'>
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
                                        <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center'>
                                            <span className='md:hidden font-medium'>Price</span>
                                            <div className='flex gap-1'>
                                                <span>{product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                                                <span className="text-sm line-through text-gray-500">{product.mrp.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                                            </div>
                                        </td>
                                        <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2'>
                                            <span className='md:hidden font-medium'>Quantity</span>
                                            <div className='flex items-center justify-center'>
                                                <div className="flex items-center justify-center md:h-10 h-7 border w-fit rounded-full">
                                                    <button type="button" className="h-full w-10 flex justify-center items-center cursor-pointer" onClick={() => dispatch(decreaseQuantity({ productId: product.productId, variantId: product.variantId }))} disabled={product.qty === 1}>
                                                        <HiMinus />
                                                    </button>
                                                    <input type="text" value={product.qty} className="md:w-14 w-5 text-center border-none outline-none" readOnly />
                                                    <button type="button" className="h-full w-10 flex justify-center items-center cursor-pointer" onClick={() => dispatch(increaseQuantity({ productId: product.productId, variantId: product.variantId }))}>
                                                        <HiPlus />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center'>
                                            <span className='md:hidden font-medium'>Total</span>
                                            <span>{(product.sellingPrice * product.qty).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                                        </td>

                                        <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center'>
                                            <span className='md:hidden font-medium'>Remove</span>
                                            <button type="button" onClick={() => dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))} className='text-red-500 cursor-pointer'>
                                                <IoCloseCircleOutline />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="lg:w-[30%] w-full">
                        <div className='rouded bg-gray-50 p-5 sticky top-5'>
                            <h4 className='text-lg font-semibold mb-5'>Order Summary</h4>
                            <div>
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
                                    </tbody>
                                </table>
                                <Button type="button" className="w-full bg-black rounded-full mt-5 mb-3" asChild>
                                    <Link href={WEBSITE_CHECKOUT}>Checkout</Link>
                                </Button>

                                <p className='text-center'>
                                    <Link href={WEBSITE_SHOP} className='hover:underline'>Continue Shopping</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default CartPage