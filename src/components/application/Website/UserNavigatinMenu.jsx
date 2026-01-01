'use client'

import { USER_DASHBOARD, USER_ORDERS, USER_PROFILE, WEBSITE_LOGIN } from '@/routes/WebsiteRoutes'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import axios from 'axios'
import { logout } from '@/store/reducer/authReducer'
import { persistor } from '@/store/store'
import { showToast } from '@/lib/showToast'
import { useDispatch } from 'react-redux'

const UserNavigatinMenu = () => {
    const pathname = usePathname()
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = async () => {
        try {
            const { data: logoutResponse } = await axios.post('/api/auth/logout')
            if (!logoutResponse.success) {
                throw new Error(logoutResponse.message)
            }
            dispatch(logout())
            await persistor.purge();
            showToast(logoutResponse.message)
            router.push(WEBSITE_LOGIN)
        } catch (error) {
            showToast('error', error)
        }
    }

    return (
        <div className='border shadow-sm p-4 rounded'>
            <ul>
                <li className='mb-2'>
                    <Link href={USER_DASHBOARD} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_DASHBOARD) ? 'bg-primary text-white' : ''}`}>Dashboard</Link>
                </li>
                <li className='mb-2'>
                    <Link href={USER_PROFILE} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_PROFILE) ? 'bg-primary text-white' : ''}`}>My Profile</Link>
                </li>
                <li className='mb-2'>
                    <Link href={USER_ORDERS} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_ORDERS) ? 'bg-primary text-white' : ''}`}>Orders Detail</Link>
                </li>
                <li className='mb-2'>
                    <Button type='button' variant='destructive' onClick={handleLogout} className='w-full cursor-pointer'>Logout</Button>
                </li>
            </ul>
        </div>
    )
}

export default UserNavigatinMenu