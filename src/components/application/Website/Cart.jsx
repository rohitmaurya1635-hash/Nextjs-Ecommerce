'use client'

import React, { useEffect, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { WEBSITE_CART, WEBSITE_CHECKOUT } from "@/routes/WebsiteRoutes";
import { useDispatch, useSelector } from "react-redux";

import { BsCart2 } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { removeFromCart } from "@/store/reducer/cartReducer";
import { showToast } from '@/lib/showToast';

const Cart = () => {
    const [open, setOpen] = useState(false)
    const [subtotal, setSubtotal] = useState(0)
    const [discount, setDiscount] = useState(0)
    const cart = useSelector(store => store.cartStore)
    const dispatch = useDispatch()

    useEffect(() => {
        const cartProduct = cart.products
        const subtotalAmount = cartProduct.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0)
        const discountAmount = cartProduct.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice) * product.qty), 0)
        setSubtotal(subtotalAmount)
        setDiscount(discountAmount)
    }, [cart])

    return (
        <Sheet open={open} onOpenChange={setOpen} >
            <SheetTrigger className="relative">
                <BsCart2 size={25} className="text-gray-600 hover:text-primary cursor-pointer" />
                <span className='absolute bg-red-500 text-white rounded-full text-xs w-4 h-4 flex justify-center items-center -top-1 -right-2'>{cart.totalQty}</span>
            </SheetTrigger>
            <SheetContent className='sm:max-w-[450px] w-full'>
                <SheetHeader>
                    <SheetTitle className="text-2xl">My Cart</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>

                <div className="h-[calc(100vh-40px)] pb-10 pt-2">
                    <div className="h-[calc(100%-128px)] overflow-auto px-2">
                        {cart.totalQty === 0 && <div className="h-full flex justify-center items-center text-xl font-semibold">Your Cart Is Empty!</div>}

                        {cart.products.map((product) => (
                            <div key={product.variantId} className="flex justify-between items-center gap-5 mb-4 border-b pb-4">
                                <div className="flex gap-5 items-center">
                                    <Image
                                        src={product?.media || '/assets/images/img-placeholder.webp'}
                                        width={100}
                                        height={100}
                                        alt={product?.productName || 'Product Image'}
                                        className="h-20 w-20 rounded border"
                                    />
                                    <div>
                                        <h4 className="text-lg mb-1">{product.productName}</h4>
                                        <p className="text-gray-500">
                                            {product.size}/{product.color}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="text-red-500 underline underline-offset-1 mb-2 cursor-pointer px-2"
                                        onClick={() => dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))}
                                    >
                                        Remove
                                    </button>
                                    <p className="font-semibold">
                                        {product.qty} X {product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="h-32 border-t pt-5 px-2">
                        <h2 className="flex justify-between items-center text-lg font-semibold"><span>Subtotal</span><span>{subtotal?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></h2>
                        <h2 className="flex justify-between items-center text-lg font-semibold"><span>Discount</span><span>{discount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></h2>

                        <div className="flex justify-between gap-1 mt-2">
                            <Button type="button" variant="secondary" className='w-1/2' onClick={() => setOpen(false)} asChild>
                                <Link href={WEBSITE_CART}>View Cart</Link>
                            </Button>
                            <Button type="button" className='w-1/2' onClick={() => setOpen(false)} asChild>
                                {cart.totalQty
                                    ? <Link href={WEBSITE_CHECKOUT}>Checkout</Link>
                                    : <button type='button' onClick={() => showToast('error', 'Your cart is empty!')}>Checkout</button>
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default Cart