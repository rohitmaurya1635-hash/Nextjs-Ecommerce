import ProductDetail from './ProductDetail'
import React from 'react'
import axios from 'axios'

const ProductPage = async ({ params, searchParams }) => {
    const { slug } = await params
    const { color, size } = await searchParams

    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`
    if (color && size) url += `?color=${color}&size=${size}`

    const { data: getProduct } = await axios.get(url)

    if (!getProduct.success) {
        return (
            <div className='flex justify-center items-center py-36'>
                <h1 className='text-4xl font-semibold'>Product Not found</h1>
            </div>
        )
    }

    return (
        <ProductDetail
            product={getProduct?.data?.product}
            variant={getProduct?.data?.variant}
            colors={getProduct?.data?.colors}
            sizes={getProduct?.data?.sizes}
            reviewCount={getProduct?.data?.reviewCount}
        />
    )
}

export default ProductPage