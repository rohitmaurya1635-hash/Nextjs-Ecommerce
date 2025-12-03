import { ADMIN_CATEGORY_ADD, ADMIN_COUPON_ADD, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ADD } from '@/routes/AdminPanelRoutes'

import { BiCategory } from 'react-icons/bi'
import { IoShirtOutline } from 'react-icons/io5'
import Link from 'next/link'
import { MdOutlinePermMedia } from 'react-icons/md'
import React from 'react'
import { RiCoupon2Line } from 'react-icons/ri'

const QuieckAdd = () => {
    return (
        <div className='grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5 mt-10'>

            {/* Add Category */}
            <Link href={ADMIN_CATEGORY_ADD}>
                <div className='flex items-center justify-between p-3 rounded-lg border shadow bg-white dark:bg-card bg-gradient-to-tr from-green-400 via-green-500 to-green-600 text-white dark:text-black'>
                    <h4 className='font-medium'>Add Category</h4>
                    <span className='w-12 h-12 border dark:border-green-800 flex justify-center items-center rounded-full bg-white dark:bg-card text-green-600'>
                        <BiCategory size={20} />
                    </span>
                </div>
            </Link>

            {/* Add Product */}
            <Link href={ADMIN_PRODUCT_ADD}>
                <div className='flex items-center justify-between p-3 rounded-lg border shadow bg-white dark:bg-card bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-600 text-white dark:text-black'>
                    <h4 className='font-medium'>Add Product</h4>
                    <span className='w-12 h-12 border dark:border-blue-800 flex justify-center items-center rounded-full bg-white dark:bg-card text-blue-600'>
                        <IoShirtOutline size={20} />
                    </span>
                </div>
            </Link>          

            {/* Add Coupon */}
            <Link href={ADMIN_COUPON_ADD}>
                <div className='flex items-center justify-between p-3 rounded-lg border shadow bg-white dark:bg-card bg-gradient-to-tr from-yellow-400 via-yellow-500 to-yellow-600 text-white dark:text-black'>
                    <h4 className='font-medium'>Add Coupon</h4>
                    <span className='w-12 h-12 border dark:border-yellow-800 flex justify-center items-center rounded-full bg-white dark:bg-card text-yellow-600'>
                        <RiCoupon2Line size={20} />
                    </span>
                </div>
            </Link>

            {/* Add Media */}
            <Link href={ADMIN_MEDIA_SHOW}>
                <div className='flex items-center justify-between p-3 rounded-lg border shadow bg-white dark:bg-card bg-gradient-to-tr from-cyan-400 via-cyan-500 to-cyan-600 text-white dark:text-black'>
                    <h4 className='font-medium'>Upload Media</h4>
                    <span className='w-12 h-12 border dark:border-cyan-800 flex justify-center items-center rounded-full bg-white dark:bg-card text-cyan-600'>
                        <MdOutlinePermMedia size={20} />
                    </span>
                </div>
            </Link>
        </div>
    )
}

export default QuieckAdd