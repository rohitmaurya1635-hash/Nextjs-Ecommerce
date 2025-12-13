import { IoIosArrowRoundForward } from 'react-icons/io'
import Link from 'next/link'
import ProductCard from './ProductCard'
import React from 'react'
import axios from 'axios'

const FeaturedProducts = async () => {

    const { data: productData } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/get-featured-products`);
    if (!productData) return null;

    return (
        <div>
            <div className='flex justify-between items-center mb-5'>
                <h2 className='sm:text-4xl text-2xl font-semibold'>Featured Products</h2>
                <Link href={"#"} className='flex items-center gap-2 underline underline-offset-4 hover:text-primary'>
                    View All  <IoIosArrowRoundForward />
                </Link>
            </div>
            <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-10 gap-2 '>
                {!productData.success && <div className='text-center py-5'>Data not found</div>}

                {productData.success && productData.data.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default FeaturedProducts