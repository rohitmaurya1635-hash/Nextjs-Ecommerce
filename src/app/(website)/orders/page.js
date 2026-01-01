'use client'

import Link from 'next/link'
import React from 'react'
import UserPageWrapper from '@/components/Application/Website/UserPageWrapper'
import { WEBSITE_ORDER_DETAILS } from '@/routes/WebsiteRoutes'
import useFetch from '@/hooks/useFetch'

const breadcrumb = {
    title: 'Orders',
    links: [{ label: 'Orders' }]
}

const UserOrderPage = () => {
    const { data: ordresData, loading } = useFetch('api/dashboard/user/orders')
    return (
        <UserPageWrapper breadcrumb={breadcrumb}>
            <div className='shadow rounded'>
                <div className='p-5 text-xl font-semibold border'>My Orders</div>

                <div className='p-5'>
                    {loading ?
                        <div className='text-center py-5'>Loading</div>
                        :
                        <div className='overflow-auto'>
                            <table className='w-full'>
                                <thead>
                                    <tr>
                                        <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Sr.No.</th>
                                        <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Order Id</th>
                                        <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Total Items</th>
                                        <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordresData && ordresData?.data?.map((order, i) => (
                                        <tr key={order._id}>
                                            <td className='text-start text-sm text-gray-500 p-2 font-bold'>{i + 1}</td>
                                            <td className='text-start text-sm text-gray-500 p-2 font-bold'>
                                                <Link className='underline hover:text-primary' href={WEBSITE_ORDER_DETAILS(order?.order_id)}>{order?.order_id}</Link>
                                            </td>
                                            <td className='text-start text-sm text-gray-500 p-2'>{order.products.length}</td>
                                            <td className='text-start text-sm text-gray-500 p-2'>{order.grandTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }

                </div>
            </div>
        </UserPageWrapper>
    )
}

export default UserOrderPage