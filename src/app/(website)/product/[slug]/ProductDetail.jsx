'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { HiMinus, HiPlus } from "react-icons/hi2"
import React, { useState } from 'react'
import { WEBSITE_CART, WEBSITE_HOME, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoutes"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "@/components/ui/button"
import ButtonLoading from "@/components/Application/ButtonLoading"
import Image from "next/image"
import { IoStar } from "react-icons/io5"
import Link from "next/link"
import Loading from "@/components/Application/Loading"
import ProductReview from "@/components/Application/Website/ProductReview"
import { addIntoCart } from "@/store/reducer/cartReducer"
import { decode } from "entities"
import { showToast } from "@/lib/showToast"
import { useEffect } from "react"

const ProductDetail = ({ product, variant, colors, sizes, reviewCount }) => {
    const [activeThumb, setActiveThumb] = useState()
    const [qty, setQty] = useState(1)
    const [isAddedIntoCart, setIsAddedIntoCart] = useState(false);
    const [isProductLoading, setIsProductLoading] = useState(false)
    const dispatch = useDispatch()
    const cartStore = useSelector(store => store.cartStore)

    useEffect(() => {
        setActiveThumb(variant.media[0].secure_url)
    }, [variant])

    useEffect(() => {
        if (cartStore.count > 0) {
            const existingProduct = cartStore.products.findIndex((cartProduct) => cartProduct.productId === product._id && cartProduct.variantId === variant._id)

            if (existingProduct >= 0) {
                setIsAddedIntoCart(true)
            } else {
                setIsAddedIntoCart(false)
            }
        }
        setIsProductLoading(false)
    }, [variant])


    const handleThumb = (thumbUrl) => {
        setActiveThumb(thumbUrl)
    }

    const handleQty = (actionType) => {
        setQty((prevQty) => {
            if (actionType === 'inc') return prevQty + 1;
            if (actionType === 'dec') return Math.max(1, prevQty - 1);
            return prevQty;
        });
    };

    const handleAddToCart = () => {
        const cartProduct = {
            productId: product._id,
            variantId: variant._id,
            productName: product.name,
            url: product.slug,
            size: variant.size,
            color: variant.color,
            mrp: variant.mrp,
            sellingPrice: variant.sellingPrice,
            media: variant?.media[0].secure_url,
            qty: qty,
        }
        dispatch(addIntoCart(cartProduct))
        setIsAddedIntoCart(true)
        showToast('success', 'Product added into cart')
    }

    return (
        <div className='lg:px-32 px-4'>
            {isProductLoading &&
                <div className="fixed top-1/2 left-1/2 -translate-1/2 z-50">
                    <Image
                        src='/assets/images/loading.svg'
                        height={80}
                        width={80}
                        alt='Loading...'
                    />
                </div>
            }

            <div className="my-10">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={WEBSITE_HOME}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={WEBSITE_SHOP}>Products</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{product?.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="md:flex justify-between items-start lg:gap-10 gap-5 mb-20">
                <div className="md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-0">
                    <div className="xl:order-last xl:mb-0 mb-5 xl:w-[calc(100%-144px)]">
                        <Image
                            src={activeThumb || '/assets/images/img-placeholder.webp'}
                            width={650}
                            height={650}
                            alt="Product"
                            className="border rounded max-w-full"
                        />
                    </div>
                    <div className="flex xl:flex-col items-center xl:gap-5 gap-3 xl:w-36 overflow-auto xl:pb-0 pb-0 max-h-[600px] ">
                        {variant?.media?.map((thumb) => (
                            <Image
                                key={thumb?._id}
                                src={thumb?.secure_url || '/assets/images/img-placeholder.webp'}
                                width={100}
                                height={100}
                                alt="Product Thumbnail"
                                className={`border rounded max-w-full ${thumb?.secure_url === activeThumb ? 'border-2 border-primary' : 'border'}`}
                                onClick={() => handleThumb(thumb?.secure_url || '/assets/images/img-placeholder.webp')}
                            />
                        ))}
                    </div>
                </div>

                <div className="md:w-1/2 md:mt-0 mt-5">
                    <h1 className="text-3xl font-semibold mb-2">{product?.name}</h1>
                    <div className="flex items-center gap-1 mb-5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <IoStar key={i} />
                        ))}
                        <span className="text-sm ps-2">({reviewCount}) Reviews</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-semibold">{variant.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                        <span className="text-sm line-through text-gray-500">{variant.mrp.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>

                        <span className="bg-red-500 rounded-2xl px-3 py-1 text-white text-xs ms-5">-{variant.discountPercentage}%</span>
                    </div>


                    <div
                        dangerouslySetInnerHTML={{
                            __html: decode(product?.description || "")
                        }}
                    />

                    <div className="mt-5">
                        <p className="mb-2">
                            <span className="font-semibold">Color:</span> {variant.color}
                        </p>
                        <div className="flex gap-5">
                            {colors.map(color => (
                                <Link
                                    key={color}
                                    href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${color}&size=${variant.size}`}
                                    onClick={() => setIsProductLoading(true)}
                                    className={`border py-1 px-3 rounded-lg cursor-pointer hover:bg-primary hover:text-white ${variant.color === color ? 'bg-primary text-white' : ''}`}
                                >
                                    {color}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5">
                        <p className="mb-2">
                            <span className="font-semibold">Size:</span> {variant.color}
                        </p>
                        <div className="flex gap-5">
                            {sizes.map(size => (
                                <Link
                                    key={size}
                                    href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${variant.color}&size=${size}`}
                                    onClick={() => setIsProductLoading(true)}
                                    className={`border py-1 px-3 rounded-lg cursor-pointer hover:bg-primary hover:text-white ${variant.size === size ? 'bg-primary text-white' : ''}`}
                                >
                                    {size}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5">
                        <p className="font-bold mb-2">Quantity</p>
                        <div className="flex items-center h-10 border w-fit rounded-full">
                            <button type="button" className="h-full w-10 flex justify-center items-center cursor-pointer" onClick={() => handleQty('dec')} disabled={qty === 1}>
                                <HiMinus />
                            </button>
                            <input type="text" value={qty} className="w-14 text-center border-none outline-none" readOnly />
                            <button type="button" className="h-full w-10 flex justify-center items-center cursor-pointer" onClick={() => handleQty('inc')}>
                                <HiPlus />
                            </button>
                        </div>
                    </div>

                    <div className="mt-5">
                        {!isAddedIntoCart ?
                            <ButtonLoading type="button" text="Add To Cart" className="w-full rounded-full py-6 text-md cursor-pointer" onClick={handleAddToCart} />
                            :
                            <Button type="button" asChild>
                                <Link href={WEBSITE_CART} className="w-full rounded-full py-6 text-md cursor-pointer">
                                    Go To Cart
                                </Link>
                            </Button>
                        }
                    </div>
                </div>
            </div>

            <div className="mb-10">
                <div className="shadow rounded border">
                    <div className="p-3 bg-gray-50 border-b">
                        <h2 className="font-semibold text-2xl">Product Description</h2>
                    </div>
                    <div className="p-3">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: decode(product?.description || "")
                            }}
                        />
                    </div>
                </div>
            </div>


            <div className="mb-20">
                <ProductReview productId={ product._id} />
            </div>


        </div>
    )
}

export default ProductDetail