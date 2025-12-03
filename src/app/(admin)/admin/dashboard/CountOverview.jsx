'use client'

import { ADMIN_CATEGORY_SHOW, ADMIN_CUSTOMER_SHOW, ADMIN_PRODUCT_SHOW } from '@/routes/AdminPanelRoutes'

import { BiCategory } from 'react-icons/bi'
import { IoShirtOutline } from 'react-icons/io5'
import Link from 'next/link'
import { LuUserRound } from 'react-icons/lu'
import { MdOutlineShoppingBag } from 'react-icons/md'
import React from 'react'
import useFetch from '@/hooks/useFetch'

const CountOverview = () => {

    const { data: countData } = useFetch('/api/dashboard/admin/count');
    return (
        <div className='grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5'>

            {/* Total Category */}
            <Link href={ADMIN_CATEGORY_SHOW}>
                <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-green-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-green-400' >
                    <div>
                        <h4 className='font-medium text-gray-500'>Total Categories</h4>
                        <span className='text-xl font-bold'>{countData?.data?.categoryCount || 0}</span>
                    </div>
                    <div>
                        <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-green-500 text-white'>
                            <BiCategory />
                        </span>
                    </div>
                </div>
            </Link>

            {/* Total Products */}
            <Link href={ADMIN_PRODUCT_SHOW}>
                <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-blue-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-blue-400' >
                    <div>
                        <h4 className='font-medium text-gray-500'>Total Products</h4>
                        <span className='text-xl font-bold'>{countData?.data?.productCount || 0}</span>
                    </div>
                    <div>
                        <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-blue-500 text-white'>
                            <IoShirtOutline />
                        </span>
                    </div>
                </div>
            </Link>

            {/* Total Customers */}
            <Link href={ADMIN_CUSTOMER_SHOW}>
                <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-yellow-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-yellow-400' >
                    <div>
                        <h4 className='font-medium text-gray-500'>Total Customers</h4>
                        <span className='text-xl font-bold'>{countData?.data?.userCount || 0}</span>
                    </div>
                    <div>
                        <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-yellow-500 text-white'>
                            <LuUserRound />
                        </span>
                    </div>
                </div>
            </Link>

            {/* Total Orders */}
            <Link href="#">
                <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-cyan-400 bg-white dark:bg-card dark:border-gray-800 dark:border-l-cyan-400' >
                    <div>
                        <h4 className='font-medium text-gray-500'>Total Orders</h4>
                        <span className='text-xl font-bold'>0</span>
                    </div>
                    <div>
                        <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-cyan-500 text-white'>
                            <MdOutlineShoppingBag />
                        </span>
                    </div>
                </div>
            </Link>

        </div>
    )
}

export default CountOverview