import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoutes'

const ProductCard = ({ product }) => {
    return (
        <div className='rounded-lg hover:shadow-lg border overflow-hidden'>
            <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
                <Image
                    src={product?.media[0]?.secure_url || '/assets/images/img-placeholder.webp'}
                    width={400}
                    height={400}
                    alt={product?.media[0]?.alt || product?.name}
                    title={product?.media[0]?.title || product?.name}
                    className='w-full lg:h-[300px] md:h-48 h-40 object-cover object-top'
                />
                <div className='p-3 border-t'>
                    <h4>{product?.name}</h4>
                    <p className='flex gap-2 text-sm mt-2'>
                        <span className="line-through text-gray-400">
                            {Number(product?.mrp)?.toLocaleString('en-IN', {
                                style: 'currency',
                                currency: 'INR'
                            })}
                        </span>

                        <span className="font-semibold">
                            {Number(product?.sellingPrice)?.toLocaleString('en-IN', {
                                style: 'currency',
                                currency: 'INR'
                            })}
                        </span>
                    </p>
                </div>
            </Link>
        </div>
    )
}

export default ProductCard